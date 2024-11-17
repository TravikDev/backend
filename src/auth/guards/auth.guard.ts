
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken'
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorators/auth.decorator';
import { AuthService } from '../auth.service';
import { UserRequest } from '../interfaces/user.interface';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
    private readonly reflector: Reflector
  ) { }

  async canActivate(context: ExecutionContext) {

    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) return true

    const request: UserRequest = context.switchToHttp().getRequest();
    const response: Response = context.switchToHttp().getResponse();

    const access = this.extractAccessTokenFromHeader(request);
    if (!access) throw new UnauthorizedException()
    try {
      const JWT_ACCESS = this.configService.get('JWT_ACCESS')
      const payload = jwt.verify(access, JWT_ACCESS)

      console.log('Access payload: ', payload)
      //@ts-ignore
      request.user = payload;

      return true
    } catch { console.error('Broken access token. Updating...') }

    try {
      const user = await this.extractRefreshTokenFromCookie(request);
      if (!user) throw new UnauthorizedException()
      const access = await this.authService.getCookieAccessJwtToken(user.id)
      // check expiration and update refresh if need 
      response.setHeader('Set-Cookie', access)

      return true
    } catch { throw new UnauthorizedException() }
  }

  private extractAccessTokenFromHeader(request: Request) {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  private extractRefreshTokenFromCookie(request: UserRequest) {
    const { user, cookies } = request
    const { Refresh } = cookies
    return this.authService.getUserByRefresh(Refresh, user.id)
  }
}

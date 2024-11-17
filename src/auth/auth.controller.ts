import {
  Controller, Get, Post, Body, HttpCode, Req, Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
// import { UpdateAuthDto } from './dto/update-auth.dto';
// import { UserRequest } from './interfaces/user.interface';
import { LoginAuthDto } from './dto/login-auth.dto.';
import { Request, Response } from 'express';
import { UserRequest } from './interfaces/user.interface';
import { Public } from './decorators/auth.decorator';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Public()
  @HttpCode(200)
  @Post('register')
  async register(@Body() data: CreateAuthDto) {
    return await this.authService.registerUser(data)
  }

  @Public()
  @HttpCode(200)
  @Post('login')
  async login(@Req() req: UserRequest, @Res() res: Response) {

    const { user } = req
    const { id } = user

    const access = await this.authService.getCookieAccessJwtToken(id);
    const refresh = await this.authService.getCookieRefreshJwtToken(id);

    await this.authService.setRefreshToken(refresh, id)

    res.setHeader('Set-Cookie', [access, refresh])

    return user;
  }

  @Post('logout')
  async logout(@Res() res: Response) {
    res.setHeader('Set-Cookie', this.authService.getCookieAccessLogout())
    return res.sendStatus(200);
  }

  @Get('profile')
  getProfile(@Req() req: UserRequest) {
    return req.user
  }

}

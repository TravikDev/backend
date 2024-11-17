import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { hashValue, hashVerifyValue } from 'src/utils/hashing';
import { ConfigService } from '@nestjs/config';
import { LoginAuthDto } from './dto/login-auth.dto.';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private configService: ConfigService,
  ) { }

  async registerUser(user: CreateAuthDto) {

    const { password: $p } = user
    const password = hashValue($p)
    const username = await this.usersService.createUser({ password, ...user })

    return username
  }

  async getAuthenticatedUser(loginData: LoginAuthDto) {

    const { username: $u, password: $p } = loginData

    const { password, ...user } = await this.usersService.getUserByUsername($u)
    const isContinue = user && hashVerifyValue($p, password)

    if (!isContinue) throw new BadRequestException()

    return user
  }

  async getCookieAccessJwtToken(userId: number) {

    const expiresIn = this.configService.get('JWT_ACCESS_EXP_TIME')
    const secretToken = this.configService.get('JWT_ACCESS')

    const token = jwt.sign({ userId }, secretToken, { expiresIn })

    return `Authorization=${token}; HttpOnly; Path=/; Max-Age=${expiresIn}`
    // return `Authentication=${token}; HttpOnly; Path=/; Max-Age=${expiresIn}`
  }

  async getCookieRefreshJwtToken(userId: number) {

    const expiresIn = this.configService.get('JWT_REFRESH_EXP_TIME')
    const secretToken = this.configService.get('JWT_REFRESH')

    const token = jwt.sign({ userId }, secretToken, { expiresIn })

    return `Refresh=${token}; HttpOnly; Path=/; Max-Age=${expiresIn}`
  }

  async setRefreshToken(token: string, userId: number) {
    const refreshToken = await hashValue(token)
    await this.usersService.updateUserById(userId, { refreshToken })
  }

  async getUserByRefresh(refresh: string, userId: number) {
    const user = await this.usersService.getUserById(userId)
    const isVerified = hashVerifyValue(refresh, user.refreshToken)
    if (!isVerified) throw new UnauthorizedException()
    return user
  }

  public getCookieAccessLogout() {
    return ['Authorization=; HttpOnly; Path=/; Max-Age=0', 'Refresh=; HttpOnly; Path=/; Max-Age=0']
  }

  // public getCookieRefreshLogout() {
  //   return `Refresh=; HttpOnly; Path=/; Max-Age=0`;
  // }

  // async signIn(username: string, pass: string): Promise<any> {
  //   const user = await this.usersService.findOne(username);
  //   if (user?.password !== pass) {
  //     throw new UnauthorizedException();
  //   }
  //   const { password, ...result } = user;
  //   // TODO: Generate a JWT and return it here
  //   // instead of the user object
  //   return result;
  // }
}
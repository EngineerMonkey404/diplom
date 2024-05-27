import { ConflictException, Injectable } from '@nestjs/common';
import { RegUserDto } from './dto/reg-user.dto';
import { User } from 'src/models/Users';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { Roles } from './roles/roles';

@Injectable()
export class AuthService {
  readonly tokenKey: string;
  readonly secretKey: string;
  readonly tokenTime: number;

  constructor(private jwt: JwtService, private cs: ConfigService) {
    this.tokenKey = cs.get('TOKEN_KEY');
    this.secretKey = cs.get('SECRET_KEY');
    this.tokenTime = cs.get('TOKEN_TIME');
  }

  cookieExtractor(req: Request) {
    return req.signedCookies?.[this.tokenKey] ?? null;
  }

  getUser(username: string) {
    return User.findByPk(username);
  }

  async regUser(data: RegUserDto, role = Roles.user) {
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(data.password, salt);
    return User.create({
      username: data.username,
      pwdHash: hash,
      role,
    });
  }

  giveToken(user: User, res: Response) {
    const token = this.jwt.sign({ username: user.username });
    res.cookie(this.tokenKey, token, {
      maxAge: this.tokenTime,
      httpOnly: true,
      signed: true,
    });
  }

  purgeToken(res: Response) {
    res.cookie(this.tokenKey, undefined);
  }

  async validateUser(data: LoginDto) {
    const user = await this.getUser(data.username);
    if (user && (await bcrypt.compare(data.password, user.pwdHash)))
      return user;
    else return null;
  }

  async devAuth(res: Response) {
    const adminLogin = this.cs.get('ADMIN_LOGIN'),
      adminPwd = this.cs.get('ADMIN_PWD');
    const admin =
      (await this.getUser(adminLogin)) ??
      (await this.regUser(
        { username: adminLogin, password: adminPwd },
        Roles.admin,
      ));

    this.giveToken(admin, res);
    return admin;
  }
}

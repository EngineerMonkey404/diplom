import { Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { User } from 'src/models/Users';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private cs: ConfigService, private as: AuthService) {
    super({
      jwtFromRequest: as.cookieExtractor.bind(as),
      ignoreExpiration: false,
      secretOrKey: cs.get('SECRET_KEY') ?? 'secret_key',
    });
  }

  async validate(payload: { username: string }): Promise<User | null> {
    console.log('valid', payload);
    return this.as.getUser(payload.username);
  }
}

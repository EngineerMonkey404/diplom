import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { RolesGuard } from './roles/roles.guard';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from 'src/models/Users';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (cs: ConfigService) => {
        console.log(cs.get('SECRET_KEY'));
        return {
          secret: cs.get('SECRET_KEY') ?? 'secret_key',
          signOptions: {
            expiresIn: cs.get('TOKEN_TIME'),
          },
        };
      },
    }),
    SequelizeModule.forFeature([User]),
  ],
  providers: [AuthService, JwtStrategy, LocalStrategy, RolesGuard],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}

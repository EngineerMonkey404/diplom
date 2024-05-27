import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthService } from './auth.service';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { RegUserDto } from './dto/reg-user.dto';
import { User } from 'src/models/Users';

@ApiTags('Аутентификация')
@Controller('auth')
export class AuthController {
  constructor(private as: AuthService) {}

  @UseGuards(JwtAuthGuard)
  @Get('login')
  getLogin(@Req() req: Request & { user: any }) {
    return req.user;
  }

  @ApiBody({ type: LoginDto })
  @UseGuards(LocalAuthGuard)
  @Post('login')
  postLogin(@Req() req, @Res({ passthrough: true }) res: Response) {
    this.as.giveToken(req.user, res);
    return { ...req.user.dataValues, pwdHash: undefined };
  }

  @ApiBody({ type: RegUserDto })
  @UseGuards(JwtAuthGuard)
  @Post('register')
  async registerUser(@Body() user: RegUserDto, @Res() res) {
    if (!(await this.as.getUser(user.username))) {
      await this.as.regUser(user);
      return res.status(HttpStatus.OK).json({
        message: 'User has been created successfully',
        user,
      });
    } else
      return res.status(HttpStatus.OK).json({
        message: 'User already exists',
      });
  }

  @Delete('login')
  purgeLogin(@Res({ passthrough: true }) res: Response) {
    this.as.purgeToken(res);
  }

  @Get('dev')
  dev(@Req() req, @Res({ passthrough: true }) res: Response) {
    return this.as.devAuth(res);
  }
}

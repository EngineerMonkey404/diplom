import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  SequelizeModuleOptions,
  SequelizeOptionsFactory,
} from '@nestjs/sequelize';
import * as fs from 'fs';
import * as path from 'path';
import { Sequelize } from 'sequelize-typescript';
// import { User } from '../models/User';

@Injectable()
export class SequelizeConfigService implements SequelizeOptionsFactory {
  private files = [];

  constructor(private configService: ConfigService) {}

  createSequelizeOptions(): SequelizeModuleOptions {
    return {
      dialect: 'postgres',
      host: this.configService.get('DB_HOST', 'localhost'),
      port: this.configService.get('DB_PORT', 5432),
      username: this.configService.get('DB_USER'),
      password: this.configService.get('DB_PASS'),
      database: this.configService.get('DB_NAME'),
      synchronize: this.configService.get('NODE_ENV') !== 'test',
      autoLoadModels: true,
      //   models: [User],

      pool: {
        max: 50,
        min: 5,
      },
    };
  }

  async insertSQL(sequelize: Sequelize) {
    for (const file of this.files) {
      console.log(`Executing ${file}`);
      const sql: string = fs.readFileSync(file, 'utf-8');
      await sequelize.query(sql);
    }
  }
}

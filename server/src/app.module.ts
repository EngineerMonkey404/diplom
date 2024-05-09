import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeConfigService } from './config/database.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Models3DModule } from './models3d/models.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `${process.env.NODE_ENV}.env`,
      isGlobal: true,
    }),

    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      useClass: SequelizeConfigService,
      inject: [ConfigService],
    }),

    Models3DModule,
  ],
  providers: [SequelizeConfigService],
})
export class AppModule {}

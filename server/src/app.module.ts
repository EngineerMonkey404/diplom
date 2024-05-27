import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeConfigService } from './config/database.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Models3DModule } from './models3d/models.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { DetailsDocumentationModule } from './details-documentation/details-documentation.module';
import { Models3DCollectionModule } from './model3d-collections/models3DCollection.module';
import { AuthModule } from './auth/auth.module';

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
    DetailsDocumentationModule,
    Models3DCollectionModule,
    AuthModule,
  ],
  providers: [SequelizeConfigService],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Models3D } from 'src/models/Models3D';
import { Models3DController } from './models.controller';
import { Models3DService } from './models.service';

@Module({
  imports: [SequelizeModule.forFeature([Models3D])],
  controllers: [Models3DController],
  providers: [Models3DService],
})
export class Models3DModule {}

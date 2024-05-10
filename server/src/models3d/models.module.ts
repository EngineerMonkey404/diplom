import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Models3D } from 'src/models/Models3D';
import { Models3DController } from './models.controller';
import { Models3DService } from './models.service';
import { Models3DCollection } from 'src/models/Models3DCollection';
import { DetailsDocumentation } from 'src/models/DetailsDocumentation';

@Module({
  imports: [
    SequelizeModule.forFeature([
      Models3D,
      Models3DCollection,
      DetailsDocumentation,
    ]),
  ],
  controllers: [Models3DController],
  providers: [Models3DService],
})
export class Models3DModule {}

import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Models3DCollectionController } from './models3DCollection.controller';
import { Models3DCollection } from 'src/models/Models3DCollection';
import { Models3DCollectionService } from './models3DCollection.service';

@Module({
  imports: [SequelizeModule.forFeature([Models3DCollection])],
  controllers: [Models3DCollectionController],
  providers: [Models3DCollectionService],
})
export class Models3DCollectionModule {}

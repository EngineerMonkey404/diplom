import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { DetailsDocumentation } from 'src/models/DetailsDocumentation';
import { DetailsDocumentationController } from './details-documentation.controller';
import { DetailsDocumentationService } from './details-documentation.service';

@Module({
  imports: [SequelizeModule.forFeature([DetailsDocumentation])],
  controllers: [DetailsDocumentationController],
  providers: [DetailsDocumentationService],
})
export class DetailsDocumentationModule {}

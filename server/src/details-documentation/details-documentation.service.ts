import { CreateDetailsDocumentationDto } from './dto/CreateDetailsDocumentationDto';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ConfigService } from '@nestjs/config';
import { DetailsDocumentation } from 'src/models/DetailsDocumentation';

@Injectable()
export class DetailsDocumentationService {
  constructor(
    @InjectModel(DetailsDocumentation)
    private readonly detailsDocumentation: typeof DetailsDocumentation,
    private readonly configService: ConfigService,
  ) {}

  getDocumentation(modelId: number, detailId: number) {
    return this.detailsDocumentation.findOne({ where: { modelId, detailId } });
  }
  async createDocumentation(documentation: CreateDetailsDocumentationDto) {
    return (await this.detailsDocumentation.create({ ...documentation })).id;
  }

  updateDocumentation(
    detailId: number,
    newDocumentation: CreateDetailsDocumentationDto,
  ) {
    this.detailsDocumentation.update(
      { documentation: newDocumentation.documentation },
      { where: { detailId, modelId: newDocumentation.modelId } },
    );
  }

  deleteDocumentation(detailId: string, modelId: number) {
    this.detailsDocumentation.destroy({ where: { detailId, modelId } });
  }
}

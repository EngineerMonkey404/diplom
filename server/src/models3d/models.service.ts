import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Models3D } from 'src/models/Models3D';
import { IModels3D } from './types/model3d.interface';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';
import { Op } from 'sequelize';
import { Models3DCollection } from 'src/models/Models3DCollection';
import { IModels3DCollection } from './types/collection.interface';
import { DetailsDocumentation } from 'src/models/DetailsDocumentation';

@Injectable()
export class Models3DService {
  constructor(
    @InjectModel(Models3D) private readonly models3D: typeof Models3D,
    @InjectModel(Models3DCollection)
    private readonly models3DCollection: typeof Models3DCollection,
    @InjectModel(DetailsDocumentation)
    private readonly detailsDocumentation: typeof DetailsDocumentation,
    private readonly configService: ConfigService,
  ) {}

  getModels(search: string, page: number) {
    return this.models3D.findAll({
      limit: 10,
      offset: 10 * (page - 1),
      where: { fileName: { [Op.like]: `%${search}%` } },
      include: [this.models3DCollection, this.detailsDocumentation],
    });
  }

  async addModel(fileName: string, html: string) {
    return (await this.models3D.create({ fileName, html })).id;
  }

  async updateModel(model3d: IModels3D, newFile: Express.Multer.File) {
    const prevFile = (
      await this.models3D.findOne({ where: { id: model3d.id } })
    ).fileName;
    const p = join(
      process.cwd(),
      this.configService.get('MODELS3D_PATH'),
      prevFile,
    );
    if (existsSync(p)) await fs.unlink(p);
    this.models3D.update(model3d, { where: { id: model3d.id } });
  }

  async deleteModel(id: number) {
    const prevFile = (await this.models3D.findOne({ where: { id } })).fileName;
    const p = join(
      process.cwd(),
      this.configService.get('MODELS3D_PATH'),
      prevFile,
    );
    if (existsSync(p)) await fs.unlink(p);
    this.models3D.destroy({ where: { id } });
  }

  getModel(id: number) {
    return this.models3D.findOne({ where: { id } });
  }

  async getFileById(id: number) {
    return (await this.models3D.findOne({ where: { id } })).fileName;
  }
}

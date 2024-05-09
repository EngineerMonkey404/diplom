import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Models3D } from 'src/models/Models3D';
import { IModels3D } from './types/model3d.interface';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs/promises';
import { join } from 'path';

@Injectable()
export class Models3DService {
  constructor(
    @InjectModel(Models3D) private readonly models3D: typeof Models3D,
    private readonly configService: ConfigService,
  ) {}

  async addModel(fileName: string, html: string) {
    return (await this.models3D.create({ fileName, html })).id;
  }

  // Todo Сделать проверку на существование файлов

  async updateModel(model3d: IModels3D, newFile: Express.Multer.File) {
    const prevFile = (
      await this.models3D.findOne({ where: { id: model3d.id } })
    ).fileName;
    await fs.unlink(
      join(process.cwd(), this.configService.get('MODELS3D_PATH'), prevFile),
    );
    this.models3D.update(model3d, { where: { id: model3d.id } });
  }

  async deleteModel(id: number) {
    const prevFile = (await this.models3D.findOne({ where: { id } })).fileName;
    await fs.unlink(
      join(process.cwd(), this.configService.get('MODELS3D_PATH'), prevFile),
    );
    this.models3D.destroy({ where: { id } });
  }

  getModel(id: number) {
    return this.models3D.findOne({ where: { id } });
  }
}

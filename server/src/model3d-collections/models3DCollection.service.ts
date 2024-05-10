import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { IModels3DCollection } from 'src/details-documentation/types/collection.interface';
import { ConfigService } from '@nestjs/config';
import { Models3D } from 'src/models/Models3D';
import { Models3DCollection } from 'src/models/Models3DCollection';

@Injectable()
export class Models3DCollectionService {
  constructor(
    @InjectModel(Models3DCollection)
    private readonly models3DCollection: typeof Models3DCollection,
    private readonly configService: ConfigService,
  ) {}
  async createCollection(collection: IModels3DCollection) {
    console.log(collection);
    return (await this.models3DCollection.create({ ...collection })).id;
  }

  updateCollection(collectionId: number, title: string, details: string) {
    console.log(title, collectionId, details);
    this.models3DCollection.update(
      { title, details },
      { where: { id: collectionId } },
    );
  }

  deleteCollection(collectionId: number) {
    this.models3DCollection.destroy({ where: { id: collectionId } });
  }
}

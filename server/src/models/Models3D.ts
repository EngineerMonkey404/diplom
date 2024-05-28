import { DetailsDocumentation } from 'src/models/DetailsDocumentation';
import {
  AllowNull,
  AutoIncrement,
  Column,
  DataType,
  HasMany,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { Models3DCollection } from './Models3DCollection';
@Table({})
export class Models3D extends Model {
  @PrimaryKey
  @AllowNull(false)
  @AutoIncrement
  @Column
  id: number;

  @Column
  fileName: string;

  @Column
  previewImageName: string;

  @Column({ type: DataType.TEXT })
  html: string;

  @HasMany(() => Models3DCollection)
  collection: string[];

  @HasMany(() => DetailsDocumentation)
  detailsDocumentation: DetailsDocumentation;
}

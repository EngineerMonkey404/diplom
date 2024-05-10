import {
  AllowNull,
  AutoIncrement,
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { Models3D } from './Models3D';
@Table({})
export class Models3DCollection extends Model {
  @PrimaryKey
  @AllowNull(false)
  @AutoIncrement
  @Column
  id: number;

  @ForeignKey(() => Models3D)
  @Column
  modelId: number;

  @Column
  title: string;

  @AllowNull(true)
  @Column(DataType.ARRAY(DataType.TEXT))
  details: string[];

  @BelongsTo(() => Models3D)
  model3D: Models3D;
}

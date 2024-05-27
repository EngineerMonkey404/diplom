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
export class DetailsDocumentation extends Model {
  // @PrimaryKey
  // @AllowNull(false)
  // @AutoIncrement
  // @Column
  // id: number;

  @PrimaryKey
  @Column({ type: DataType.STRING })
  detailId: string;

  @PrimaryKey
  @ForeignKey(() => Models3D)
  @Column
  modelId: number;

  @Column
  documentation: string;

  @BelongsTo(() => Models3D)
  model3D: Models3D;
}

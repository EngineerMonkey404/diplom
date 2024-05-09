import {
  AllowNull,
  AutoIncrement,
  Column,
  DataType,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
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
  html: string;

  // @AllowNull(true)
  // @Column(DataType.ARRAY(DataType.INTEGER))
  // views: number[];
}

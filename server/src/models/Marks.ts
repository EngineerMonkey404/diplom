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
export class Marks extends Model {
  @PrimaryKey
  @AllowNull(false)
  @AutoIncrement
  @Column
  id: number;

  @Column
  detailPath: string;

  @Column
  information: string;

  @Column(DataType.JSON)
  coordinates: object;
}

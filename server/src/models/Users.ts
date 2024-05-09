import { Column, Index, Model, PrimaryKey, Table } from 'sequelize-typescript';
import { Roles } from 'src/auth/roles/roles';

@Table({ comment: 'Пользователь' })
export class User extends Model {
  @Index
  @PrimaryKey
  @Column
  username: string;

  @Column
  pwdHash: string;
  @Column
  role: Roles;
}

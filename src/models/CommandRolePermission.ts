import { Column, ForeignKey, Model } from 'sequelize-typescript';
import Command from './Command';
import Role from './Role';

class CommandRolePermission extends Model{
  @ForeignKey(() => Command)
  @Column
  commandId!: number;

  @ForeignKey(() => Role)
  @Column
  roleId!: number;
}

export default CommandRolePermission;
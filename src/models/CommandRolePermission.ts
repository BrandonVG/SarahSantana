import { Column, ForeignKey, Model } from 'sequelize-typescript';
import Command from './Command';
import Role from './Role';
import { DataTypes } from 'sequelize';

class CommandRolePermission extends Model {
  @ForeignKey(() => Command)
  @Column({ type: DataTypes.INTEGER })
  commandId!: number;

  @ForeignKey(() => Role)
  @Column({ type: DataTypes.INTEGER })
  roleId!: number;
}

export default CommandRolePermission;
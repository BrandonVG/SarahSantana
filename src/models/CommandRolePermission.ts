import { Column, ForeignKey, Model, PrimaryKey, Table } from 'sequelize-typescript';
import Command from './Command';
import Role from './Role';
import { DataTypes } from 'sequelize';

@Table
class CommandRolePermission extends Model {
  @ForeignKey(() => Command)
  @Column({ type: DataTypes.INTEGER, unique: false })
  commandId!: number;

  @Column({ type: DataTypes.STRING})
  guildId!: string;

  @ForeignKey(() => Role)
  @Column({ type: DataTypes.STRING, unique: false })
  roleId!: string;
}

export default CommandRolePermission;
import { Model, Column, PrimaryKey, BelongsToMany } from 'sequelize-typescript';
import { DataTypes } from 'sequelize';
import Command from './Command';
import CommandRolePermission from './CommandRolePermission';

class Role extends Model {
  @PrimaryKey
  @Column({ type: DataTypes.STRING })
  roleId!: string;

  @Column({ type: DataTypes.BOOLEAN, defaultValue: false })
  isEmployee!: boolean;

  @Column({ type: DataTypes.BOOLEAN, defaultValue: false })
  isWorking!: boolean;

  @Column({ type: DataTypes.STRING})
  guildId!: string;

  @BelongsToMany(() => Command, () => CommandRolePermission)
  commands!: Command[];
}

export default Role;
import { BelongsToMany, Column, Model } from 'sequelize-typescript';
import Role from './Role';
import CommandRolePermission from './CommandRolePermission';
import { DataTypes } from 'sequelize';

class Command extends Model {
  @Column({ type: DataTypes.STRING })
  name!: string;

  @Column({ type: DataTypes.STRING })
  description!: string;

  @BelongsToMany(() => Role, () => CommandRolePermission)
  roles!: Role[];
}

export default Command;
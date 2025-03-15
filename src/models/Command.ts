import { BelongsToMany, Column, Model } from 'sequelize-typescript';
import Role from './Role';
import CommandRolePermission from './CommandRolePermission';

class Command extends Model {
  @Column
  name!: string;

  @BelongsToMany(() => Role, () => CommandRolePermission)
  roles!: Role[];
}

export default Command;
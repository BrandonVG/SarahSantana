import { Model, Column, HasMany } from 'sequelize-typescript';
import { DataTypes } from 'sequelize';
import HoursRegistry from './HoursRegistry';

class Employee extends Model {
  @Column({ type: DataTypes.STRING, primaryKey: true })
  discordId!: string;

  @Column({ type: DataTypes.BOOLEAN, defaultValue: false })
  paidBonus!: boolean;

  @Column({ type: DataTypes.BOOLEAN, defaultValue: false })
  isWorking!: boolean;

  @Column({ type: DataTypes.STRING})
  guildId!: string;

  @HasMany(() => HoursRegistry)
  hoursRegistries!: HoursRegistry[];
  
}

export default Employee;
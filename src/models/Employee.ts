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

  @HasMany(() => HoursRegistry)
  hoursRegistries!: HoursRegistry[];
  
}

export default Employee;
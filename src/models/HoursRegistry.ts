
import { Model, Table, Column, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { DataTypes } from 'sequelize';
import Employee from './Employee';

@Table
class HoursRegistry extends Model {
  @ForeignKey(() => Employee)
  @Column({ type: DataTypes.STRING })
  employeeId!: string;

  @Column({ type: DataTypes.DATE })
  startTime!: Date;

  @Column({ type: DataTypes.DATE, allowNull: true })
  endTime?: Date;

  @Column({ type: DataTypes.BIGINT, defaultValue: 0 })
  workedHours!: number;

  @BelongsTo(() => Employee)
  employee!: Employee;
}

export default HoursRegistry;
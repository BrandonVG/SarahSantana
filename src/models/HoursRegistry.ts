
import { Model, Table, Column, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { DataTypes } from 'sequelize';
import Employee from './Employee';

@Table
class HoursRegistry extends Model {
  @ForeignKey(() => Employee)
  @Column({ type: DataTypes.STRING })
  employee_id!: string;

  @Column({ type: DataTypes.DATE })
  start_time!: Date;

  @Column({ type: DataTypes.DATE, allowNull: true })
  end_time?: Date;

  @Column({ type: DataTypes.FLOAT, defaultValue: 0 })
  worked_hours!: number;

  @BelongsTo(() => Employee)
  employee!: Employee;
}

export default HoursRegistry;
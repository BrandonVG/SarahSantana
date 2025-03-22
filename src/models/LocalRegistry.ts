
import { Model, Table, Column } from 'sequelize-typescript';
import { DataTypes } from 'sequelize';

@Table
class LocalRegistry extends Model {

  @Column({ type: DataTypes.DATE })
  startTime!: Date;

  @Column({ type: DataTypes.DATE, allowNull: true })
  endTime?: Date;

  @Column({ type: DataTypes.BIGINT, defaultValue: 0 })
  workedHours!: number;

  @Column({ type: DataTypes.STRING, allowNull: true })
  messageId?: string;

  @Column({ type: DataTypes.STRING})
  guildId!: string;
}

export default LocalRegistry;
import { Sequelize } from 'sequelize-typescript';
import path from 'path';

const sequelize = new Sequelize({
  database: 'database',
  dialect: 'sqlite',
  username: 'root',
  password: '',
  storage: './database.sqlite',
  models: [path.join(__dirname, '../models')],
});

export default sequelize ;
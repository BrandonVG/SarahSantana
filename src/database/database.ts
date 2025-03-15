import { Sequelize } from 'sequelize-typescript';

const sequelize = new Sequelize({
  database: 'database',
  dialect: 'sqlite',
  username: 'root',
  password: '',
  storage: './database.sqlite',
  models: [__dirname + '../models'],
});

export default sequelize ;
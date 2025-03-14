import { Sequelize } from 'sequelize-typescript';

const sequelize = new Sequelize({
  database: 'database',
  dialect: 'sqlite',
  username: 'root',
  password: '',
  storage: ':memory:',
  models: ['../models'],
});

export { sequelize };
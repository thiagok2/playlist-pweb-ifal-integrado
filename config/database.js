//const { Sequelize } = require('sequelize');//arquivos que vc instalou dependencias
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv'//arquivos que vc instalou dependencias

dotenv.config(); // Carrega as variáveis de ambiente

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'postgres', // ou 'mysql'
    port: process.env.DB_PORT
  }
);

export default sequelize;

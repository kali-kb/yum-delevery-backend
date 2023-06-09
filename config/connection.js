const { Sequelize } = require('sequelize');
require('dotenv').config();



// const sequelize = new Sequelize('yum', 'root', '', {
//   host: '127.0.0.1',
//   dialect: 'mysql'
// });

const sequelize = new Sequelize({
  dialect: 'mysql',
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

module.exports = sequelize
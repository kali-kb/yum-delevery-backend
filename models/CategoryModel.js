// const Dish = require('./DishModel')
const { Sequelize } = require('sequelize');
const sequelize = require('../config/connection')


const Category = sequelize.define('Category', {
  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  description: {
    type: Sequelize.TEXT,
    allowNull: true
  },
  img_url: {
    type: Sequelize.STRING,
    allowNull: true
  },

}, {timestamps:false});


// Category.sync({alter: true})


module.exports = Category;
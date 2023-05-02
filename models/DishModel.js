const { Sequelize } = require('sequelize');
const Category = require('./CategoryModel')
const sequelize = require('../config/connection')


const Dish = sequelize.define('Dish', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },

  description: {
    type: Sequelize.TEXT,
    allowNull: true
  },
  price: {
    type: Sequelize.DECIMAL(10, 2),
    allowNull: false
  },
  ingredients: {
    type: Sequelize.JSON,
    allowNull: false
  },
  img_url: {
    type: Sequelize.STRING,
    allowNull: false
  }
}, {
    timestamps:false,
    tableName: 'Dishes'
   } 
);


Dish.belongsTo(Category, { foreignKey: 'categoryId' });

// Dish.sync({force: true, alter:true})

module.exports = Dish;

'use strict';

const Category = require('../models/CategoryModel')
const Dish = require('../models/DishModel')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */

    const dishes = [ 
    
    {  
      id: 1,
      name: 'Cheese Burger',
      description: 'Deliciously juicy beef patty, melted cheese, and crisp lettuce, all sandwiched between a soft sesame seed bun – our classic Cheeseburger is a must-try for burger lovers everywhere!',
      price: 2.99,
      ingredients: {
        data: ["Cheese", "Lettuce", "Meat", "Mayonaise", "Onions", "Salt"]
      },
      img_url: 'https://res.cloudinary.com/djlxfcael/image/upload/v1682844210/image_4_th9dud.png',
      categoryId: 1
    },

    {
      id: 2,
      name: 'Veggies Burger',
      description: 'Creamy burger dish with chicken and parmesan cheese.',
      price: 2.12,
      ingredients: {
        data: [
          'fettuccine',
          'chicken',
          'parmesan cheese',
          'garlic',
          'parsley'
        ]
      },
      img_url: 'https://res.cloudinary.com/djlxfcael/image/upload/v1682844196/image_7_bcjgl6.png',
      categoryId: 1
    },
    {
      id: 3,
      name: 'Chocolate donut',
      description: 'Classic Neapolitan pizza with tomato sauce, mozzarella cheese, and basil.',
      price: 1.55,
      ingredients: {
        data:[
          'chocolate',
          'sauce',
          'soy milk',
          'basil'
        ]
      },
      img_url: 'https://res.cloudinary.com/djlxfcael/image/upload/v1682844213/image_9_oiufhv.png',
      categoryId: 2
    },
    {
      id: 4,
      name: 'Greek Salad',
      description: 'Fresh grilled salmon served with steamed vegetables and a lemon butter sauce.',
      price: 3.89,
      ingredients: {
        data: [
          'salmon fillet',
          'broccoli', 
          'carrots',
          'lemon butter sauce'
        ]
      },
      img_url: 'https://res.cloudinary.com/djlxfcael/image/upload/v1683023842/catbird_image_3_lijryk.png',
      categoryId: 3
    },

    {
      id: 5,
      name: 'Cobb Salad',
      description: 'Fresh grilled salad served with steamed vegetables and a lemon butter sauce.',
      price: 3.29,
      ingredients: {
        data: [
          'eggs',
          'broccoli',
          'carrots',
          'lemon butter sauce',
          'lettuce',
          'onions',
          'kale',
          'salad'
        ],
      },
      img_url: 'https://res.cloudinary.com/djlxfcael/image/upload/v1683023837/catbird_image_4_nwedha.png',
      categoryId: 3
    
    },


    {
      id: 6,
      name: 'Strawberry banana smoothie',
      description: 'A refreshing and fruity drink made with ripe strawberries and sweet bananas. Perfect for a quick and healthy snack on the go.',
      price: 1.54,
      ingredients: {
        data: [
          'strawberry',
          '1/2 spoon sugar',
          'milk',
          'lemon butter sauce'
        ]
      },
      img_url: 'https://res.cloudinary.com/djlxfcael/image/upload/v1683024611/catbird_image_6_fhcz2l.png',
      categoryId: 4
    },

    {
      id: 7,
      name: 'French Fries',
      description: 'Crispy on the outside and fluffy on the inside, our French fries are the perfect side dish for any meal.',
      price: 0.76,
      ingredients: {
        data: [
          'potato',
          '1/2 spoon salt',
          'food oil',
        ]
      },
      img_url: 'https://res.cloudinary.com/djlxfcael/image/upload/v1682844203/image_6_y5xzlr.png'
    },

    {
      id: 8,
      name: 'Vanilla frosted donut',
      description: 'Fresh grilled salad served with steamed vegetables and a lemon butter sauce.',
      price: 1.99,
      ingredients: {
        data: [
          'vanilla cream',
          'donut',
          'lemon butter sauce'
        ]
      },
      img_url: 'https://res.cloudinary.com/djlxfcael/image/upload/v1683024171/catbird_image_5_mwpdpb.png',
      categoryId: 3
    },

    {
      id: 9,
      name: 'Peanut butter and jelly donut',
      description: 'Fresh grilled salad served with steamed vegetables and a lemon butter sauce.',
      price: 0.89,
      ingredients: {
        data: [
          'salmon fillet',
          'broccoli',
          'carrots',
          'lemon butter sauce'
        ]
      },
      img_url: 'https://res.cloudinary.com/djlxfcael/image/upload/v1683025937/catbird_image_7_bjx3hb.png',
      categoryId: 3
    },

    {
      id: 10,
      name: 'Turkey burger',
      description: 'A juicy and flavorful burger made with lean turkey meat. Topped with your favorite fixings, its a healthier take on a classic favorite.',
      price: 2.97,
      ingredients: {
        data: [
          'salmon fillet',
          'broccoli',
          'carrots',
          'lemon butter sauce'
        ]
      },
      img_url: 'https://res.cloudinary.com/djlxfcael/image/upload/v1683026858/catbird_image_8_bcx5mx.png',
      categoryId: 1
    },

  ];




    await Dish.bulkCreate(dishes);

  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};

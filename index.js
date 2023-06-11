const express = require('express');
const { Sequelize, Op  } = require('sequelize');
const Category = require('./models/CategoryModel')
const bodyParser = require('body-parser');
const Dish = require('./models/DishModel')
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./swagger.yaml'); 
const app = express();
const sequelize = require('./config/connection')
const CategoryModel = require('./models/CategoryModel')
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
require('dotenv').config();

(async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection to database successful!');
    // await sequelize.sync({ force: false }); // If force is true, it will drop tables and re-create them.
    // console.log('All models were synchronized successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
})();

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const User = sequelize.define('User', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true
  },
  password: {
  	type: Sequelize.STRING,
  	allowNull: false,
  }
}, {timestamps:false});

// User.sync({ force: true })

// User.sync()


const Wish = sequelize.define('Wish', {
  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },

  date: {
    type: Sequelize.DATEONLY,
    allowNull: false
  }
}, {timestamps:false});

Wish.belongsTo(User, { foreignKey: 'userId' }); // Set up the User association
Wish.belongsTo(Dish, {foreignKey: 'dishId'});
Dish.belongsTo(Wish)
// Dish.sync()



// Wish.sync()

const LineItem = sequelize.define('LineItem', {
  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },

  quantity: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 1
  }
}, {timestamps:false});

LineItem.belongsTo(Dish, { foreignKey: 'dishId' });
LineItem.belongsTo(User, { foreignKey: 'userId' });

Dish.belongsTo(LineItem)






// Category.sync()

const Order = sequelize.define('Order', {
  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  additional_customer_info: {
    type: Sequelize.JSON,
    allowNull: true
  },
  date: {
    type: Sequelize.DATE,
    allowNull: false,
    defaultValue: Sequelize.NOW
  },
  fullfilled: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },


}, {timestamps:false});


Order.belongsTo(LineItem, { foreignKey: 'lineItemId'})
// Order.hasMany(LineItem, { foreignKey: 'itemId' }); // Set up the Item association
Order.belongsTo(User, { foreignKey: 'userId' }); // Set up the User association


// sequelize.sync()

// LineItem.sync()
// Order.sync()

// routes

//test endpoint
app.get('/', (req, res) => {
  res.send('Hello, World!');
});


app.post('/create-user', async (req, res) => {
  if (!req.body.email) {
    return res.status(400).json({ error: 'Email is required' });
  }
  const { email, password } = req.body;
  try {
    const user = await User.create({ email, password });
    return res.status(201).json({ user });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Server error' });
  }
});


app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user with given email exists in database
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Email not found' });
    }

    // Check if password is correct
    if (user.password !== password) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    // Login successful
    return res.status(200).json({ success: true, user });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

//home --> categories and dishes
app.get('/home', async (req, res) => {
  const limit = req.query.limit || 10; // Default limit is 10
  try {
    const categories = await Category.findAll({
      limit: limit,
      logging: console.log
    });
    const dishes = await Dish.findAll({
      limit: limit,
      attributes: { exclude: ['dish', 'WishId', 'LineItemId'] },
      logging: console.log
    });
    res.json({
      categories: categories,
      dishes: dishes
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

//category list
app.get('/categories', async (req, res) => {
  try {
    const categories = await Category.findAll();
    res.json(categories);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Something went wrong' });
  }
});

//dishes per category
app.get('/categories/:categoryId/dishes', async (req, res) => {

  const categoryId = req.params.categoryId;
  
  try {
    const category = await Category.findByPk(categoryId);

    if (!category) {
      return res.status(404).json({ message: `Category with id ${categoryId} not found` });
    }

    const dishes = await Dish.findAll({
      where: { categoryId: categoryId },
      attributes: ['id', 'name', 'description', 'price', 'ingredients', 'img_url']
    });

    res.json({category, dishes});
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }

});

//list of dishes
app.get('/dishes', async (req, res) => {
  try {
    const dishes = await Dish.findAll({attributes: { exclude: ['WishId', 'LineItemId'] }});
    res.json(dishes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});


//dish detail
app.get('/dish/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const dish = await Dish.findOne({ 
      where: { id },
      attributes: { exclude: ['WishId','LineItemId'] }
    });
    if (dish) {
      res.status(200).json(dish);
    } else {
      res.status(404).json({ error: `Dish with id ${id} not found` });
    }
  } catch (err) {
    res.status(500).json({ error: 'Internal server error', err });
  }

});

//add a dish to a wish list
app.post('/create-wish', async (req, res) => {
  const { userId, dishId } = req.body;
  try {
    const user = await User.findByPk(userId);
    const dish = await Dish.findByPk(dishId, { attributes: { exclude: ['WishId', 'LineItemId'] } });
    console.log('User:', user)
    console.log('Dish:', dish)
    if (!user || !dish) {
      return res.status(400).json({ message: 'Invalid user or dish ID' });
    }
    const wish = await Wish.create({
      userId,
      dishId,
      date: new Date()
    });
    
    res.status(201).json({ message: 'Wish created successfully', wish });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});


//retrieving a list of wishes for a single user
app.get('/users/:userId/wishes', async (req, res) => {
  const userId = req.params.userId;
  try {
    const wishes = await Wish.findAll({
      where: { userId: userId },
      raw: false,
      attributes: ['id', 'date'],
      joinTableAttributes: [],
      include: [
        { model: Dish, attributes: {exclude: ['WishId', 'LineItemId']} },
      ]
    });
    res.json(wishes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});


//clears wishlist
app.delete('/wishes/:userId/clear', async (req, res) => {
  const userId = req.params.userId;
  try {
    await Wish.destroy({ where: { userId: userId } });
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});



// deletes a single wish
app.delete('/wishes/:id/delete', async (req, res) => {
  const { id } = req.params;
  try {
    // find the Wish row to delete by id
    const wish = await Wish.findByPk(id, { attributes: { exclude: ['WishId', 'LineItemId'] } });
    // if Wish with given id doesn't exist, return 404 Not Found
    if (!wish) {
      return res.status(404).json({ error: 'Wish not found' });
    }
    // delete the Wish row from the database
    try {
      await wish.destroy();
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Could not delete Wish' });
    }
    // return a success message
    return res.json({ message: 'Wish deleted successfully' });
  } catch (error) {
    // handle any errors that occurred during the deletion process
    console.error(error);
    return res.status(500).json({ error: 'Could not delete Wish', stack: error});
  }
});


//adding items to basket
app.post('/add-to-basket', async (req, res) => {
  try {
    const { userId, dishId, quantity } = req.body;
    // Create the line item with the provided user and dish IDs
    const lineItem = await LineItem.create({ userId:userId, dishId:dishId, quantity:quantity });
    res.json(lineItem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


//basket items by user id
app.get('/user/:userId/basket', async (req, res) => {
  try {
    const userId = req.params.userId;

    const query = `
      SELECT LineItem.id, LineItem.quantity, LineItem.dishId, Dish.id AS dish_id, Dish.name AS dish_name, Dish.description AS dish_description, Dish.price AS dish_price, Dish.ingredients AS dish_ingredients, Dish.img_url AS dish_img_url, Dish.categoryId AS dish_category_id
      FROM LineItems AS LineItem
      LEFT OUTER JOIN Dishes AS Dish ON LineItem.dishId = Dish.id
      WHERE LineItem.userId = ${userId};
    `;

    const [results, metadata] = await sequelize.query(query);

    // Map the result set into the desired format
    const mappedResults = results.map(result => {
      return {
        id: result.id,
        quantity: result.quantity,
        dish: {
          id: result.dish_id,
          name: result.dish_name,
          description: result.dish_description,
          price: result.dish_price,
          ingredients: JSON.parse(result.dish_ingredients),
          img_url: result.dish_img_url,
          category_id: result.dish_category_id
        }
      };
    });

    res.json(mappedResults);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});




//deletes an item from basket
app.delete('/basket/:id/delete', async (req, res) => {
  const lineItemId = req.params.id;
  
  try {
    // Find the line item to be deleted
    const lineItem = await LineItem.findByPk(lineItemId);
    // If line item doesn't exist, return an error
    if (!lineItem) {
      return res.status(404).json({ error: 'Line item not found' });
    }
    
    // Delete the line item from the database
    await lineItem.destroy();
    
    // Return a success message
    res.json({ message: 'Line item deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});


//clearing basket for a specific user
app.delete('/basket/:userId/clear', async (req, res) => {
  try {
    const deletedRows = await LineItem.destroy({
      where: {
        userId: req.params.userId
      }
    });
    res.status(200).json({ message: `${deletedRows} line items deleted for user ${req.params.userId}` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});


//search dishes
app.get('/search', async (req, res) => {
  const { q } = req.query;
  try {
    const results = await Dish.findAll({
      where: {
        name: {
          [Op.like]: `%${q}%`
        }
      },
      attributes: { exclude: ['WishId','LineItemId'] }
    });
    res.json(results);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
});


//creates an order
app.post('/create-order', async (req, res) => {
  try {
    const { additional_customer_info, userId, lineItemId } = req.body;
    
    const order = await Order.create({ additional_customer_info, userId, lineItemId });

    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

//fetches all orders
app.get('/orders/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const orders = await Order.findAll({
      where: {
        userId
      }
    });
    
    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});


//cancels an order by id
app.delete('/orders/:id/delete', async (req, res) => {
  try {
    const orderId = req.params.id;
    console.log('order:', orderId)
    const order = await Order.findByPk(orderId);
    if (!order) {
      res.status(404).json({ message: `Order with ID ${orderId} not found` });
    } else {
      await order.destroy();
      res.json({ message: `Order with ID ${orderId} deleted successfully` });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});




app.listen(3000, () => {
  console.log('Server listening on port http://localhost:3000');
});

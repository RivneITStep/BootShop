const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const path = require("path");

const PORT = 8000;
const app = express();

// include variables
const { USERNAME, PASSWORD } = require('./helper/database');

const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);

// mongoDB connection string
const MONGO_URL = `mongodb+srv://${USERNAME}:${PASSWORD}@cluster0.imqbw.mongodb.net/bootshop?retryWrites=true&w=majority`;

// create mongodb store
const store = new MongoDBStore({
  uri: MONGO_URL,
  collection: 'session'
});

const User = require("./models/users");
const Product = require("./models/product");
const Order = require('./models/order');

// seed
const seedProducts = require('./seedProducts');

// middleware
const mainRoutes = require("./routes/mainRoutes");
const adminRoutes = require('./routes/adminRoutes');
const authRoutes = require('./routes/authRoutes');

//Error Page
const errorController = require('./controller/errorController');


app.set("view engine", "ejs");
app.set("views", "views");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "static")));
app.use(['/admin/products_edit/', '/product_details/:id', '/admin/'], express.static(path.join(__dirname, 'static')));
app.use(session({ secret: 'secret', resave: false, saveUninitialized: false, cookie: { maxAge: 60000 }, store: store }));

app.use((req, res, next) => {
  User.findById("5f7ece409df3cd489c550709")
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => console.log(err));
});

app.use(mainRoutes);
app.use(adminRoutes);
app.use(authRoutes);
app.use(errorController.get404);

mongoose
  .connect(
    MONGO_URL,
    { useNewUrlParser: true, useUnifiedTopology: true }
  ).then(connectionRezult => {
    Product.find().then(product => {
      if (!product.length) {
        seedProducts.createProducts();
      }
      return product;
    });
  })
  .then((result) => {
    User.findOne().then((user) => {
      if (!user) {
        const user = new User({
          name: "master",
          email: "master@gmail.com",
          cart: {
            items: [],
          },
        });
        user.save();
      }
    });
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.log(err);
  });

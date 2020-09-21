const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

const PORT = 8000;
const app = express();

// include sequalize
const sequalize = require("./helper/database");

const User = require("./models/users");
const Product = require("./models/product");
const seedProducts = require('./seedProducts');

// middleware
const mainRoutes = require("./routes/mainRoutes");
const adminRoutes = require('./routes/adminRoutes');
//Error Page
const errorController = require('./controller/errorController');


app.set("view engine", "ejs");
app.set("views", "views");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "static")));
app.use(['/admin/products_edit/', '/product_details/:id', '/admin/'], express.static(path.join(__dirname, 'static')));

app.use(mainRoutes);
app.use(adminRoutes);
app.use(errorController.get404);

sequalize
  .sync()
  .then(connectionRezult => {
    Product.findByPk(1).then(product => {
      if (!product) {
        seedProducts.createProducts();
      }
      return product;
    }).catch(err => console.log(err));
    User.findByPk(1).then(user => {
      if (!user) {
        return User.create({
          name: 'user1',
          email: 'user@example.com',
          password: '123'
        });
      }
      return user;
    }).catch(err => console.log(err));
  })
  .then((result) => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    console.log('database OK!!!');
  })
  .catch((err) => console.log(err));
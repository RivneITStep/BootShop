const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

const PORT = 8000;
const app = express();

// include sequalize
const sequalize = require("./helper/database");

const User = require("./models/users");
const Product = require("./models/product");
const Cart = require("./models/cart");
const CartItem = require("./models/cartItem");

// seed
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

app.use((req, res, next) => {
  User.findByPk(1)
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => console.log(err));
});

app.use(mainRoutes);
app.use(adminRoutes);
app.use(errorController.get404);

// Relations
Product.belongsTo(User, { constraints: true, onDelete: "CASCADE" });
User.hasMany(Product);
User.hasOne(Cart);
Cart.belongsTo(User);
Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });

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
    }).then((user) => {
      return user.createCart();
    });
  })
  .then((result) => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    console.log('database OK!!!');
  })
  .catch((err) => console.log(err));
const Order = require("../models/order");
const Product = require("../models/product");

exports.index = (req, res, next) => {
    console.log('islog => ', req.session.isLoggenIn);
    Product.find()
        .then((products) => {
            res.render("pages/index", {
                products: products,
                pageTitle: "All products",
                path: 'pages/index',
                currentCart: 0,
                total: 0,
                isAuthenticated: req.session.isLoggenIn
            });
        })
        .catch(err => console.log(err));
};
exports.faq = (req, res, next) => {
    res.render("pages/faq");
};
exports.contact = (req, res, next) => {
    res.render("pages/contact", {
        currentCart: 0,
        total: 0,
        isAuthenticated: req.session.isLoggenIn
    });
};
exports.delivery = (req, res, next) => {
    res.render("pages/delivery");
};
exports.forgetpass = (req, res, next) => {
    res.render("pages/forgetpass");
};
exports.legal_notice = (req, res, next) => {
    res.render("pages/legal_notice");
};
exports.product_details = (req, res, next) => {
    const id = req.params.id;
    Product.findById(id).then(product => {
        res.render("pages/product_details", {
            product: product,
            pageTitle: "Product details",
            currentCart: 0,
            total: 0,
            isAuthenticated: req.session.isLoggenIn
        });
    }).catch(err => console.log(err));
};
exports.products = (req, res, next) => {
    Product.findAll()
        .then((products) => {
            res.render("pages/products", {
                products: products,
                pageTitle: "All products",
                path: 'pages/products',
                currentCart: 0,
                total: 0,
                isAuthenticated: req.session.isLoggenIn
            });
        })
        .catch(err => console.log(err));
};
exports.register = (req, res, next) => {
    res.render("pages/register");
};
exports.special_offer = (req, res, next) => {
    res.render("pages/special_offer");
};
exports.tac = (req, res, next) => {
    res.render("pages/tac");
};

exports.getCart = (req, res, next) => {
    req.user
        .populate("cart.items.productId")
        .execPopulate()
        .then((user) => {
            const products = user.cart.items;
            res.render("pages/product_summary", {
                path: "/cart",
                products: products,
                currentCart: 0,
                total: 0,
                isAuthenticated: req.session.isLoggenIn
            });


        })
        .catch((err) => console.log(err));
};

exports.postCart = (req, res, next) => {
    const productId = req.body.productId;
    let newQuantity = 1;
    let currentCart;
    req.user
        .getCart()
        .then((cart) => {
            currentCart = cart;
            return cart.getProducts({ where: { id: productId } });
        })
        .then(([product]) => {
            if (product) {
                const oldQuantity = product.cartItem.quantity;
                newQuantity = oldQuantity + 1;
                return product;
            }
            return Product.findByPk(productId);
        })
        .then((product) => {
            return currentCart.addProduct(product, {
                through: { quantity: newQuantity },
            });
        })
        .then((result) => {
            res.redirect('/product_summary');
        })
        .catch((err) => console.log(err));
};

exports.getOrders = (req, res, next) => {
    Order.find({ "user.userId": req.user._id })
        .then((orders) => {
            console.log('orders => ', orders);
            res.render("pages/orders", {
                path: "/orders",
                pageTitle: "Your Orders",
                orders: orders,
                currentCart: 0,
                total: 0,
                isAuthenticated: req.session.isLoggenIn
            });
        })
        .catch((err) => console.log(err));

};

exports.postOrders = (req, res, next) => {
    let currentCart;
    req.user.getCart().then(cart => {
        currentCart = cart;
        return cart.getProducts();
    }).then(products => {
        return req.user.createOrder()
            .then(order => {
                return order.addProduct(
                    products.map(product => {
                        product.orderItem = { quantity: product.cartItem.quantity };
                        return product;
                    })
                );
            });
    })
        .then(result => {
            return currentCart.setProducts(null);
        })
        .then(result => {
            res.redirect('/orders');
        })
        .catch(err => console.log(err));
};
exports.removeCartProduct = (req, res, next) => {
    const productId = req.body.productId;
    let currentCart;
    req.user
        .getCart()
        .then((cart) => {
            currentCart = cart;
            return cart.getProducts({ where: { id: productId } });
        }).then(product => {
            currentCart.removeProduct(product);
        }).then(result => {
            res.redirect('/product_summary');
        })
        .catch(err => console.log(err));
};

exports.plusCartProduct = (req, res, next) => {
    const productId = req.body.productId;
    req.user
        .getCart()
        .then((cart) => {
            return cart.getProducts({ where: { id: productId } });
        }).then(product => {
            return product[0].cartItem.update({ quantity: product[0].cartItem.quantity + 1 });
        }).then(result => {
            res.redirect('/product_summary');
        })
        .catch(err => console.log(err));
};
exports.minusCartProduct = (req, res, next) => {
    const productId = req.body.productId;
    req.user
        .getCart()
        .then((cart) => {
            return cart.getProducts({ where: { id: productId } });
        }).then(product => {
            if (product[0].cartItem.quantity > 0) {
                return product[0].cartItem.update({ quantity: product[0].cartItem.quantity - 1 });
            }
            return product;
        }).then(result => {
            res.redirect('/product_summary');
        })
        .catch(err => console.log(err));
};
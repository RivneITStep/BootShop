const Order = require("../models/order");
const Product = require("../models/product");
const nodemailer = require('nodemailer');


exports.index = (req, res, next) => {
    console.log('islog => ', req.session.isLoggedIn);
    Product.find()
        .then((products) => {
            res.render("pages/index", {
                products: products,
                pageTitle: "All products",
                path: 'pages/index',
                currentCart: req.currentCart,
                total: req.total,
                isAuthenticated: req.session.isLoggedIn,
                user: req.user
            });
        })
        .catch(err => console.log(err));
};
exports.faq = (req, res, next) => {
    res.render("pages/faq");
};
exports.contact = (req, res, next) => {
    res.render("pages/contact", {
        currentCart: req.currentCart,
        total: req.total,
        isAuthenticated: req.session.isLoggedIn,
        user: req.user
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
            currentCart: req.currentCart,
            total: req.total,
            isAuthenticated: req.session.isLoggedIn,
            user: req.user
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
                currentCart: req.currentCart,
                total: req.total,
                isAuthenticated: req.session.isLoggedIn,
                user: req.user
            });
        })
        .catch(err => console.log(err));
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
                path: "/product_summary",
                pageTitle: "Your Cart",
                products,
                isAuthenticated: req.session.isLoggedIn,
                currentCart: req.currentCart,
                total: req.total,
                user: req.user
            });
        })
        .catch((err) => console.log(err));
};

exports.postCart = (req, res, next) => {
    const prodId = req.body.productId;
    Product.findById(prodId)
        .then((product) => {
            return req.user.addToCart(product);
        })
        .then((result) => {
            console.log(result);
            res.redirect("/product_summary");
        });
};

exports.getOrders = (req, res, next) => {
    Order.find({ "user.userId": req.user._id })
        .then((orders) => {
            res.render("pages/orders", {
                path: "/orders",
                pageTitle: "Your Orders",
                orders: orders,
                currentCart: req.currentCart,
                total: req.total,
                isAuthenticated: req.session.isLoggedIn,
                user: req.user
            });
        })
        .catch((err) => console.log(err));
};

exports.postOrders = (req, res, next) => {
    req.user
        .populate("cart.items.productId")
        .execPopulate()
        .then((user) => {
            const products = user.cart.items.map((i) => {
                return { quantity: i.quantity, product: { ...i.productId._doc } };
            });
            const order = new Order({
                user: {
                    name: req.user.name,
                    userId: req.user,
                },
                products: products
            });
            return order.save();
        })
        .then((result) => {
            return req.user.clearCart();
        }).then(result => {
            let transporter = nodemailer.createTransport({
                service: 'Gmail',
                auth: {
                    user: 'bootshop2020@gmail.com',
                    pass: '*frontend94*'
                }
            });
            Order.find({ "user.userId": req.user._id }).then(orders => {
                console.log('orders => ', orders[0]);
                transporter.sendMail({
                    from: `"Bootshop" <${req.session.user.email}>`,
                    to: "sergeyparchuk1@gmail.com",
                    subject: `New order from ${req.session.user.name} <${req.session.user.email}>`,
                    text: `orders from `,
                    html: `Orders from <strong>${req.session.user.name}</strong>  `
                }).catch(err => console.log(err));
            }).catch(err => console.log(err));
        })
        .then((resul) => {
            res.redirect("/orders");
        })
        .catch((err) => console.log(err));
};
exports.removeCartProduct = (req, res, next) => {
    const productId = req.body.productId;
    req.user.removeFromCart(productId)
        .then((result) => {
            res.redirect('/product_summary');
        }).catch(err => console.log(err));
};

exports.plusCartProduct = (req, res, next) => {
    const productId = req.body.productId;
    req.user.plusItemCart(productId)
        .then((result) => {
            res.redirect('/product_summary');
        }).catch(err => console.log(err));
};
exports.minusCartProduct = (req, res, next) => {
    const productId = req.body.productId;
    req.user.minusItemCart(productId)
        .then((result) => {
            res.redirect('/product_summary');
        }).catch(err => console.log(err));
};
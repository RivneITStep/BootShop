const Product = require("../models/product");

exports.index = (req, res, next) => {
    Product.findAll()
        .then((products) => {
            res.render("pages/index", {
                products: products,
                pageTitle: "All products",
                path: 'pages/index'
            });
        })
        .catch(err => console.log(err));
};
exports.faq = (req, res, next) => {
    res.render("pages/faq");
};
exports.contact = (req, res, next) => {
    res.render("pages/contact");
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
exports.login = (req, res, next) => {
    res.render("pages/login");
};
exports.product_details = (req, res, next) => {
    const id = req.params.id;
    Product.findByPk(id).then(product => {
        res.render("pages/product_details", {
            product: product,
            pageTitle: "Product details",
        });
    }).catch(err => console.log(err));
};
exports.products = (req, res, next) => {
    Product.findAll()
        .then((products) => {
            res.render("pages/products", {
                products: products,
                pageTitle: "All products",
                path: 'pages/products'
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
        .getCart()
        .then((cart) => {
            return cart.getProducts().then((products) => {
                res.render("pages/product_summary", {
                    path: "/product_summary",
                    products: products,
                });
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
        .then(() => {
            req.user
                .getCart()
                .then((cart) => {
                    res.redirect('/product_summary');
                })
                .catch((err) => console.log(err));
        })
        .catch((err) => console.log(err));
};
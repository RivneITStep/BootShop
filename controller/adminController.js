const Product = require('../models/product');
//const { products } = require('./mainController');

exports.adminIdex = (req, res, next) => {
    Product.findAll()
        .then((products) => {
            res.render("pages/admin/index", {
                products: products,
                pageTitle: 'All products',
                path: '/'
            });
        })
        .catch(err => console.log(err));
};

exports.adminPage = (req,res,next) =>{
    res.render('pages/admin/admin_page');
}

exports.adminAddProduct = (req, res, next) => {
    console.log('adminAddProduct');
    res.render("pages/admin/add_product");
};

exports.adminAddProductPost = (req, res, next) => {

    const title = req.body.title;
    const price = req.body.price;
    const sale = req.body.sale;
    const imageUrl = req.body.imageURL;
    const quantity = req.body.quantity;
    const color = req.body.color;
    const shortDescription = req.body.shortDescription;
    const fullDescription = req.body.fullDescription;
    const brand = req.body.brand;
    const model = req.body.model;
    const released = req.body.released;
    const dimensions = req.body.dimensions;
    const displaySize = req.body.displaySize;
    const features = req.body.features;


    Product.create({
        title: title,
        price: price,
        sale: sale,
        imageUrl: imageUrl,
        quantity: quantity,
        color: color,
        shortDescription: shortDescription,
        fullDescription: fullDescription,
        brand: brand,
        model: model,
        released: released,
        dimensions: dimensions,
        displaySize: displaySize,
        features: features,
    }).then(result => {
        //console.log('add product result =>',result);
        console.log('product was added');
        res.redirect('/admin/');
    })
        .catch(err => console.log(err));
};

exports.adminProductDelete = (req, res, next) => {
    console.log('Delete Course');
    const id = req.params.id;
    Product.destroy(
        {
            where: {
                id: id
            },
            force: true
        }
    ).then((product) => {
        res.redirect('/admin/');
    })
        .catch((err) => console.log(err));
};

exports.adminProductEdit = (req, res, next) => {
    console.log('adminEditProduct');
    const id = req.params.id;
    Product.findByPk(id)
        .then((product) => {
            res.render('pages/admin/edit_product', {
                product: product,
                id: id,
                //path:'/products_edit/',
            });
        })
        .catch((err) => console.log(err));
};

exports.adminEditConfirm = (req, res, next) => {
    console.log('EditConfirm');
    const id = req.params.id;
    const title = req.body.title;
    const price = req.body.price;
    const sale = req.body.sale;
    const imageUrl = req.body.imageURL;
    const quantity = req.body.quantity;
    const color = req.body.color;
    const shortDescription = req.body.shortDescription;
    const fullDescription = req.body.fullDescription;
    const brand = req.body.brand;
    const model = req.body.model;
    const released = req.body.released;
    const dimensions = req.body.dimensions;
    const displaySize = req.body.displaySize;
    const features = req.body.features;

    Product.update({
        title: title,
        price: price,
        sale: sale,
        imageUrl: imageUrl,
        quantity: quantity,
        color: color,
        shortDescription: shortDescription,
        fullDescription: fullDescription,
        brand: brand,
        model: model,
        released: released,
        dimensions: dimensions,
        displaySize: displaySize,
        features: features,
    },
        {
            where: {
                id: id
            }
        }
    ).then(result => {
        //console.log('add product result =>',result);
        console.log('product updated');
        res.redirect('/admin/');
    })
        .catch(err => console.log(err));
};

exports.adminProductDetails = (req, res, next) => {
    console.log('adminProductDetails');
    //res.render("pages/contact")
};

exports.adminProductList = (req, res, next) => {
    console.log('adminProductList');
    //res.render("pages/contact")
};
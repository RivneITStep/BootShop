const Product = require('./models/product');
exports.createProducts = () => {
    return Product.create({
        title: 'AMD Ryzen 5 3600 3.6GHz sAM4 BOX',
        price: 6125,
        sale: 111,
        imageUrl: 'https://i1.rozetka.ua/goods/12765145/amd_ryzen_5_3600_images_12765145099.jpg',
        quantity: 55,
        shortDescription: 'Процесор AMD Ryzen 5 3600 3.6GHz / 32MB (100-100000031BOX) sAM4 BOX',
        fullDescription: 'Процесор AMD Ryzen 5 3600 3.6GHz / 32MB (100-100000031BOX) sAM4 BOX',
        brand: 'AMD',
        model: 'AMD Ryzen 5 3600',
        features: 'Купують разом Характеристики Процесор AMD Ryzen 5 3600 3.6GHz / 32 в',
    });
};

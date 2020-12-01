const reviewModel = require('../models/review.model')
const productModel = require("../models/product.model");

module.exports.data = async (req, res) => {
    let featuredProducts = await productModel.find({soldNo: {$gt: 5}});
    let latestProducts = await productModel.find().sort({ 'createdAt': -1 });
    let reviews = await reviewModel.find().populate('customerId');
    let featureds = featuredProducts.slice(0, 4)
    let latests = latestProducts.slice(0, 7)
    res.render('index', {reviews: reviews, featureds:featureds, latests:latests})
}
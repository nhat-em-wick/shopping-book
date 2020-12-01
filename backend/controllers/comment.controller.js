const pagination = require("./pagination");
const commentModel = require('../models/comment.model');
const productModel = require("../models/product.model");
const reviewModel = require("../models/review.model");

module.exports.pageComment = async (req, res)=>{
    try{
        let product = await productModel.findById(req.params.id);
        if(!product) return res.status(404).send('Không tìm thấy sản phẩm');
        res.render('comments/product',{product:product});
    }catch(e){
        res.status(500).send('lỗi server')
    }
}

module.exports.saveComment = async (req, res) => {
    const {content} = req.body;
    try{
        const comment = new commentModel({
            content: content,
            customerId: req.user._id,
            productId: req.params.id
        })
        const saveComment = comment.save();
        res.redirect(`/products/view/${req.params.id}`)
    }catch(e){
        res.status(500).send('lỗi server')
    }
    
}


module.exports.pageReview = (req, res)=>{
    res.render('comments/review_shop');
}
module.exports.saveReview = async (req, res) => {
    const {content} = req.body;
    try{
        const review = new reviewModel({
            content: content,
            customerId: req.user._id
        })
        const saveReview = review.save();
        res.redirect('/')
    }catch(e){
        res.status(500).send('lỗi server')
    }
}
module.exports.showReview = async (req, res) => {
    try{
        let reviews = await reviewModel.find().populate('customerId');
        return reviews;
    }catch(e){
        res.status(500).send('lỗi server')
    }

}
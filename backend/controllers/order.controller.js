const orderModel = require("../models/order.model");
const productModel = require("../models/product.model");
const jwt = require("jsonwebtoken");
var mongoose = require("mongoose");
const moment = require('moment')
const pagination = require("./pagination");

module.exports.checkOut = (req, res) => {
  res.render("orders/checkout");
};

module.exports.order = async (req, res) => {
  const { phone, address } = req.body;
  try {
    const order = new orderModel({
      customerId: req.user._id,
      items: req.session.cart.items,
      phone: phone,
      address: address,
      totalQty: req.session.cart.totalQty,
      totalPrice: req.session.cart.totalPrice,
    });
    const newOrder = await order.save();
    // update sl trong kho
    for (let productCart of Object.values(req.session.cart.items)) {
      let product = await productModel.findById(productCart.item._id);
      product.totalQty -= productCart.qty;
      product.soldNo += productCart.qty;
      const updateProduct = await product.save();
    }
    delete req.session.cart;
    req.flash('success', "Đặt hàng thành công");
    res.redirect("/orders");
  } catch (e) {
   res.status(500).send('lỗi server');
  }
};

module.exports.showOrderUser = async (req, res) => {
  try {
    const id = mongoose.Types.ObjectId(req.user._id);
    let orders = await orderModel.find({ customerId: id }).sort({ 'createdAt': -1 });
    return res.render("orders/index", { orders: orders, moment: moment });
  } catch (err) {
    res.status(500).send('lỗi server');
  }
};

module.exports.itemOrder = async (req, res) => {
  try {
    let order = await orderModel.findById(req.params.id);
    return res.render("orders/view", { order: order });
  } catch (err) {
    res.status(500).send('lỗi server');
  }
};

module.exports.cancelOrder = async (req, res) => {
  try {
    let order = await orderModel.findById(req.params.id);
    for (let productCart of Object.values(order.items)) {
      const product = await productModel.findById(productCart.item._id);
      product.totalQty += productCart.qty;
      product.soldNo -= productCart.qty;
      const updateProduc = await product.save();
    }
    await orderModel.findByIdAndDelete(req.params.id);
    req.flash('success','Hủy đơn hàng thành công')
    res.redirect("/orders");
  } catch (e) {
    res.status(500).send('lỗi server');
  }
};

module.exports.statusOrder = async (req, res) => {
  try {
    let order = await orderModel.findById(req.params.id);
    res.render("orders/status", { order: order});
  } catch (e) {
    res.status(500).send('lỗi server');
  }
};


module.exports.adminOrder = async (req, res) => {
  try {
    let page = parseInt(req.query.page) || 1;
    let perPage = 8; // item in page
    let orders = await orderModel.find().populate("customerId", "-password").sort({ 'createdAt': -1 });
    res.render("admin/orders/admin_order", pagination(page, perPage, orders,0, moment));
  } catch (e) {
    res.status(500).send('lỗi server');
  }
};

module.exports.adminSearchOrder = async (req, res) => {
  let q = req.query.q;
  try{
    let orders = await orderModel.find().populate('customerId');
    let matchedOrders = orders.filter((order) => {
      return order.phone.indexOf(q) !== -1; // neu q nam trong title thi gia tri lon hon -1
    });
    let page = parseInt(req.query.page) || 1;
    
    if (matchedOrders.length < 1) {
      req.flash("error", `Không tìm thấy đơn hàng với SĐT: "${q}"`);
      req.flash("q", q);
      res.render("admin/orders/search_orders");
    } else {
      req.flash("q", q);
      res.render("admin/orders/search_orders", pagination(page, 8, matchedOrders,0,moment));
    }
  }catch (e) {
    res.status(500).send('lỗi server');
  }
  
};

module.exports.updateStatus = async (req, res) => {
  try {
    await orderModel.updateOne(
      { _id: req.body.orderId },
      { status: req.body.status }
    );
    res.redirect("back");
  } catch (e) {
    res.status(500).send('lỗi server');
  }
};

module.exports.deleteOrder = async (req, res) => {
  try {
    await orderModel.findByIdAndDelete(req.params.id);
    res.redirect("back");
  } catch (e) {
    res.status(500).send('lỗi server');
  }
};

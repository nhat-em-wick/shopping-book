module.exports.addToCart = (req, res) => {
  if (!req.session.cart) {
    req.session.cart = {
      items: {},
      totalQty: 0,
      totalPrice: 0,
    };
  }
  try{
    let cart = req.session.cart;
    if (!cart.items[req.body._id]) {
      cart.items[req.body._id] = {
        item: req.body,
        qty: 1,
      };
      cart.totalQty += 1;
      cart.totalPrice += req.body.price;
    } else {
      cart.items[req.body._id].qty = cart.items[req.body._id].qty + 1;
      cart.totalQty += 1;
      cart.totalPrice += req.body.price;
    }
    res.json({
      totalQty: req.session.cart.totalQty,
      totalPrice: req.session.cart.totalPrice
    });
  }catch(e){
    res.status(500).send(e)
  }
  
};

module.exports.getItemCart = (req, res) => {
  res.render("cart/index");
};

module.exports.increaseItem = (req, res) => {
  try {
    let cart = req.session.cart;
    cart.items[req.body._id].qty += 1;
    cart.totalQty += 1;
    cart.totalPrice += parseInt(req.body.price);
    res.redirect("/cart");
  } catch {
    res.redirect("/cart");
  }
};

module.exports.decreaseItem = (req, res) => {
  try {
    let cart = req.session.cart;
    cart.items[req.body._id].qty -= 1;
    if (cart.items[req.body._id].qty == 0) {
      delete cart.items[req.body._id];
    }
    cart.totalQty -= 1;
    cart.totalPrice -= parseInt(req.body.price);
    res.redirect("/cart");
  } catch {
    res.redirect("/cart");
  }
};

module.exports.removeItem = (req, res) => {
  const cart = req.session.cart;
  const qtyItemRemove = cart.items[req.params.id].qty;
  const priceItemRemove = cart.items[req.params.id].item.price * qtyItemRemove;
  cart.totalQty -= qtyItemRemove;
  cart.totalPrice -= priceItemRemove;
  delete cart.items[req.params.id];
  res.redirect("/cart");
};

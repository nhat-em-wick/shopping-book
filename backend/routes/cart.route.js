const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cart.controller");
const verifyToken = require("../middleware/verifyToken");

router.post("/addtocart", cartController.addToCart);

router.get("/cart", cartController.getItemCart);

router.post("/decrease", cartController.decreaseItem);
router.post("/increase", cartController.increaseItem);

router.get("/cart/remove/:id", cartController.removeItem);

module.exports = router;

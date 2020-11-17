const express = require("express");
const productController = require("../controllers/product.controller");
const verifyToken = require("../middleware/verifyToken");
const checkAdmin = require("../middleware/checkAdmin");
const router = express.Router();
const checkInput = require("../middleware/checkinput");
const upload = require("../middleware/uploadProduct");
const cloudinary = require("../middleware/clouldinary");
const fs = require('fs');

router.get("/products", productController.listProduct);

router.get(
  "/products/search",
  checkInput.search,
  productController.searchProduct
);

router.get("/featuredproducts", productController.featuredProducts);

router.get('/latestproducts', productController.latestProducts)

router.get('/products/view/:id', productController.singleProduct)

router.get('/category/:id',checkInput.search, productController.categoryProduct)

router.get('/category/search/:id', checkInput.search, productController.categoryProductSearch)

//admin
router.get(
  "/admin/products",
  verifyToken,
  checkAdmin,
  productController.adminProduct
);
router.get(
  "/admin/products/search",
  verifyToken,
  checkAdmin,
  checkInput.search,
  productController.adminSearchProduct
);
router.get(
  "/admin/products/add",
  verifyToken,
  checkAdmin,
  productController.pageAddProduct
);
router.post(
  "/admin/products/add",
  verifyToken,
  checkAdmin,
  upload.single("mybook"),
  checkInput.checkAddProduct,
  productController.addProduct
);
router.get(
  "/admin/viewproduct/:id",
  verifyToken,
  checkAdmin,
  productController.showProduct
);
router.get(
  "/admin/products/edit/:id",
  verifyToken,
  checkAdmin,
  productController.pageEditProduct
);
router.put(
  "/admin/products/edit/:id",
  verifyToken,
  checkAdmin,
  upload.single("mybook"),
   checkInput.checkAddProduct,
  productController.editProduct
);

router.delete(
  "/admin/products/:id",
  verifyToken,
  checkAdmin,
  productController.deleteProduct
);


router.post('/admin/products/status', verifyToken, checkAdmin, productController.updateStatus)
router.get('/admin/addcategory', verifyToken, checkAdmin, productController.pageAddCategory)
router.post('/admin/addcategory', verifyToken, checkAdmin, productController.addCategory)

module.exports = router;

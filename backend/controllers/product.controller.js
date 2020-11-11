const productModel = require("../models/product.model");
const fs = require("fs");
const path = require("path");
const moment = require('moment')

const pagination = require("./pagination");
const cloudinary = require("../middleware/clouldinary");
const removeAscent = require("../middleware/removeAscent");
const categoryModel = require("../models/category.model");
const commentModel = require("../models/comment.model")
module.exports.searchProduct = async (req, res) => {
  let q = req.query.q;
  try {
    let totalProducts = await productModel.find();
    let matchedProducts = totalProducts.filter((product) => {
      return (
        removeAscent(product.title)
          .toLowerCase()
          .indexOf(removeAscent(q).toLowerCase()) !== -1
      ); // neu q nam trong title thi gia tri lon hon -1
    });
    let page = parseInt(req.query.page) || 1;
    if (matchedProducts.length < 1) {
      req.flash("error", `Không tìm thấy sản phẩm: "${q}"`);
      req.flash("q", q);
      res.render("products/search");
    } else {
      req.flash("q", q);
      res.render("products/search", pagination(page, 8, matchedProducts));
    }
  } catch (e) {
    res.status(500).send('lỗi server');
  }
};

// get list product
module.exports.listProduct = async (req, res) => {
  try {
    // panigation
    const page = parseInt(req.query.page) || 1;
   
    const categories = await categoryModel.find();
    const totalProducts = await productModel.find();
    res.render(
      "products/index",
      pagination(page, 12, totalProducts, categories)
    );
  } catch (e) {
    res.status(500).send('lỗi server');
  }
};
module.exports.pageAddCategory = (req, res) => {
  res.render("admin/add_category");
};

module.exports.addCategory = async (req, res) => {
  try {
    const { name, link } = req.body;
    const newCategory = new categoryModel({
      name: name,
      link: link,
    });
    const saveCategory = newCategory.save();
    req.flash("success", "Thêm thành công");
    res.redirect("back");
  } catch (e) {
    res.status(500).send('lỗi server');
  }
};

module.exports.categoryProduct = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  
  const q = req.params.id.replace(/-/g, " ");
  try {
    const categories = await categoryModel.find();
    const categoryProduct = await productModel.find().populate("category");
    // lọc sản phẩm theo danh mục
    const matchedProducts = categoryProduct.filter((product) => {
      return (
        removeAscent(product.category.name)
          .toLowerCase()
          .indexOf(q.toLowerCase()) !== -1
      );
    });
    if (matchedProducts.length < 1) {
      req.flash("error", "Không tìm thấy sản phẩm");
      req.flash("category", q.replace(/ /g, "-"));
      res.render("products/category",pagination(page, 8, matchedProducts, categories));
    } else {
      req.flash("category", q.replace(/ /g, "-"));
      res.render(
        "products/category",
        pagination(page, 8, matchedProducts, categories)
      );
    }
  } catch (e) {
    res.status(500).send('lỗi server');
  }
};

module.exports.categoryProductSearch = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  
  const category = req.params.id.replace(/-/g, " ");
  const q = req.query.q;
  try {
    const categories = await categoryModel.find();
    const categoryProduct = await productModel.find().populate("category");
    // lọc sản phẩm theo danh mục
    const matchedProductsCategory = categoryProduct.filter((product) => {
      return (
        removeAscent(product.category.name)
          .toLowerCase()
          .indexOf(category.toLowerCase()) !== -1
      );
    });
    // tìm sản phẩm theo danh mục
    const matchedProductsSearch = matchedProductsCategory.filter((product) => {
      return (
        removeAscent(product.title)
          .toLowerCase()
          .indexOf(removeAscent(q).toLowerCase()) !== -1
      );
    });
    if (matchedProductsSearch.length < 1) {
      req.flash("category", category.replace(/ /g, "-"));
      req.flash("q", q);
      req.flash("error", `Không tìm thấy sản phẩm: ${q}`);
      res.render(
        "products/category",
        pagination(page, 8, matchedProductsSearch, categories)
      );
    } else {
      req.flash("category", category.replace(/ /g, "-"));
      req.flash("q", q);
      res.render(
        "products/category",
        pagination(page, 8, matchedProductsSearch, categories)
      );
    }
  } catch (e) {
    res.status(500).send('lỗi server');
  }
};

// axios lấy sản phẩm
module.exports.listJson = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  try {
    let totalProducts = await productModel.find();
    res.json(pagination(page, 4, totalProducts));
  } catch (e) {
    res.status(500).send('lỗi server');
  }
};

module.exports.singleProduct = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  try {
    const product = await productModel.findById(req.params.id);
    const totalComments = await commentModel.find().populate('customerId');
    const commentsProduct = totalComments.filter((comment)=>{
      return comment.productId.toString().indexOf(req.params.id) !== -1;
    });
    if(commentsProduct.length < 1){
      req.flash("error",'Sản phẩm chưa có nhận xét')
     return res.render("products/singleproduct", pagination(page, 0, commentsProduct, product));
    }
    return res.render("products/singleproduct", pagination(page, 8, commentsProduct, product, moment));
  } catch (e) {
    res.status(500).send('lỗi server');
  }
};

module.exports.adminSearch = async (req, res) => {
  let q = req.query.q;
  try {
    let totalProducts = await productModel.find();
    let matchedProducts = totalProducts.filter((product) => {
      return removeAscent(product.title).toLowerCase().indexOf(removeAscent(q).toLowerCase()) !== -1; // neu q nam trong title thi gia tri lon hon -1
    });
    let page = parseInt(req.query.page) || 1;
    if (matchedProducts.length < 1) {
      req.flash("error", `Không tìm thấy sản phẩm: ${q}`);
      req.flash("q", q);
      res.render("admin/search_products");
    } else {
      req.flash("q", q);
      res.render(
        "admin/admin_product",
        pagination(page, 6, matchedProducts)
      );
    }
  } catch (e) {
    res.status(500).send('lỗi server');
  }
};

module.exports.adminProduct = async (req, res) => {
  try {
    // panigation
    let page = parseInt(req.query.page) || 1;
    let totalProducts = await productModel.find();
    res.render("admin/products/admin_product", pagination(page, 8, totalProducts));
  } catch (e) {
    res.status(500).send('lỗi server');
  }
};

module.exports.pageAddProduct = async (req, res) => {
  try {
    const categories = await categoryModel.find();
    res.render("admin/products/add_product", { categories: categories });
  } catch (e) {}
};

// add product
module.exports.addProduct = async (req, res) => {
  const { title, totalQty, price, description, category } = req.body;
  try {
    const uploader = async (path) => await cloudinary.uploads(path, "images");
    const file = req.file;
    const { path } = file;
    const newpath = await uploader(path);
    fs.unlinkSync(path);

    const product = new productModel({
      title: title,
      totalQty: totalQty,
      price: price,
      description: description,
      category: category,
      image: newpath.url,
    });
    const saveProduct = await product.save();
    res.redirect(`/admin/viewproduct/${saveProduct._id}`);
  } catch (e) {
    res.status(500).send('lỗi server');
  }
};

module.exports.showProduct = async (req, res) => {
  try {
    const product = await productModel
      .findById(req.params.id)
      .populate("category");
    res.render("admin/products/view_product", { product: product });
  } catch (e) {
    res.status(500).send('lỗi server');
  }
};

module.exports.pageEditProduct = async (req, res) => {
  try {
    const product = await productModel.findById(req.params.id);
    const categories = await categoryModel.find();
    res.render("admin/products/edit_product", {
      product: product,
      categories: categories,
    });
  } catch (e) {
    res.status(500).send('lỗi server');
  }
};

module.exports.editProduct = async (req, res) => {
  const { title, totalQty, price, description, category } = req.body;
  try {
    const uploader = async (path) => await cloudinary.uploads(path, "images");
    const file = req.file;
    const { path } = file;
    const newpath = await uploader(path);
    fs.unlinkSync(path);
    const product = await productModel.findById(req.params.id);
    product.title = title || product.title;
    product.price = price || product.price;
    product.totalQty = totalQty || product.totalQty;
    product.description = description || product.description;
    product.category = category || product.category;
    product.image = newpath.url || product.image;
    const updateProduct = await product.save();
    res.redirect(`/admin/viewproduct/${updateProduct._id}`);
  } catch (e) {
    res.status(500).send('lỗi server');
  }
};

module.exports.updateStatus = async (req, res) => {
  try {
    await productModel.updateOne(
      { _id: req.body.productId },
      { status: req.body.status }
    );
    res.redirect("/admin/products");
  } catch (e) {
    res.status(500).send('lỗi server');
  }
};

module.exports.deleteProduct = async function (req, res) {
  try {
    await productModel.findByIdAndDelete(req.params.id);
    res.redirect("/admin/products");
  } catch (e) {
    res.status(500).send('lỗi server');
  }
};

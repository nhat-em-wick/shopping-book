const regName = /^[A-z\ ]{3,}[^\ \$\{\}\!\@\#\^\&\*\%]$/;
const regEmail = /^[A-z0-9]{5,32}\@[a-z]{2,}\.[a-z]{2,5}(\.[a-z]{2,5})?$/;
const regPass = /^(?=.*[A-z])(?=.*[0-9])([A-z0-9\!\@\#\$\&\*]){8,32}$/;
const regAddress = /^[A-z0-9\ \.\,\-]{8,}[^\ \$\{\}\!\@\#\^\&\*\%]$/;
const regPhone = /^0[1-9]{9}$/;
const regSearch = /^[A-z0-9\ \@\.\-]*[^\!\#\$\^\<\>\{\}\&\,\;\ ]$/;
const regNumber = /^[0-9]*$/;
const regComment = /^[A-z0-9\ \.\,\"\(\)\?]{50,}[^\ \$\{\}\!\@\#\<\>\^\&\*\%]$/;
const regTitle = /^[A-z0-9\ \"\(\)]{2,}[^\ \$\{\}\!\@\#\<\>\^\&\*\%]$/;
const fs = require("fs");
const removeAscent = require("./removeAscent");
module.exports.checkLogin = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    req.flash("email", email);
    req.flash("error", "Không được để trống");
    return res.redirect("back");
  }
  let validEmail = regEmail.test(email);
  let validPass = regPass.test(password);
  if (validEmail && validPass) return next();
    req.flash("email", email);
    req.flash("error", "Email hoặc mật khẩu không hợp lệ");
    return res.redirect("back");
  
};

module.exports.checkRegister = (req, res, next) => {
  const { name, email, password, conf_password } = req.body;
  if (!name || !email || !password || !conf_password) {
    req.flash("error", "Không được để trống");
    req.flash("name", name);
    req.flash("email", email);
    return res.redirect("back");
  }
  if (password !== conf_password) {
    req.flash("error", "mật khẩu không trùng khớp");
    req.flash("name", name);
    req.flash("email", email);
    return res.redirect("back");
  }
  let validName = regName.test(removeAscent(name))
  let validEmail = regEmail.test(email)
  let validPass = regPass.test(password)
  let valiConf_Pass = regPass.test(conf_password)
  if (validName) {
    if (validEmail) {
      if (validPass && valiConf_Pass) return next();
      req.flash(
        "error",
        "Mật khẩu phải chứa 1 ký tự chữ, 1 ký tự số và dài từ 8 đến 32 ký tự"
      );
      req.flash("name", name);
      req.flash("email", email);
      req.flash("password", password);
      req.flash("conf_password", conf_password);
      return res.redirect("/register");
    } else {
      req.flash("error", "Email không hợp lệ");
      req.flash("name", name);
      req.flash("email", email);
      req.flash("password", password);
      req.flash("conf_password", conf_password);
      return res.redirect("back");
    }
  } else {
    req.flash(
      "error",
      "Tên không hợp lệ"
    );
    req.flash("name", name);
    req.flash("email", email);
    req.flash("password", password);
    req.flash("conf_password", conf_password);
    return res.redirect("back");
  }
};

module.exports.search = (req, res, next) => {
  let q = req.query.q;
  if (q == "") return res.redirect("back");
  if (regSearch.test(removeAscent(q))) return next();
  return res.status(403).send("Từ khóa không hợp lệ");
};

module.exports.checkChangeInfo = (req, res, next) => {
  const { name, password, conf_password } = req.body;
  if (password !== conf_password) {
    req.flash("error", "Mật khẩu không trùng khớp");
    req.flash("name", name);
    return res.redirect("back");
  }
  let validName = regName.test(removeAscent(name))
  let validPass = regPass.test(password)
  let validConf_Pass = regPass.test(conf_password)
  if (validName) {
    if (validPass && validConf_Pass) return next();
    req.flash(
      "error",
      "Mật khẩu phải chứa 1 ký tự chữ, 1 ký tự số và dài từ 8 đến 32 ký tự"
    );
    req.flash("name", name);
    return res.redirect("back");
  } else {
    req.flash("error", "Tên không hợp lệ");
    req.flash("name", name);
    return res.redirect("back");
  }
};

module.exports.checkNewPass = (req, res, next) => {
  const { password, conf_password } = req.body;
  const id = req.params.id;
  if (!password || !conf_password) {
    req.flash("error", "Không được để trống");
    return res.redirect('back');
  }
  if (password !== conf_password) {
    req.flash("error", "Mật khẩu không trùng khớp");
    return res.redirect("back");
  }
  let validPass = regPass.test(password)
  let validConf_Pass = regPass.test(conf_password)
  if (validPass && validConf_Pass) return next();
  req.flash(
    "error",
    "Mật khẩu phải chứa 1 ký tự chữ, 1 ký tự số và dài từ 8 đến 32 ký tự"
  );
  return res.redirect('back');
};

module.exports.checkOrder = (req, res, next) => {
  const { address, phone } = req.body;
  if (!address || !phone) {
    req.flash("error", "Không được để trống");
    req.flash("phone", phone);
    req.flash("address", address);
    return res.redirect("/checkout");
  }
  let validPhone = regPhone.test(phone)
  let validAddress = regAddress.test(removeAscent(address))
  if (validPhone && validAddress)
    return next();
  req.flash("phone", phone);
  req.flash("address", address);
  req.flash("error", "SĐT hoặc địa chỉ không hợp lệ");
  return res.redirect("/checkout");
};

module.exports.checkComment = (req, res, next) => {
  const { content } = req.body;
  if (!content) {
    req.flash("error", "Không được để trống");
    return res.redirect("back");
  }
  let valid = removeAscent(content);
  if (regComment.test(removeAscent(content))) return next();
  req.flash("error", "Nội dung chứa ít nhất 50 kí tự");
  req.flash("content", content);
  return res.redirect("back");
};

module.exports.checkAddProduct = (req, res, next) => {
  const { title, totalQty, price, description } = req.body;
  if (!title || !description || !price || !totalQty || !req.file) {
    req.flash("error", "Không được để trống");
    req.flash("title", title);
    req.flash("description", description);
    req.flash("price", price);
    req.flash("totalQty", totalQty);
    return res.redirect("back");
  }
  let validTitle = regTitle.test(removeAscent(title))
  let validDes = regComment.test(removeAscent(description))
  let validPrice = regNumber.test(price)
  let validQty = regNumber.test(totalQty)
  if(validTitle && validDes && validPrice && validQty) return next();
  req.flash("error", "Tên sản phẩm, mô tả, giá hoặc số lượng không hợp lệ");
  req.flash("title", title);
  req.flash("description", description);
  req.flash("price", price);
  req.flash("totalQty", totalQty);
  fs.unlinkSync(req.file.path);
  return res.redirect("back");
}

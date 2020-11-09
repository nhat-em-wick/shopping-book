require("dotenv/config");
const userModel = require("../models/user.model");
const path = require("path");
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
const mailgun = require("mailgun-js");
const pagination = require("./pagination");

const mg = mailgun({
  apiKey: process.env.MAILGUN_APIKEY,
  domain: process.env.DOMAIN,
});
const tokenList = {};

module.exports.pageLogin = (req, res) => {
  res.render("user/login");
};

module.exports.pageRegister = (req, res) => {
  res.render("user/register");
};

module.exports.adminUser = async (req, res) => {
  try {
    let page = parseInt(req.query.page) || 1;
    let perPage = 8;
    const users = await userModel.find({ isAdmin: "false" });
    res.render("admin/admin_user", pagination(page, perPage, users));
  } catch (e) {
    res.status(500).send('lỗi server');
  }
};

module.exports.myInfo = async (req, res) => {
  try {
    const user = await userModel.findById(req.user._id);
    return res.render("user/info", { user: user });
  } catch (e) {
    res.status(500).send('lỗi server');
  }
};



module.exports.register = async (req, res) => {
  const { name, email, password, conf_password } = req.body;
  // checking if user is already in the database
  const emailExist = await userModel.findOne({ email: req.body.email });
  if (emailExist) {
    req.flash("error", "Email đã tồn tại");
    req.flash("name", name);
    req.flash("email", email);
    req.flash("password", password);
    req.flash("conf_password", conf_password);
    return res.redirect("/register");
  } else {
    try {
      // // hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.password, salt);
      // create user
      const user = new userModel({
        name: name,
        email: email,
        password: hashedPassword,
      });
      const saveUSer = await user.save();
      req.flash("success", "Đăng kí thành công")
      res.redirect("back");
    } catch (e) {
      res.status(500).send('lỗi server');
    }
  }
};

module.exports.login = async (req, res) => {
  const { email, password } = req.body;
  const user = await userModel.findOne({ email: req.body.email });
  if (!user) {
    req.flash("error", "Email không tồn tại");
    req.flash("email", email);
    return res.redirect("/login");
  }
  const Pass = await bcrypt.compare(req.body.password, user.password);
  if (!Pass) {
    req.flash("email", email);
    req.flash("error", "Mật khẩu sai");
    return res.redirect("/login");
  } else {
    try {
      // create and assign a token
      const token = await jwt.sign(
        { _id: user._id },
        process.env.TOKEN_SECRET,
        {
          expiresIn: "45m",
        }
      );
      const refreshToken = await jwt.sign(
        { _id: user._id },
        process.env.REFRESH_TOKEN,
        {
          expiresIn: "3d",
        }
      );
      const response = {
        access_token: token,
        refresh_token: refreshToken,
      };
      console.log(response)
      tokenList[refreshToken] = response;
      res.cookie(
        "token",
        { access_token: token, refresh_token: refreshToken },
        {
          expires: new Date(Date.now() + 8 * 3600000),
        }
      );
      req.session.user = {
        name: user.name,
        isAdmin: user.isAdmin,
        id: user._id,
      };
      if(user.isAdmin =='true') return res.redirect('/admin/users');
      res.redirect('/');
    } catch (e) {
     res.status(500).send('lỗi server')
    }
  }
};

//update user
module.exports.changeInfo = async (req, res) => {
  const { name, password, conf_password } = req.body;
    try {
      const user = await userModel.findById(req.user._id);
      // hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      user.name = name || user.name;
      user.password = hashedPassword || user.password;
      const updateUser = await user.save();
      req.session.user = {name:updateUser.name}
      req.flash("success", "Thay đổi thành công")
      res.redirect("/my");
    } catch (e) {
      res.status(500).send('lỗi server')
    }
};

module.exports.deleteUser = async (req, res) => {
  try {
    await userModel.findByIdAndDelete(req.params.id);
    req.flash("success", "Xóa thành công")
    res.redirect("/admin/users");
  } catch (e) {
    res.status(500).send('lỗi server')
  }
};

module.exports.pageForgotPassword = (req, res) => {
  res.render("user/forgot");
};

module.exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  const user = await userModel.findOne({ email: email });
  if (!user) {
    req.flash("error", "Email không tồn tại");
    req.flash("email", email);
    res.redirect("/forgotpassword");
  } else {
    const token = await jwt.sign(
      { _id: user._id },
      process.env.RESET_PASSWORD_KEY,
      {
        expiresIn: "10m",
      }
    );
    
    const data = {
      from: "admin@admin.mailgun.org",
      to: email,
      subject: "Account Reset Password",
      html: `<h2>Please click on given link to reset password</h2>
            <h5>please click http://localhost:3000/resetpassword?q=${token} to reset</h5>`
    };
    mg.messages().send(data, function (error, body) {
      console.log(body);
    });
    try {
      let resetLink = await user.updateOne({ resetLink: token });
      req.flash("success", "Link đã gửi đến email của bạn");
      res.redirect("/forgotpassword");
    } catch (e) {
      res.status(500).send('lỗi server');
    }
  }
};

module.exports.pageResetPassword = (req, res) => {
  const q = req.params.id;
  req.flash('q', q);
  res.render("user/reset");
};

module.exports.resetPassword = async (req, res) => {
  const { password } = req.body;
  const resetLink = req.params.id;
  if (resetLink) {
    try {
      const decoded = await jwt.verify(
        resetLink,
        process.env.RESET_PASSWORD_KEY
      );
      let user = await userModel.findOne({ resetLink: resetLink });
      if (!user) {
        req.flash("error", "Người dùng không tồn tại");
        return res.redirect(`/resetpassword/${resetLink}`);
      } else {
        // hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        let changePass = await user.updateOne({ password: hashedPassword });
        req.flash("success", "Mật khẩu thay dổi thành công");
        res.redirect("/resetpassword");
      }
    } catch (e) {
      res.status(500).send('lỗi server')
    }
  } else {
    req.flash("error", 'Token không hợp lệ');
    res.redirect(`/resetpassword/${resetLink}`);
  }
};

module.exports.refreshToken = async (req, res) => {
  const refreshToken = req.cookies.refresh_token;
    try {
      const decoded =await jwt.decode(refreshToken);
      const token = await jwt.sign({ _id: decoded._id }, process.env.TOKEN_SECRET, {
        expiresIn: "30m",
      });
      // update the token in the list
      tokenList[refreshToken].access_token = token;
      const response = {
        access_token: token,
        refresh_token: refreshToken
      };
      res.cookie(
        "token",
        { access_token: token, refresh_token: refreshToken },
        {
          expires: new Date(Date.now() + 8 * 3600000),
        }
      );
      res.redirect("back");
    } catch (e) {
     res.status(403).send("Token không hợp lệ")
    }
  
};



module.exports.searchUser = async (req, res) => {
  let q = req.query.q;
  try{
    let totalUsers = await userModel.find({ isAdmin: false });
    let matchedUsers = totalUsers.filter((user) => {
      return user.email.toLowerCase().indexOf(q.toLowerCase()) !== -1; // neu q nam trong title thi gia tri lon hon -1
    });
    let page = parseInt(req.query.page) || 1;
    let perPage = 8; // item in page
    if (matchedUsers.length < 1) {
      req.flash("error", `Không tìm thấy khách hàng: "${q}"`);
      req.flash("q", q);
      res.render("admin/search_users");
    } else {
      req.flash("q", q);
      res.render("admin/admin_user", pagination(page, perPage, matchedUsers));
    }
  }catch (e) {
    res.status(500).send('lỗi server');
  }
};

module.exports.logout = (req, res) => {
  delete req.session.user;
  res.clearCookie("token");
  res.redirect("/login");
};

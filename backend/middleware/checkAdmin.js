const userModel = require("../models/user.model");

module.exports = async (req, res, next) => {
  const user = await userModel.findOne({ _id: req.user._id });
  if (user.isAdmin == "true") {
    return next();
  } else {
    return res.status(403).redirect('/');
  }
};

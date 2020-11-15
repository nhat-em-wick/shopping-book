const jwt = require("jsonwebtoken");
const tokenModel = require('../models/token.model')


module.exports = async (req, res, next) => {
  if(!req.cookies.token) return res.redirect('/login');
  const decodedAccess =await jwt.decode(req.cookies.token.access_token);
  
  if(decodedAccess.exp < Math.round(new Date().getTime() / 1000)){
    try{
      const refresh_token = req.cookies.token.refresh_token
      const verifiedRefresh = jwt.verify(refresh_token, process.env.REFRESH_TOKEN);
      const access_token = await jwt.sign({ _id: verifiedRefresh._id }, process.env.TOKEN_SECRET, {
        expiresIn: "30m",
      });
      await tokenModel.updateOne(
        {refresh_token: refresh_token},
        {access_token: access_token}
      );
      res.cookie(
         "token",
         { access_token: access_token, refresh_token: refresh_token },
         {
           expires: new Date(Date.now() + 8 * 3600000),
         }
       );
      req.user = verifiedRefresh;
      return next();
    }catch{
      delete req.session.user;
      res.redirect('/login');
    }
  }else{
    try{
      const verifiedAccess = jwt.verify(req.cookies.token.access_token, process.env.TOKEN_SECRET);
      req.user = verifiedAccess;
      return next();
    }catch{
      delete req.session.user;
      return res.redirect('/login');
    }
  }
}


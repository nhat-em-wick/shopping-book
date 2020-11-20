const jwt = require("jsonwebtoken");

module.exports = async (req, res, next) => {
  if(!req.cookies.token) return res.redirect('/login');
  try{
    let decodedAccess =await jwt.decode(req.cookies.token.access_token);
    if(decodedAccess.exp < Math.round(new Date().getTime() / 1000)){
        const refresh_token = req.cookies.token.refresh_token;
        const verifiedRefresh = jwt.verify(refresh_token, process.env.REFRESH_TOKEN_SECRET);
        const newAccess_token = await jwt.sign({ _id: verifiedRefresh._id }, process.env.ACCESS_TOKEN_SECRET, {
          expiresIn: "30m",
        });
        res.cookie(
           "token",
           { access_token: newAccess_token, refresh_token: refresh_token },
           {
             expires: new Date(Date.now() + 8 * 3600000),
           }
         );
        req.user = verifiedRefresh;
        return next();
    }else{
        const access_token = req.cookies.token.access_token;
        const verifiedAccess = jwt.verify(access_token, process.env.ACCESS_TOKEN_SECRET);
        req.user = verifiedAccess;
        return next();
    }
  }catch{
    delete req.session.user;
    res.redirect('/login');
  }
  
  
}


const regName = /^([A-z](\ )?){3,}\S$/;
const regEmail = /^[A-z0-9]{5,32}\@[a-z]{2,}\.[a-z]{2,5}(\.[a-z]{2,5})?$/;
const regPass = /^(?=.*[A-z])(?=.*[0-9])([A-z0-9\!\@\#\$\&\*]){8,32}$/;
const regAddress = /^(?=.*[A-z])(?=.*[0-9])?([A-z0-9\ \.\,\-]){8,}$/g;
const regPhone = /^0[1-9]{9}$/;
const regSearch = /^[A-z0-9\ \@\.\-]*[^!#$^<>{}&,; ]$/;
const regPrice = /^[0-9]*$/;
const removeAscent = require('./removeAscent')
module.exports.checkLogin = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    req.flash('email', email);
    req.flash('error', 'Không được để trống')
    return res.redirect('back');
  }
  if (regEmail.test(email)) {
    if (regPass.test(password)) return next();
      req.flash('email', email);
      req.flash('error',"Mật khẩu phải chứa 1 ký tự chữ, 1 ký tự số và chứa ít nhất 8 ký tự")
      return res.redirect('back');
  } else {
    req.flash('email', email);
    req.flash('error',"Email không hợp lệ")
    return res.redirect('back');
  }
};

module.exports.checkRegister = (req, res, next) => {
  const { name, email, password, conf_password } = req.body;
  if (!name || !email || !password || !conf_password) {
    req.flash('error', 'Không được để trống');
    req.flash('name', name)
    req.flash('email', email)
    return res.redirect('back');
  }
  if (password !== conf_password) {
    req.flash('error', 'mật khẩu không trùng khớp');
    req.flash('name', name)
    req.flash('email', email)
    return res.redirect('back');
  }
  if (regName.test(name)) {
    if (regEmail.test(email)) {
      if (regPass.test(password) && regPass.test(conf_password)) {
        return next();
      } else {
        req.flash('error', 'Mật khẩu phải chứa 1 ký tự chữ, 1 ký tự số và chứa ít nhất 8 ký tự');
        req.flash('name', name)
        req.flash('email', email)
        req.flash('password', password)
        req.flash('conf_password', conf_password)
        return res.redirect('/register');
      }
    } else {
      req.flash('error', 'Email không hợp lệ');
      req.flash('name', name)
      req.flash('email', email)
      req.flash('password', password)
      req.flash('conf_password', conf_password)
      return res.redirect('back');
    }
  } else {
    req.flash('error', 'Tên không hợp lệ');
    req.flash('name', name)
    req.flash('email', email)
    req.flash('password', password)
    req.flash('conf_password', conf_password)
    return res.redirect('back');
  }
};
module.exports.search = (req, res, next) => {
  let q = req.query.q;
  if(q=='') return res.redirect('back');
  if (regSearch.test(removeAscent(q))){
    return next();
    } 
  return res.status(403).send('Từ khóa không hợp lệ');
};
module.exports.checkChangeInfo = (req, res, next) => {
  const { name, password, conf_password } = req.body;
  if (password !== conf_password) {
    req.flash('error',"Mật khẩu không trùng khớp")
    req.flash('name', name)
    return res.redirect('back');
  }
  if (regName.test(name)) {
    if (regPass.test(password) && regPass.test(conf_password))  return next();
      req.flash('error',"Mật khẩu phải chứa 1 ký tự chữ, 1 ký tự số và chứa ít nhất 8 ký tự")
      req.flash('name', name)
      return res.redirect('back');
  } else {
    req.flash('error',"Tên không hợp lệ")
    req.flash('name', name)
    return res.redirect('back');
  }
};


module.exports.checkNewPass = (req, res, next)=>{
  const {newpass} = req.body;
  const id = req.params.id;
  if(!newpass)
    req.flash('error', 'Không được để trống');
    return res.redirect(`/resetpassword/${id}`);
  if(regPass.test(newpass)) return next();
  req.flash('error',"Mật khẩu phải chứa 1 ký tự chữ, 1 ký tự số và chứa ít nhất 8 ký tự")
  return res.redirect(`/resetpassword/${id}`);
};

module.exports.checkOrder = (req, res, next) => {
  const { address, phone } = req.body;
  if (!address || !phone) {
    req.flash('error',"Không được để trống")
    req.flash('phone',phone);
    req.flash('address', address)
    return res.redirect('/checkout')
  }
  if (regPhone.test(phone)) {
    if (regAddress.test(address)) {
      return next();
    } else {
      req.flash('error', 'Địa chỉ không hợp lệ')
      req.flash('phone',phone);
      req.flash('address', address)
      return res.redirect('/checkout');
    }
  } else {
    req.flash('phone',phone);
    req.flash('address', address)
    req.flash('error', "SĐT không hợp lệ");
    return res.redirect('/checkout');
  }
};


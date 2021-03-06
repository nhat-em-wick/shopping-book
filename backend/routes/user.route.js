const express = require("express");
const userController = require("../controllers/user.controller");
const verifyToken = require("../middleware/verifyToken");
const router = express.Router();
const checkAdmin = require("../middleware/checkAdmin");
const checkInput = require("../middleware/checkinput");
const limitRequest = require("../middleware/rateLimitRequest");
const checkSessionUser = require("../middleware/checkSessionUser");


router.get('/login',checkSessionUser, userController.pageLogin);
router.get('/register',checkSessionUser, userController.pageRegister);


router.post(
  '/login',
  limitRequest.limiterLogin,
  limitRequest.speedLimiter,
  checkInput.checkLogin,
  userController.login
);



router.post('/register', checkInput.checkRegister, userController.register);

router.get('/my', verifyToken, userController.myInfo);

router.post(
  '/my/edit',
  verifyToken,
  checkInput.checkChangeInfo,
  userController.changeInfo
);
router.get('/forgotpassword', userController.pageForgotPassword);
router.post('/forgotpassword', userController.forgotPassword);
router.get('/resetpassword/:id', userController.pageResetPassword);
router.post('/resetpassword/:id',checkInput.checkNewPass, userController.resetPassword);


router.get('/admin/users', verifyToken, checkAdmin, userController.adminUser);

router.post(
  '/admin/register',
  verifyToken,
  checkAdmin,
  checkInput.checkRegister,
  userController.register
);

router.delete(
  '/admin/deleteuser/:id',
  verifyToken,
  checkAdmin,
  userController.deleteUser
);
router.get('/admin/users/search', verifyToken,checkAdmin, checkInput.search, userController.searchUser);

router.get('/logout', userController.logout)

module.exports = router;

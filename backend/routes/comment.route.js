const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken");
const commentController = require("../controllers/comment.controller");
const checkInput = require("../middleware/checkinput");



router.get('/comment/:id',  verifyToken, commentController.pageComment)
router.post('/comment/:id',checkInput.checkComment, verifyToken, commentController.saveComment)
router.get('/review', verifyToken, commentController.pageReview)
router.post('/review',checkInput.checkComment, verifyToken, commentController.saveReview)

module.exports = router;
 
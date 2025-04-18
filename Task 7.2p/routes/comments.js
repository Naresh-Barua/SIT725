const express = require('express');
const router = express.Router({ mergeParams: true });
const commentsController = require('../controllers/commentsController');

router.get('/', commentsController.listComments);
router.post('/', /* authMiddleware, */ commentsController.addComment);

module.exports = router;

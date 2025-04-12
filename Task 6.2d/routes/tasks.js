const express = require('express');
const router = express.Router();
const tasksController = require('../controllers/tasksController');
const { verifyToken } = require('../middlewares/authMiddleware');

router.get('/', verifyToken, tasksController.listTasks);
router.get('/:id', verifyToken, tasksController.getTask);
router.post('/', verifyToken, tasksController.createTask);
router.put('/:id', verifyToken, tasksController.updateTask);
router.delete('/:id', verifyToken, tasksController.deleteTask);

  
module.exports = router;

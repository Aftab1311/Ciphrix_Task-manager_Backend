const express = require('express');
const router = express.Router();
const { createTask, updateTask, deleteTask, listTasks,getTask } = require('../controllers/taskController');
const auth = require('../middleware/auth');
const role = require('../middleware/role');

router.get('/', auth, listTasks);
router.post('/', auth, createTask);
router.get("/:id",auth,getTask)
router.put('/:id', auth, updateTask);
router.delete('/:id', auth, role('admin'), deleteTask); // only admin can delete
module.exports = router;

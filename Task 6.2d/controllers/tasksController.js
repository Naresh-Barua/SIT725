const Task = require('../models/taskModel');
const User = require('../models/userModel');  // Import the User model


exports.listTasks = async (req, res) => {
  try {
    let filter = {};
    if (req.query.assignedTo) {
      filter.assignedTo = req.query.assignedTo;
    }
    const tasks = await Task.find(filter)
      .populate('createdBy', 'username email')
      .populate('assignedTo', 'username email');
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch tasks.' });
  }
};

exports.getTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('createdBy', 'username email')
      .populate('assignedTo', 'username email');
    if (!task) return res.status(404).json({ error: 'Task not found.' });
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch task.' });
  }
};

exports.createTask = async (req, res) => {
  try {
    // Create a copy of the request body and add the createdBy field from the logged-in user.
    const taskData = { ...req.body, createdBy: req.user.id };

    // Check for assignedTo field and convert it if needed.
    if (taskData.assignedTo) {
      // If the input is not a 24-character hex string (valid ObjectId)
      if (!/^[0-9a-fA-F]{24}$/.test(taskData.assignedTo)) {
        let assignedUser;
        // If the input contains an "@" symbol, assume it's an email; otherwise, treat it as a username.
        if (taskData.assignedTo.includes('@')) {
          assignedUser = await User.findOne({ email: taskData.assignedTo });
        } else {
          assignedUser = await User.findOne({ username: taskData.assignedTo });
        }
        if (assignedUser) {
          taskData.assignedTo = assignedUser._id;
        } else {
          // Option: return error if user is not found, or simply leave it undefined.
          taskData.assignedTo = undefined;
        }
      }
    }

    // Create the new task
    const newTask = await Task.create(taskData);
    res.status(201).json(newTask);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create task.', details: err.message });
  }
};


exports.updateTask = async (req, res) => {
  try {
    // Check for assignedTo field and convert it if necessary.
    if (req.body.assignedTo) {
      if (!/^[0-9a-fA-F]{24}$/.test(req.body.assignedTo)) {
        let assignedUser;
        if (req.body.assignedTo.includes('@')) {
          assignedUser = await User.findOne({ email: req.body.assignedTo });
        } else {
          assignedUser = await User.findOne({ username: req.body.assignedTo });
        }
        if (assignedUser) {
          req.body.assignedTo = assignedUser._id;
        } else {
          req.body.assignedTo = undefined;
        }
      }
    }

    const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedTask) return res.status(404).json({ error: 'Task not found.' });
    res.json(updatedTask);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update task.', details: err.message });
  }
};


exports.deleteTask = async (req, res) => {
  try {
    const deletedTask = await Task.findByIdAndDelete(req.params.id);
    if (!deletedTask) return res.status(404).json({ error: 'Task not found.' });
    res.json({ message: 'Task deleted successfully.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete task.' });
  }
};

const Task = require('../models/taskModel');
const User = require('../models/userModel');  // Import the User model
const { isFutureDate } = require('../public/js/dateUtils');



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
    if (!task)
       return res.status(404).json({ error: 'Task not found.' });
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch task.' });
  }
};

exports.createTask = async (req, res) => {
  try {
    // 1) Build the base payload, including who created it:
    const taskData = { ...req.body, createdBy: req.user.id };

    // 2) Enforce future due dates:
    if (req.body.dueDate && !isFutureDate(req.body.dueDate)) {
      return res.status(400).json({ error: 'Due date must be in the future.' });
    }

    // 3) Normalize “assignedTo”:
    if (!taskData.assignedTo || taskData.assignedTo.trim() === '') {
      // completely unassigned: drop the field
      delete taskData.assignedTo;
    } else if (!/^[0-9a-fA-F]{24}$/.test(taskData.assignedTo)) {
      // not an ObjectId → look up by email or username
      const assignedUser = taskData.assignedTo.includes('@')
        ? await User.findOne({ email: taskData.assignedTo })
        : await User.findOne({ username: taskData.assignedTo });
      taskData.assignedTo = assignedUser ? assignedUser._id : undefined;
    }

    // 4) Actually create the task in Mongo:
    const newTask = await Task.create(taskData);

    // 5) Broadcast event so your client’s socket listeners will fire
    const io = req.app.get('io');
    io.emit('task:created', newTask);

    // 6) Return the new task
    return res.status(201).json(newTask);

  } catch (err) {
    console.error('Error creating task:', err);
    return res
      .status(500)
      .json({ error: 'Failed to create task.', details: err.message });
  }
};


exports.updateTask = async (req, res) => {
  try {
    // 1) If the user cleared the "Assigned To" input (sent ""), convert to null
    if (req.body.assignedTo === "") {
      req.body.assignedTo = null;
    }

    // 2) Only process assignment lookup if assignedTo is non-null and non-empty
    if (req.body.assignedTo !== null && req.body.assignedTo !== undefined) {
      let newAssigneeId;

      // If it's already a valid ObjectId string, accept it
      if (/^[0-9a-fA-F]{24}$/.test(req.body.assignedTo)) {
        newAssigneeId = req.body.assignedTo;
      } else {
        // Otherwise lookup by email or username
        const query = req.body.assignedTo.includes('@')
          ? { email: req.body.assignedTo }
          : { username: req.body.assignedTo };
        const assignedUser = await User.findOne(query);
        if (assignedUser) {
          newAssigneeId = assignedUser._id;
        }
      }

      // 3) Set or delete the field based on lookup result
      if (newAssigneeId) {
        req.body.assignedTo = newAssigneeId;
      } else {
        delete req.body.assignedTo;
      }
    }

    // 4) If assignedTo truly wasn’t provided at all, remove the key
    if (req.body.assignedTo === undefined) {
      delete req.body.assignedTo;
    }

    // 5) Perform the update
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedTask) {
      return res.status(404).json({ error: 'Task not found.' });
    }

    // 6) Emit the updated task (including its title) for real‑time clients
    const io = req.app.get('io');
    io && io.emit('task:updated', updatedTask);

    // 7) Return the updated document
    res.json(updatedTask);

  } catch (err) {
    console.error('Failed to update task:', err);
    res.status(500).json({
      error: 'Failed to update task.',
      details: err.message
    });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    // Find & remove, grab title
    const deletedTask = await Task.findByIdAndDelete(req.params.id).lean();
    if (!deletedTask) {
      return res.status(404).json({ error: 'Task not found.' });
    }

    // Emit payload with both id & title
    const io = req.app.get('io');
    io && io.emit('task:deleted', {
      id: deletedTask._id.toString(),
      title: deletedTask.title
    });

    res.json({ message: `Task "${deletedTask.title}" deleted.` });
  } catch (err) {
    console.error('Failed to delete task:', err);
    res.status(500).json({ error: 'Failed to delete task.' });
  }
};


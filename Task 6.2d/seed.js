const mongoose = require('mongoose');
const User = require('./models/userModel');
const Task = require('./models/taskModel');

mongoose.connect('mongodb://localhost:27017/CTB', )
  .then(async () => {
    // Clear previous data
    await User.deleteMany({});
    await Task.deleteMany({});

    // Create admin user
    const adminUser = await User.create({
      username: 'adminUser',
      email: 'admin@example.com',
      password: 'password123',
      role: 'admin'
    });

    // Create worker user
    const workerUser = await User.create({
      username: 'workerUser',
      email: 'worker@example.com',
      password: 'password123',
      role: 'worker'
    });

    // Sample tasks assigned to the worker
    const tasks = [
      {
        title: "Task 1: Fix Bug",
        description: "Fix the login bug on the platform.",
        image: "images/task1.jpg",
        link: "http://example.com/task1",
        dueDate: new Date(Date.now() + 86400000),
        status: "Open",
        createdBy: adminUser._id,
        assignedTo: workerUser._id
      },
      {
        title: "Task 2: Develop Feature",
        description: "Build the new dashboard feature.",
        image: "images/task2.jpg",
        link: "http://example.com/task2",
        dueDate: new Date(Date.now() + 2 * 86400000),
        status: "In Progress",
        createdBy: adminUser._id,
        assignedTo: workerUser._id
      }
    ];

    await Task.insertMany(tasks);
    console.log("Seed data inserted!");
    mongoose.connection.close();
  })
  .catch(err => console.log(err));

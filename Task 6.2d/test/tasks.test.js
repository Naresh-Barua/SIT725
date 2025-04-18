process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp); // This must come before using chai.request()
console.log('chai.request:', chai.request);
const mongoose = require('mongoose');
const server = require('../server'); // Make sure your server.js exports the app
const Task = require('../models/taskModel');
const User = require('../models/userModel');
const should = chai.should();

// ------------------------------
// API (Integration) Tests for Tasks CRUD
// ------------------------------

describe('Tasks API (Admin CRUD)', () => {
  let adminToken;
  let taskId;
  
  // Create an admin user and login before tests run
  before(async () => {
    // Clear tasks and users for test isolation (in production, use a dedicated testing database)
    await Task.deleteMany({});
    await User.deleteMany({});
    
    // Create an admin user (adjust credentials as needed)
    const adminUser = await User.create({
      username: 'adminTest',
      email: 'admin@test.com',
      password: 'password123',
      role: 'admin'
    });
    
    // Login to get JWT token for admin
    const res = await chai.request(server)
      .post('/api/auth/login')
      .send({ email: 'admin@test.com', password: 'password123' });
      
    adminToken = res.body.token;
  });
  
  describe('GET /api/tasks', function() {
    it('should GET all the tasks', function(done) {
      chai.request(server)
        .get('/api/tasks')
        .set('Authorization', `Bearer ${adminToken}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.an('array');
          done();
        });
    });
  });
  
  describe('POST /api/tasks', function() {
    it('should create a new task', function(done) {
      const task = {
        title: 'Test Task',
        description: 'Test description for task',
        dueDate: '2025-05-01',
        assignedTo: 'worker@test.com'  // using an email for lookup via conversion logic
      };
      chai.request(server)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(task)
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.have.property('_id');
          res.body.title.should.equal('Test Task');
          taskId = res.body._id;
          done();
        });
    });
  });
  
  describe('PUT /api/tasks/:id', function() {
    it('should update an existing task', function(done) {
      const updatedTask = {
        title: 'Updated Task Title',
        description: 'Updated description',
        dueDate: '2025-05-02',
        assignedTo: 'worker@test.com'
      };
      chai.request(server)
        .put('/api/tasks/' + taskId)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(updatedTask)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.title.should.equal('Updated Task Title');
          done();
        });
    });
  });
  
  describe('DELETE /api/tasks/:id', function() {
    it('should delete a task', function(done) {
      chai.request(server)
        .delete('/api/tasks/' + taskId)
        .set('Authorization', `Bearer ${adminToken}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('message').that.includes('deleted');
          done();
        });
    });
  });
});



// ------------------------------
// Unit Tests for Tasks CRUD (Due Date Check) (Admin) 
// ------------------------------

// public/js/dateUtils.test.js

const { expect } = require('chai');
const { isFutureDate } = require('../public/js/dateUtils');  // Adjust the path if needed

describe('Admin CRUD (isFutureDate)', () => {
  it('should return true for a date in the future', () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    expect(isFutureDate(tomorrow.toISOString())).to.be.true;
  });

  it('should return false for a date in the past', () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    expect(isFutureDate(yesterday.toISOString())).to.be.false;
  });

  it('should return false for an invalid date', () => {
    expect(isFutureDate('invalid-date')).to.be.false;
  });
});

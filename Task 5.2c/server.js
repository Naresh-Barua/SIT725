
var express = require("express")
const path = require('path');

var app = express()
const cors = require('cors');
const Project = require('./models/projectModel'); // Adjust the path as necessary
var port = process.env.port || 3000;

app.use(express.static(__dirname+'/public'))
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors()); // Allows frontend to access API



var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/p4', {
  
})
.then(() => console.log("MongoDB connected!"))
  .catch(err => console.log(err));

  app.get('/api/projects', async (req, res) => {
    try {
      const projects = await Project.find({});
      res.json(projects);
    } catch (err) {
      res.status(500).send(err);
    }
  });

// Routes: Mount projects routes at /api/projects
const projectsRoute = require('./routes/projects');
app.use('/api/projects', projectsRoute);

// View Route: Serve index.html from the views folder
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});


app.listen(port,()=>{
  console.log("App listening to: http://localhost:" + port)
})
var express = require("express")
var app = express()
const cors = require('cors');
const Project = require('./public/models/projectModel'); // Adjust the path as necessary


app.use(express.static(__dirname+'/public'))
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors()); // Allows frontend to access API

var port = process.env.port || 3000;

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

app.listen(port,()=>{
  console.log("App listening to: http://localhost:" + port)
})
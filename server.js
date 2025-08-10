const express = require('express');
const mongoose = require('mongoose');
// const routes = require('./routes');
const path = require('path');
// Secure code from injection attacks
const Joi = require('joi');
const helmet = require('helmet');
const sanitize = require('mongo-sanitize');
//Task scheme
const Task = require('./models/task');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

//MongoDb connection
mongoose.connect(process.env.MONGO_URI,)
  .then(() => {console.log('Connected to MongoDb Atlas');})
  .catch(err => console.error('MongoDB connection error:', err));

//Middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc:["'self'", "https://cdn.jsdelivr.net"]
    }
  }
}));
app.use(express.static(__dirname + "/public"));
app.use(express.json({limit: '10kb'}));
app.use(express.urlencoded({extended: true}));

//View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

//Validation schema

const taskSchema = Joi.object({
  id: Joi.string().optional(),
  title: Joi.string().max(30).required().trim(),
  type: Joi.string().max(10).required().trim(),
  due: Joi.string().optional().allow(null, '').trim(),

});

//Routes
app.get('/', async (req, res) => {
  try {
    const allTasks = await Task.find();
    const todaysTasks = allTasks.filter(task => !task.completed);
    const completedTasks = allTasks.filter(task => task.completed);
    
    res.render('index', {
      todaysTasks,
      completedTasks
    });
  } catch(err) {
    console.error('Error mesage:', err);
    res.status(500).send('Server error');
  }
})

app.post('/save', async (req, res) => {
  const {error, value} = taskSchema.validate(req.body);
  if(error) {
    return res.status(400).send('Invalid input:' + error.details[0].message);
  }
  try {
    await Task.create({
      title: sanitize(value.title),
      Deadline: value.due || null,
      type: sanitize(value.type),
      completed: false,
    });
    res.redirect('/');
  } catch (err) {
    console.error('Error saving task:', err);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/edit', async (req,res) => {
  const {error,value} = taskSchema.validate(req.body);
  if(error) {
    return res.status(400).send('Invalid input:' + error.details[0].message);
  }
  try{
    const taskId = sanitize(req.body.id);
    if(!taskId) {
      return res.status(400).send('Task ID is required');
    }

    await Task.findByIdAndUpdate(taskId, {
      title: sanitize(value.title),
      Deadline: value.due || null,
      type: sanitize(value.type),
      completed: false,
    });
    res.redirect('/')
  } catch (err) {
    console.error('Error saving task:', err);
    res.status(500).send('Internal Server Error');
  }
})

app.post('/finish', async (req, res) => {
  let id = sanitize(req.body.id);
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({success: false, error: "invalid Id"});
  }
  
  try{
    await Task.findByIdAndUpdate(id, {completed : true});
    res.status(200).json({success:true});
  } catch (err) {
    console.error('Error deleting:', err);
    res.status(500).json({success: false});
  }
})

app.post('/delete', async (req,res) => {
  let id = sanitize(req.body.id);
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({success: false, error: "invalid Id"});
  }

  try {
    await Task.findByIdAndDelete(id);
    res.status(200).json({success:true});
  } catch (err) {
    console.error('Error deleting:', err);
    res.status(500).json({success: false});
  }
})
// app.use(routes);

//Start server
app.listen(PORT, () => {
  console.log('listening to port 3000');
});

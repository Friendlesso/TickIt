const express = require('express');
const mongoose = require('mongoose');
// const routes = require('./routes');
const path = require('path');
const Task = require('./models/task');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

//MongoDb connection
mongoose.connect(process.env.MONGO_URI,)
  .then(() => {
    console.log('Connected to MongoDb Atlas');
  })
  .catch(err => console.error('MongoDB connection error:', err));

//Middleware
app.use(express.static(__dirname + "/public"));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

//View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

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
  const { title, due, type ,} = req.body;

  try {
    await Task.create({
      title,
      Deadline: due,
      type,
      completed: false,
    });

    res.redirect('/');
  } catch (err) {
    console.error('Error saving task:', err);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/finish', async (req, res) => {
  let id = req.body.id;
  try{
    await Task.findByIdAndUpdate(id, {completed : true});
    res.status(200).json({success:true});
  } catch (err) {
    console.error('Error deleting:', err);
    res.status(500).json({success: false});
  }
})

app.post('/delete', async (req,res) => {
  let id = req.body.id;
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

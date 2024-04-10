var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

/*contants */
const mongoose = require('mongoose')
const axios = require('axios')
const bodyParser = require('body-parser');
const cors = require('cors'); // Importez cors

// Middleware
app.use(cors());
app.use(bodyParser.json());
mongoose.connect('mongodb+srv://sahar:3s87IHLPxp2nee3G@mernap1.6rlt6jl.mongodb.net/test_mern_app?retryWrites=true&w=majority&appName=mernap1').then(() => {
  console.log('MongoDB connected');
}).catch((err) => {
  console.error('MongoDB connection error:', err);
});


const User = require('./models/User.js')
// Ajoutez cette route au-dessus de vos gestionnaires d'erreurs
app.get('/test', function(req, res, next) {
  if (mongoose.connection.readyState === 1) {
    res.send('MongoDB connected');
  } else {
    res.send('MongoDB not connected');
  }
});

app.get('/data', async (req, res) => {
  try {
    const data = await User.find();
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
/*
app.post('/users', async (req, res) => {
  const { username, password, email } = req.body;

  try {
    const newUser = new User({ username,password, email });
    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    console.log("Error creating user:", error);
    //res.status(500).json({ message: error.message });
    console.log("verifier data");

    res.send({"message":"verifier data"})
  }
});
*/
app.post('/create_user', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const newUser = new User({ username, email, password });
    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.log("Error creating user:", error);
  }
});




// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

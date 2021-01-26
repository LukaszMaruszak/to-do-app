var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var dbService = require('./dbService');

// const cors = require('cors');
// const dotenv = require('dotenv');
// dotenv.config();

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();


//database

// app.use(cors());

//! app.use('/dbService', dbService);

// app.use(express.json());
// app.use(express.urlencoded({extended: false}));

// read
app.get('/getTaskFromList/:id', (req, res) => {

  const id = req.params.id;

  const db = dbService.getDbServiceInstance();

  const result =  db.getAllData(id);

  result.then(data => res.json({data: data}))
      .catch( err => console.log(err));
})


// create
app.post('/insert/:title,:list_id,:done,:date', (req, res) => {
  const task = {
    Title: req.params.title,
    ListID: req.params.list_id,
    Done: req.params.done,
    TaskDate: req.params.date
  }

  console.log()
  const db = dbService.getDbServiceInstance();

  const result = db.insertNewTask(task);

  result
      .then(data => res.json({data: data}))
      .catch(err => console.log(err));
});


// update
app.patch('/update/:id,:done', (req, res) => {
  let id = req.params.id;
  let done = req.params.done;

  const db = dbService.getDbServiceInstance();

  const result = db.updateTask(id, done);

  result
      .then(data => res.json({success : data}))
      .catch( err => console.log(err));
})


// delete
app.delete('/delete/:id', ((req, res) =>{
  const id = req.params.id;

  const db = dbService.getDbServiceInstance();

  const result =  db.deleteTask(id);

  result
      .then(data => res.json({ success: data}))
      .catch( err => console.log(err));

}))


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

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

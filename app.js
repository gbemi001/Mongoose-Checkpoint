var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
let mongoose = require('mongoose')

let uri = 'mongodb+srv://yolong:gZGew5vQ0t2TwrRJ@cluster0.5igha.mongodb.net/Person-PrototyperetryWrites=true&w=majority'

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

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

// Create a person with this prototype:
let peopleSchema = new mongoose.Schema({
  name: {type: String, required: true},
  age: Number,
  favoriteFoods:[String]
})

// Create and Save a Record of a Model

let Person = mongoose.model('Person', peopleSchema)

let Gbemi = new Person({name: 'Gbemi', age: 29, favoriteFoods:['Pounded Yam', 'Ogbono', 'Meat Pie', 'Ice Cream' ]})
Gbemi.save((error, data) =>{
  if(error){
    console.log(error)
  }
})

// Create Many Records with model.create()

let arrayOfPeople = [
  {name: 'Sola', age:'26', favoriteFoods: ['Tuwo Shinkafa', 'Efo riro']},
  {name: 'Efe', age:'28', favoriteFoods:['Starch', 'Egusi']},
  {name: 'Ayo', age:'29', false: ['Amala', 'Gbegiri']}
]

var createManyPeople = function(arrayOfPeople, done){
  Person.create(arrayOfPeople, (error, createdPeople) => {
    if(error){
      console.log(error)
    }
  })
}

// Use model.find() to Search Your Database

Person.find({name:'Sola'}, (error, data) => {
  if(error){
    console.log(error)
  }else{
    console.log(data)
  }
})

// Use model.findOne() to Return a Single Matching Document from Your Database

Person.findOne({favoriteFoods: {$all:['Starch', 'Egusi']}}, (error, data) => {
  if(error){
    console.log(error)
  }else{
    console.log(data)
  }
})

// Use model.findById() to Search Your Database By _id

Person.findById('<Id String>', (error, data) => {
  if(error){
    console.log(error)
  }else{
    console.log(data)
  }
})

var findPersonById = function(personId){
  Person.findById(personId, (error, data) => {
    if(error){
      console.log(error)
    }
  })
}

// Perform Classic Updates by Running Find, Edit, then Save
Person.findById(personId, (error, result) => {
  if(error){
    console.log(error)
  }else{
    result.age = 32
    result.favoriteFoods.push('hamburger')
    result.save((error, updatedRecord) => {
      if(error){
        console.log(error)
      }
    })
  }
})

// Perform New Updates on a Document Using model.findOneAndUpdate()
Person.findOneAndUpdate({name: 'Efe'}, {age: 20}, {new: true}, (error, data) => {
  if(error){
    console.log(error)
  }else{
    console.log(data)
  }
})

// Delete One Document Using model.findByIdAndRemove
Person.findByIdAndRemove(personId, (error, deletedRecord) => {
  if(error){
    console.log(error)
  }
})

// MongoDB and Mongoose - Delete Many Documents with model.remove()
Person.remove({name: 'Ayo'}, (error, JSONStatus) => {
  if(error){
    console.log(error)
  }else{
    done(null, JSONStatus)
  }
})

// Chain Search Query Helpers to Narrow Search Results
var foodToSearch = 'Amala'
Person.find({favoriteFoods:{$all : [foodToSearch]}})
.sort({name:'asc'})
.limit(2)
.select('-age')
.exec((error, filteredResults) => {
  if(error){
    console.log(error)
  }else{
    done(null, filteredResults)
  }
})


module.exports = app;

 
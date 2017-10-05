"use strict";
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const keys = require('./config/keys');
const http = require('http');
let db;

//https://ide50-tony-rr.cs50.io:8081
//apache50 start / , apache50 stop
//https://zellwk.com/blog/crud-express-and-mongodb-2/

app.use(bodyParser.urlencoded({extended: true}));
 //our put request will send the body as a JSON (via stringify) this middle ware allows our server to read it
app.use(bodyParser.json());
app.use(express.static('public'));
app.set('view engine', 'ejs');

const PORT = process.env.PORT || 5000;

MongoClient.connect(keys.mongoDB, (err, database) => {
    if (err) console.log(err);
    db = database;
    //server start
    app.listen(PORT, function() {
        console.log('listening on: ' + PORT);
    });
});

app.get('/', function(req, res){
    //Page Views
    db.collection('stats').findOneAndUpdate(
      { name : "Simon_Views" },
      { $inc : { "Total_Views" : 1 } },
      { upsert: true },
      (err, result) => {
          if (err) console.log(err);
    });
    //Retrieve Scores to render
    db.collection('scores').find().sort({"score":-1}).toArray((err, results) => {
        if (err) console.log(err);
       //console.log(results);
       results.map((e)=>e.toString());
       res.render('simon.ejs', {score: results});
    });
});

app.post("/score", (req, res) => {
    let setDate = new Date();
    let date = setDate.toString().substr(4,11);
    req.body.time = date;
    req.body.score = parseInt(req.body.score);
    console.log(req.body);
    db.collection('scores').save(req.body, (err, result) => {
        if (err) console.log(err);
        console.log('Saved to DB');
        res.redirect('/');
    });
});

app.put('/scores', (req, res) => {
  req.body.score = parseInt(req.body.score);
  console.log(req.body);
  db.collection('scores')
  .findOneAndUpdate({name: req.body.name},{
      //  {name: req.body.name}
    $set: {
        score: req.body.score
      }
    },
    {
        sort: {_id:-1},
        upsert: true
    },
    (err, result) => {
        if (err) return res.send(err);
        res.send(result);
        //res.send({message: 'sending from the server!'});
    });
});

app.delete('/scores', (req, res) => {
   console.log('F the ' + req.body.name);
   db.collection('scores').findOneAndDelete(
       {name: req.body.name},
       //find way to sort the score values instead of entry ID...
       {sort: {_id: -1} },
       function(err, result){
           if (err) return res.send(500, err);
           //what other types of things can we send as the result?
           res.send({message: "\"" + req.body.name + "\"" + ' Entry has been deleted'});
       });
});

app.get('/db', function(req, res){
    //res.sendFile('/home/ubuntu/workspace/' + 'index.ejs');
    //var cursor = db.collection('crud').find();
    //var test = ['what', "the", 'Hell'];
    db.collection('scores').find().toArray((err, results) => {
        if (err) console.log(err);
       //console.log(results);
       res.render('updateDB.ejs', {score: results});
    });
    //res.render('index.ejs', {crud: test});
});

app.use(express.static('scripts'));

app.get('/calculator', function(req, res){
    res.render('calculator.ejs');
});

app.put('/stats', function(req, res){
    db.collection('stats').findOneAndUpdate(
      { name : "Simon_Plays" },
      { $inc : { "Total_Plays" : 1 } },
      { upsert: true },
      (err, result) => {
          if (err) console.log(err);
      }
   );
});

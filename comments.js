// Create web server
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

// Connect to MongoDB
const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017';
const dbName = 'myproject';
const client = new MongoClient(url, { useNewUrlParser: true });
let db;

client.connect(function (err) {
    console.log("Connected successfully to server");
    db = client.db(dbName);
});

// Add middleware to parse json
app.use(bodyParser.json());

// Get all comments
app.get('/comments', function (req, res) {
    db.collection('comments').find({}).toArray(function (err, result) {
        if (err) throw err;
        res.send(result);
    });
});

// Get comment by id
app.get('/comments/:id', function (req, res) {
    const id = req.params.id;
    db.collection('comments').findOne({ _id: id }, function (err, result) {
        if (err) throw err;
        res.send(result);
    });
});

// Add new comment
app.post('/comments', function (req, res) {
    const comment = req.body;
    db.collection('comments').insertOne(comment, function (err, result) {
        if (err) throw err;
        res.send(result);
    });
});

// Update comment
app.put('/comments/:id', function (req, res) {
    const id = req.params.id;
    const comment = req.body;
    db.collection('comments').updateOne({ _id: id }, { $set: comment }, function (err, result) {
        if (err) throw err;
        res.send(result);
    });
});

// Delete comment
app.delete('/comments/:id', function (req, res) {
    const id = req.params.id;
    db.collection('comments').deleteOne({ _id: id }, function (err, result) {
        if (err) throw err;
        res.send(result);
    });
});

// Start web server
app.listen(port, function () {
    console.log('Listening on port ' + port);
});

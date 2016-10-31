/**
 * Created by iron on 30.10.16.
 */
console.log('May Node be with you');

const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.set('view engine', 'ejs');
app.use(express.static('public'));

var db;
MongoClient.connect('mongodb://admin-nme:88888888@ds061506.mlab.com:61506/nme-db', (err, database) => {
    if(err) return console.log(err);
    db = database;
    app.listen(3000, () => {
        console.log('listening on 3000');
    })
});

app.get('/', (req, res) => {
    db.collection('quotes').find().toArray((err, result) => {
        if (err) return console.log(err);
        res.render('index.ejs', {quotes:result});
    });
});

app.post('/quotes', (req, res) => {
    db.collection('quotes').save(req.body, (err, result) => {
        if(err) return console.log(err);

        console.log('Saved to database');
        res.redirect('/');
    })

});

app.put('/quotes', (req, res) => {
    db.collection('quotes').findOneAndUpdate({
        name: 'Jack'}, {
        $set: {
            name: req.body.name,
            quote: req.body.quote
        }
    }, {
        sort: {_id: -1},
        upsert: true
    }, (err, result) => {
        if (err) return res.send(result)
    })
});

app.delete('/quotes', (req, res) => {
    db.collection('quotes').findOneAndDelete({name: req.body.name},
        (err, result) => {
            if (err) return res.send(500, err);
            res.send('A darth vadar quote got deleted')
        })
})
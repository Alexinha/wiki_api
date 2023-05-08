// server code
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(express.static("public"));


// set up mongoDB
mongoose.connect("mongodb://127.0.0.1:27017/wikiDB", {
    useNewUrlParser: true // dont use localhost:27017
});

// create schema and model 
const articleSchema = {
    title: String, 
    content: String
};

const Article = mongoose.model("Article", articleSchema);

// GET
app.get("/articles", function(req, res){
    // query the database and find all the articles in it
    Article.find({}).then(function(foundArticles){
        res.send(foundArticles);
    }).catch(function(err){
        console.log(err);
    });
});

// POST
app.post("/articles", function(req, res){
    console.log(req.query.title);
    console.log(req.query.content);
});

app.listen(3000, function(){
    console.log("server started on port 3000");
});
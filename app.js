//------- server starter code --------//
const express = require("express");

const mongoose = require("mongoose");

const ejs = require("ejs");

const app = express();

app.set("view engine", "ejs");

app.use(express.urlencoded({
  extended: true
}));

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect("mongodb+srv://admin-alexinha:liberty0216@cluster0.jh2ua.mongodb.net/WikiDB?retryWrites=true&w=majority");
}

app.use(express.static("public"));

//------- server starter code --------//
//
//------- make collection -------------//
const articleSchema = new mongoose.Schema({
  title: String,
  content: String
});

const Article = mongoose.model("Article", articleSchema);

//-------- create a (express) get route to fetch ALL the documents -----------//

app.get("/articles", function(req, res) {
  Article.find(function(err, results) {
    if (err) {
      res.send(err);
    } else {
      res.send(results);
    }
  });
});

//-------- post route to receive data and create a new document -----------//
// using Postman to make post request. the title & content following the req.body are keys set and used in postman.
app.post("/articles", function(req, res) {
  const inputTitle = req.body.title;
  const inputContent = req.body.content;

  const article = new Article({
    title: inputTitle,
    content: inputContent
  });

  article.save(function(err) {
    if (err) {
      res.send(err);
    } else {
      res.send("Successfully added a new article!");
    }
  });
});

//--------- delete ALL the documents  -----------//
// also test with postman
app.delete("/articles", function(req, res) {
  Article.deleteMany(function(err) {
    if (err) {
      res.send(err);
    } else {
      res.send("Successfully deleted all the articles!");
    }
  });
});

//---------- alternatively: using an express route handler -----------------------//
// see express-route-handler.js
// app.route("/articles").get(callback).post(callback).delete(callback);


//---------- get and fetch one specific document  ------------//
// using route handlers and route parameters
app.route("/articles/:articleTitle")

  .get(function(req, res) {
    Article.findOne({
      title: req.params.articleTitle
    }, function(err, result) {
      if (err) {
        res.send(err);
      } else if (result) { // cant find a result is different from an error
        res.send(result);
      } else {
        res.send("there's no matching result for your search.");
      }
    });

  })

  //---------------- put request (let the users to replace one specific document), app.put(); ------------------------------------//
  // using mongoDB replaceOne():
  // < ModleName > .replaceOne({conditions}, {upates}, function(err, results){});
  // this will always overwite, so when the user don't select certain field to update/replace, the field will just be deleted.
  // but actually here with put request we can use updateOne() too and it also only updates.
  .put(function(req, res) {
    Article.replaceOne({
        title: req.params.articleTitle
      }, {
        title: req.body.title, //title and content behind the req.body here are keys we set in postman too
        content: req.body.content
      },
      function(err) {
        if (!err) {
          res.send("Successfully updated article!");
        } else {
          res.send(err);
        }
      }
    );
  })

  //---------------- patch request (only update specific fields)----------------------------//

  .patch(function(req, res) {
    Article.updateOne({
      title: req.params.articleTitle
    }, {
      $set: req.body //whichever fields the user updates
    }, function(err) {
      if (!err) {
        res.send("Successfully updated article!");
      } else {
        res.send(err);
      }
    });
  })

  //---------------- delete a specific document----------------------------//
  // use findOneAndDelete() from mongoose
  .delete(function(req, res) {
    Article.findOneAndDelete({
      title: req.params.articleTitle
    }, function(err, result) {
      if (!err) {
        if (result) {
          res.send("Successfully deleted article!");
        } else {
          res.send("No matching article found");
        }

      } else {
        res.send(err);
      }

    });
  });



//---------- server starter code --------//
app.listen(3000, function() {
  console.log("Server started on port 3000");
});

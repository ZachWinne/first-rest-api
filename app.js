const express = require('express');
const app = express();
app.use(express.static("public"));

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded( {extended: true} ));

const ejs = require('ejs');
app.set('view engine', 'ejs');

require("dotenv").config();


const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/wikiDB');

const articleSchema = new mongoose.Schema({
  title: String,
  content: String
});

const Article = mongoose.model('Article', articleSchema);


app.route('/articles')
  .get( (req, res) => {
    Article.find( {} )
    .then( (foundArticles) => {
      res.send(foundArticles);
    })
    .catch( (err) => {
      res.send(err);
    });
  })

  .post( (req, res) => {
    const newArticle = new Article({
      title: req.query.title,
      content: req.query.content
    });
    newArticle.save()
    .then( () => {
      res.send('Successfully added new article');
    })
    .catch( (err) => {
      res.send(err);
    });
  })

  .delete( (req, res) => {
    Article.deleteMany( {} )
    .then( () => {
      res.send('Successfully deleted all articles');
    })
    .catch( (err) => {
      res.send(err);
    });
  })


app.route('/articles/:articleTitle')
  .get( (req, res) => {
    Article.findOne( {title: req.params.articleTitle} )
    .then( (foundArticle) => {
      if (foundArticle) {
        res.send(foundArticle);
      }
      else {
        res.send('No articles found with title matching: ' + req.params.articleTitle);
      };
    })
    .catch ( (err) => {
      res.send(err);
    });
  })

  .put( (req, res) => {
    Article.findOneAndReplace( 
      {title: req.params.articleTitle},                   // query
      {title: req.body.title, content: req.body.content}, // replace
      {overwrite: true}                                   // options
    )
    .then( (foundArticle) => {
      res.send('Successfully replaced article: ' + foundArticle.title);
    })
    .catch( (err) => {
      res.send(err);
    })
  })

  .patch( (req, res) => {
    Article.updateOne( 
      {title: req.params.articleTitle}, // query
      {$set: req.body}                  // update
    )
    .then( () => {
      res.send('Successfully patched article: ' + req.params.articleTitle);
    })
    .catch( (err) => {
      res.send(err);
    });
  })

  .delete( (req, res) => {
    Article.findOneAndDelete({title: req.params.articleTitle})
    .then( (foundArticle) => {
      res.send('Successfully deleted article: ' + foundArticle.title);
    })
    .catch( (err) => {
      res.send(err);
    });
  });


app.listen(process.env.PORT || 3000, () => {
  console.log("Server is running on " + (process.env.PORT || 3000 + "..."));
}); 

// create web server
const express = require('express');
const app = express();
// load mongoose
const mongoose = require('mongoose');
// connect to db
mongoose.connect('mongodb://localhost/quotes', { useNewUrlParser: true });
// allow for use of static files
app.use(express.static(__dirname + '/static'));
// allow for use of post data
app.use(express.urlencoded({ extended: true }));
// set up ejs and views folder
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
// create schema
const CommentSchema = new mongoose.Schema({
    name: { type: String, required: [true, 'Must enter a name!'] },
    comment: { type: String, required: [true, 'Must enter a comment!'] },
    created_at: { type: Date, default: Date.now },
});
const MessageSchema = new mongoose.Schema({
    name: { type: String, required: [true, 'Must enter a name!'] },
    message: { type: String, required: [true, 'Must enter a message!'] },
    created_at: { type: Date, default: Date.now },
    comments: [CommentSchema]
});
// create model
const Comment = mongoose.model('Comment', CommentSchema);
const Message = mongoose.model('Message', MessageSchema);
// root route
app.get('/', (req, res) => {
    Message.find()
        .then(data => res.render('index', { messages: data }))
        .catch(err => res.json(err));
});
// create message route
app.post('/message', (req, res) => {
    const message = new Message(req.body);
    message.save()
        .then(() => res.redirect('/'))
        .catch(err => res.json(err));
});
// create comment route
app.post('/comment/:id', (req, res) => {
    Comment.create(req.body)
        .then(comment => {
            Message.findOneAndUpdate({ _id: req.params.id }, { $push: { comments: comment } })
                .then(() => res.redirect('/'))
                .catch(err => res.json(err));
        })
        .catch(err => res.json(err));
});
// listen on port 8000
app.listen(8000, () => console.log("listening on port 8000"));
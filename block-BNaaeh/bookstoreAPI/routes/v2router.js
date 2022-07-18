let express = require('express');
const Book = require('../models/book');
let router = express.Router();
let Comment = require('../models/comment');

router.get('/api/:id/edit', (req, res, next) => {
    let id = req.params.id;
    Comment.findById(id, (err, comment) => {
        if(err) return next(err);
        res.render("updateComment", {comment});
    })
});

router.post('/api/:id', (req, res, next) => {
    let id = req.params.id;
    Comment.findByIdAndUpdate(id, req.body, (err, updatedComment) => {
        if(err) return next(err);
        res.redirect('/books/' + updatedComment.bookId);
    })
});

router.get("/api/:id/delete", (req, res, next) => {
    let id = req.params.id;
    Comment.findByIdAndDelete(id, (err, comment) => {
        if(err) return next(err);
        Book.findByIdAndUpdate(comment.bookId, {$pull: {comments: comment._id}},(err, updatedBook) => {
            if(err) return next(err);
            res.redirect('/books/' + comment.bookId);
        })
    })
})

module.exports = router;
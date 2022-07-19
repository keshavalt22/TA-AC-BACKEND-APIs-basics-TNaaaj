var express = require('express');
var router = express.Router();
var Book = require('../models/Book');
var Comment = require('../models/Comment');

// Updating A Comment
router.put('/updateComment/:commentId', (req, res, next) => {
  const commentId = req.params.commentId;
  const data = req.body;
  Comment.findByIdAndUpdate(commentId, data, (err, comment) => {
    if (err) return next(err);
    Book.findById(comment.bookId, (err, book) => {
      if (err) return next(err);
      res.status(200).json({ book });
    });
  });
});

// Deleting A  Comment
router.delete('/deleteComment/:commentId', (req, res, next) => {
  const commentId = req.params.commentId;
  Comment.findByIdAndDelete(commentId, (err, comment) => {
    if (err) return next(err);
    Book.findByIdAndUpdate(
      comment.bookId,
      { comments: { $pull: comment._id } },
      (err, book) => {
        if (err) return next(err);
        res.status(200).json({ book });
      }
    );
  });
});

module.exports = router;
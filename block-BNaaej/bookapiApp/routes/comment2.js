var express = require('express');
var router = express.Router();
var V3Book = require('../models/Book3');
var V3Comment = require('../models/Comment3');

// Updating A Comment
router.put('/updateComment/:commentId', (req, res, next) => {
  const commentId = req.params.commentId;
  const data = req.body;
  V3Comment.findByIdAndUpdate(commentId, data, (err, comment) => {
    if (err) return next(err);
    V3Book.findById(comment.bookId, (err, book) => {
      if (err) return next(err);
      res.status(200).json({ book });
    });
  });
});

// Deleting A  Comment
router.delete('/deleteComment/:commentId', (req, res, next) => {
  const commentId = req.params.commentId;
  V3Comment.findByIdAndDelete(commentId, (err, comment) => {
    if (err) return next(err);
    V3Book.findByIdAndUpdate(
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
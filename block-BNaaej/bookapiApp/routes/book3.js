var express = require('express');
var router = express.Router();
var Book = require('../models/Book');
var Comment = require('../models/Comment');

// Get all books
router.get('/', (req, res, next) => {
  Book.find({}, (err, books) => {
    if (err) return next(err);
    res.status(200).json({ books });
  });
});

// Get single book
router.get('/:bookId', (req, res, next) => {
  const bookId = req.params.bookId;
  Book.findById(bookId, (err, book) => {
    if (err) return next(err);
    res.status(200).json({ book });
  });
});

// Create a book
router.post('/', (req, res, next) => {
  const data = req.body;
  Book.create(data, (err, book) => {
    if (err) return next(err);
    res.status(200).json({ book });
  });
});

// Update a book
router.put('/:bookId', (req, res, next) => {
  const bookId = req.params.bookId;
  const data = req.body;
  Book.findByIdAndUpdate(bookId, data, (err, book) => {
    if (err) return next(err);
    res.status(200).json({ book });
  });
});

// Delete a book
router.delete('/:bookId', (req, res, next) => {
  const bookId = req.params.bookId;
  Book.findByIdAndDelete(bookId, (err, book) => {
    if (err) return next(err);
    res.status(200).json({ book });
  });
});

// Adding A  Comment
router.post('/addComment/:bookId', (req, res, next) => {
  const bookId = req.params.bookId;
  const data = req.body;
  data.bookId = bookId;
  Comment.create(data, (err, comment) => {
    if (err) return next(err);
    Book.findByIdAndUpdate(
      bookId,
      { comments: { $push: comment._id } },
      (err, book) => {
        if (err) return next(err);
        res.status(200).json({ book });
      }
    );
  });
});

// Doubt
// Listing Comments of A Book
router.get('/commentList/:bookId', (req, res, next) => {
  const bookId = req.params.bookId;
  var commentsArray = [];
  Book.aggregate(
    [
      { $match: { id: bookId } },
      {
        $project: {
          comments: '$comments',
        },
      },
    ],
    (err, comments) => {
      if (err) return next(err);
      comments.forEach((elem) => {
        Comment.findById(elem, (err, comment) => {
          if (err) return next(err);
          commentsArray.push(comment);
        });
      });
      res.status(200).json({ commentsArray });
    }
  );
});

// Adding Category To Book
router.put('/addCategory/:bookId', (req, res, next) => {
  const bookId = req.params.bookId;
  const category = req.body.category;
  Book.findByIdAndUpdate(
    bookId,
    { categories: { $push: category } },
    (err, book) => {
      if (err) return next(err);
      res.status(200).json({ book });
    }
  );
});

// Deleting Category From Book
router.put('/deleteCategory/:bookId', (req, res, next) => {
  const bookId = req.params.bookId;
  const category = req.body.category;
  Book.findByIdAndUpdate(
    bookId,
    { categories: { $pull: category } },
    (err, book) => {
      if (err) return next(err);
      res.status(200).json({ book });
    }
  );
});

// Editing Category From Book
router.put('/editCategory/:bookId', (req, res, next) => {
  const bookId = req.params.bookId;
  const categoryToRemove = req.body.categoryToRemove;
  const categoryToAdd = req.body.categoryToAdd;
  Book.findByIdAndUpdate(
    bookId,
    { categories: { $pull: categoryToRemove, $push: categoryToAdd } },
    (err, book) => {
      if (err) return next(err);
      res.status(200).json({ book });
    }
  );
});

// List all categories
router.get('/allCategory', (req, res, next) => {
  Book.distinct('categories', (err, categories) => {
    if (err) return next(err);
    res.status(200).json({ categories });
  });
});

// List all Books by categories
router.get('/booksByCategories/:category', (req, res, next) => {
  const category = req.params.category;
  Book.find({ categories: { $in: [category] } }, (err, books) => {
    if (err) return next(err);
    res.status(200).json({ books });
  });
});

// List all Books by author
router.get('/booksByAuthor/:author', (req, res, next) => {
  const author = req.params.author;
  Book.find({ author: author }, (err, books) => {
    if (err) return next(err);
    res.status(200).json({ books });
  });
});

// Count all Books by categories
router.get('/countBooksByCategories/:category', (req, res, next) => {
  const category = req.params.category;
  Book.aggregate(
    [
      { categories: { $in: [category] } },
      { $group: { _id: null, count: { $sum: 1 } } },
    ],
    (err, count) => {
      if (err) return next(err);
      res.status(200).json({ count });
    }
  );
});

// Adding Tags To Book
router.put('/addTag/:bookId', (req, res, next) => {
  const bookId = req.params.bookId;
  const tag = req.body.tag;
  Book.findByIdAndUpdate(bookId, { tags: { $push: tag } }, (err, book) => {
    if (err) return next(err);
    res.status(200).json({ book });
  });
});

// Filter Books by Tags
router.get('/booksByTag/:tag', (req, res, next) => {
  const tag = req.params.tag;
  Book.find({ tags: { $in: [tag] } }, (err, books) => {
    if (err) return next(err);
    res.status(200).json({ books });
  });
});

// List all tags
router.get('/allTags', (req, res, next) => {
  Book.distinct('tags', (err, tags) => {
    if (err) return next(err);
    res.status(200).json({ tags });
  });
});

// List all tags in ascending
router.get('/allTagsInDesc', (req, res, next) => {
  const tags = Book.distinct('tags').aggregate([{ index: 1 }]);
  res.status(200).json({ tags });
});

// List all tags in descending
router.get('/allTagsInDesc', (req, res, next) => {
  const tags = Book.distinct('tags').aggregate([{ index: -1 }]);
  res.status(200).json({ tags });
});

// Count all Books by Tags
router.get('/countBooksByTag/:tag', (req, res, next) => {
  const tag = req.params.tag;
  Book.aggregate(
    [{ tags: { $in: [tag] } }, { $group: { _id: null, count: { $sum: 1 } } }],
    (err, count) => {
      if (err) return next(err);
      res.status(200).json({ count });
    }
  );
});

module.exports = router;
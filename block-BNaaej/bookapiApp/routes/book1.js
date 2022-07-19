var express = require('express');
var router = express.Router();
var Book = require('../models/Book');

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

module.exports = router;
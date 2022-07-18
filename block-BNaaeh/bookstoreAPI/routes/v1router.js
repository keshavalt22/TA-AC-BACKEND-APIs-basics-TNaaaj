let express = require('express');
let router = express.Router();
let Book = require ('../models/book');
let Comment = require('../models/comment');

router.get("/api/books", (req, res, next) => {
    Book.find({}, (err, books) => {
        if(err) return next(err);
        res.json('books', {books: books});
    })
});

router.get("/api/new", (req, res) => {
    res.json('addBook')
});

router.post('/api/', (req, res, next) => {
    //save to database
    Book.create(req.body, (err, createdBook) => {
        if(err) return next(err);
        res.json('/books');
    })
})


router.get('/api/:id', (req, res, next) => {
    let id = req.params.id;
    Book.findById(id).populate('comments').exec((err, book) => {
        if(err) return next(err);
        res.json('bookDetails', { book: book });
    }) 
})

router.get("/api/:id/edit", (req, res, next) => {
    let id = req.params.id;
    Book.findById(id, (err, book) => {
        if(err) return next(err);
        res.json('editbookForm', {book: book});
    })
})

router.post("/api/:id", (req, res, next) => {
    let id = req.params.id;
    Book.findByIdAndUpdate(id, req.body, (err, updatedBook) => {
        if(err) return next(err);
        res.json('/books/' + id);
    })
})

router.get("/api/:id/delete", (req, res, next) => {
    let id = req.params.id;
    Book.findByIdAndDelete(id, (err, book) => {
        if(err) return next(err);
        Comment.deleteMany({bookId: book._id}, (err, info) => {
            if(err) return next(err);
            res.json("/books");
        })
    })
})

module.exports = router;
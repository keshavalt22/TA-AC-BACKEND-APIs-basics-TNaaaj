let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let commentSchema = new Schema(
  {
    comment: { type: String, required: true },
    author: { type: String },
    bookId: {type: mongoose.Schema.Types.ObjectId,ref: 'Book', required: true},
  },
  { timestamps: true }
);

module.exports = mongoose.model('Comment', commentSchema);
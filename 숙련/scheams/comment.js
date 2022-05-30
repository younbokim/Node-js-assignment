const mongoose = require('mongoose');

const CommentsSchema = new mongoose.Schema({
    postId: Number,
    commentsId: {
        type: Number,
        unique: true,
    },
    nickname: String,
    comment: String,
    Date: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Comments', CommentsSchema);

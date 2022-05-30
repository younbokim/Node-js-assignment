const mongoose = require('mongoose');

const blogpostsSchema = new mongoose.Schema({
    // 게시글 제목
    title: {
        type: String,
        required: true,
    },

    // 포스트 아이디
    postId: {
        type: Number,
        required: true,
        unique: true,
    },

    //작성자명
    nickname: {
        type: String,
    },

    // 작성글
    comments: {
        type: String,
    },

    // 작성일자
    Date: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Blogposts', blogpostsSchema);

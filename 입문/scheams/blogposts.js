const mongoose = require('mongoose');

const blogpostsSchema = new mongoose.Schema({
    // 게시글 제목
    title: {
        type: String,
        required: true,
        unique: true,
    },

    //작성자명
    blogname: {
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

    // 비밀번호
    password: {
        type: Number,
    },

    // 작성글 번호
    order: {
        type: Number,
    },
});

module.exports = mongoose.model('Blogposts', blogpostsSchema);

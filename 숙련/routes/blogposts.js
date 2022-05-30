const express = require('express');
const User = require('../scheams/user');
const Comments = require('../scheams/comment');
const jwt = require('jsonwebtoken');
const Blogposts = require('../scheams/blogposts');
const authMiddleware = require('../middlewares/auth-Middleware');
const router = express.Router();

// 게시물 전체 조회
router.get('/', async (req, res) => {
    const { nickname } = req.query;

    const blogposts = await Blogposts.find({ nickname }, { _id: 0, __v: 0, password: 0, comments: 0 });

    // 내림차순으로 데이터 정렬
    res.json({
        blogposts: blogposts.sort((a, b) => b['Date'] - a['Date']),
    });
});

// 게시글 작성 api
router.post('/blogpost', async (req, res) => {
    const { nickname, title, comments } = req.body;

    // const blogposts = await Blogposts.find({ postId });

    const maxPostsId = await Blogposts.findOne().sort('-postId').exec();
    let postId = 1;

    if (maxPostsId) {
        postId = maxPostsId.postId + 1;
    }

    // if (blogposts.length) {
    //     return res.status(400).json({ success: false, errorMessage: '이미 있는 게시 글 입니다.' });
    // }

    const creatBlogposts = await Blogposts.create({ nickname, title, comments, postId });
    res.send({ blogposts: creatBlogposts });
});

// 게시글 조회/댓글 조회 api
router.get('/blogpost/:postId', async (req, res) => {
    const { postId } = req.params;

    // 게시글 조회
    const blogposts = await Blogposts.find({ postId }, { _id: 0, password: 0, __v: 0 });

    //댓글 전체조회
    const comments = await Comments.find({ postId: Number(postId) }, { _id: 0, __v: 0, postId: 0 }).sort({
        Date: -1,
    });

    res.json({
        blogposts,
        comments,
    });
});

// 게시물 수정 api
router.put('/blogpost/:postId', authMiddleware, async (req, res) => {
    const { postId } = req.params;
    const { title, password, comments } = req.body;

    const blogposts = await Blogposts.findOne({ postId: Number(postId) });
    if (!blogposts) {
        return res.status(400).json({ success: false, errorMessage: ' 존재 하지 않는 게시물 입니다.' });
    }

    const Userpw = await User.find({ password });
    // if(postpw[ password ] != password)
    // if (Number(password) != Number(blogposts[0].password))
    if (Userpw[0].password != password) {
        return res.status(400).json({ success: false, errorMessage: ' 비밀번호가 일치하지 않습니다.' });
    }

    await Blogposts.updateOne({ postId: Number(postId) }, { $set: { comments, title } });

    res.json({ success: true });
});

// 게시물 삭제 api
router.delete('/blogpost/:postId', authMiddleware, async (req, res) => {
    const { postId } = req.params;
    const { password } = req.body;

    const blogposts = await Blogposts.findOne({ postId: Number(postId) });
    if (!blogposts) {
        return res.status(400).json({ success: false, errorMessage: ' 존재 하지 않는 게시물 입니다.' });
    }

    const Userpw = await User.findOne({ password });
    if (Userpw['password'] != password) {
        return res.status(400).json({ success: false, errorMessage: ' 비밀번호가 일치하지 않습니다.' });
    }
    await Blogposts.deleteOne({ postId });
    res.json({ success: true });
});

module.exports = router;

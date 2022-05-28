const express = require('express');
const Blogposts = require('../scheams/blogposts');
const router = express.Router();

// 게시물 전체 조회

router.get('/', async (req, res) => {
    const { blogname } = req.query;

    const blogposts = await Blogposts.find({ blogname }, { _id: 0, __v: 0, password: 0, comments: 0 });

    // 내림차순으로 데이터 정렬
    res.json({
        blogposts: blogposts.sort((a, b) => b['Date'] - a['Date']),
    });
});

// 게시물 작성 api

router.post('/blogpost', async (req, res) => {
    const { blogname, title, password, comments } = req.body;

    const blogposts = await Blogposts.find({ title });
    if (blogposts.length) {
        return res.status(400).json({ success: false, errorMessage: '이미 있는 게시 글 입니다.' });
    }

    const creatBlogposts = await Blogposts.create({ blogname, title, password, comments });

    res.send({ blogposts: creatBlogposts });
});

// 게시물 조회 api
router.get('/blogpost', async (req, res) => {
    const { title } = req.query;

    const blogposts = await Blogposts.find({ title }, { _id: 0, password: 0, __v: 0 });

    res.json({
        blogposts,
    });
});

// 게시물 수정 api
router.put('/blogpost', async (req, res) => {
    const { title, password, comments } = req.body;

    const blogposts = await Blogposts.find({ title });
    if (!blogposts.length) {
        return res.status(400).json({ success: false, errorMessage: ' 존재 하지 않는 게시물 입니다.' });
    }

    // const postpw = await Blogposts.find({ title });
    // if(postpw[ password ] != password)

    if (Number(password) != Number(blogposts[0].password)) {
        return res.status(400).json({ success: false, errorMessage: ' 비밀번호가 일치하지 않습니다.' });
    }

    await Blogposts.updateOne({ title: title }, { $set: { comments } });

    res.json({ success: true });
});

// 게시물 삭제 api
router.delete('/blogpost', async (req, res) => {
    const { title, password } = req.body;

    const blogposts = await Blogposts.find({ title });
    if (!blogposts.length) {
        return res.status(400).json({ success: false, errorMessage: ' 존재 하지 않는 게시물 입니다.' });
    }

    if (Number(password) != Number(blogposts[0].password)) {
        return res.status(400).json({ success: false, errorMessage: ' 비밀번호가 일치하지 않습니다.' });
    }
    await Blogposts.deleteOne({ password });
    res.json({ success: true });
});

// 댓글 목록 전체 조회 api

// 댓글 작성 api

// 댓글 수정 api

// 댓글 삭제 api

module.exports = router;

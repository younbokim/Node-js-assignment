const express = require('express');
const User = require('../scheams/user');
const jwt = require('jsonwebtoken');
const Blogposts = require('../scheams/blogposts');
const authMiddleware = require('../middlewares/auth-Middleware');
const router = express.Router();

// 회원가입 구현 api
router.post('/users', async (req, res) => {
    const { nickname, email, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
        res.status(400).send({
            errorMessage: '패스워드가 일치하지 않습니다!',
        });
        return;
    }

    const existUsers = await User.find({
        $or: [{ email }, { nickname }],
    });
    if (existUsers.length) {
        res.status(400).send({
            errorMessage: '이미 가입된 이메일 또는 닉네임이 있습니다.',
        });
        return;
    }
    const user = new User({ email, nickname, password });
    await user.save();

    res.status(201).send({});
});

// 로그인 구현 api
router.post('/auth', async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email, password }).exec();

    if (!user) {
        res.status(400).send({
            errorMessage: '이메일 또는 패스워드가 잘못되었습니다.',
        });
        return;
    }

    const token = jwt.sign({ userId: user.userId }, 'secret-key');

    res.send({
        token,
    });
});

// 사용자 정보 구현 api
router.get('/users/me', authMiddleware, async (req, res) => {
    const { user } = res.locals;

    res.send({
        user,
        // user: {
        //     email: user.email,
        //     nickname: user.nickname,
        // },
    });
});

// 게시물 전체 조회
router.get('/', async (req, res) => {
    const { blogname } = req.query;

    const blogposts = await Blogposts.find({ blogname }, { _id: 0, __v: 0, password: 0, comments: 0 });

    // 내림차순으로 데이터 정렬
    res.json({
        blogposts: blogposts.sort((a, b) => b['Date'] - a['Date']),
    });
});

// 게시글 작성 api
router.post('/blogpost', async (req, res) => {
    const { blogname, title, password, comments } = req.body;

    const blogposts = await Blogposts.find({ title });
    if (blogposts.length) {
        return res.status(400).json({ success: false, errorMessage: '이미 있는 게시 글 입니다.' });
    }

    const creatBlogposts = await Blogposts.create({ blogname, title, password, comments });

    res.send({ blogposts: creatBlogposts });
});

// 게시글 조회 api
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
router.get('/blogpost/comment', (req, res) => {
    const { comments } = req.boby;
});
// 댓글 작성 api

// 댓글 수정 api

// 댓글 삭제 api

module.exports = router;

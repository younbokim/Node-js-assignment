const express = require('express');
const User = require('../scheams/user');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const authMiddleware = require('../middlewares/auth-Middleware');
const router = express.Router();

// 회원가입 joi
const postUsersSchema = Joi.object({
    nickname: Joi.string()
        .min(3)
        .pattern(new RegExp(/^[a-z|A-Z|0-9]+$/))
        .required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(4).required(),
    confirmPassword: Joi.string().required(),
});

// 회원가입 구현 api
router.post('/users', async (req, res) => {
    // 로그인 유무확인
    if (req.headers.authorization) {
        const { authorization } = req.headers;
        if (authorization.split(' ')) {
            res.status(400).send({
                errorMessage: '이미 로그인 되어있습니다.',
            });
            return;
        }
    }

    try {
        const { nickname, email, password, confirmPassword } = await postUsersSchema.validateAsync(req.body);

        if (password !== confirmPassword) {
            res.status(400).send({
                errorMessage: '패스워드가 일치하지 않습니다!',
            });
            return;
        }

        // const existUsers = await User.find({
        //     $or: [{ email }, { nickname }],
        // });
        const nameCheck = await User.find({ nickname: nickname });
        if (nameCheck.length) {
            res.status(400).send({
                errorMessage: '이미 가입된 닉네임이 있습니다.',
            });
            return;
        }
        if (nickname === password) {
            res.status(400).send({
                errorMessage: '닉네임 또는 패스워드를 확인해주세요.',
            });
            return;
        }
        const user = new User({ email, nickname, password });
        await user.save();

        res.status(201).send({});
    } catch (err) {
        console.log(err);
        res.status(400).send({
            errorMessage: '요청한 형식이 올바르지 않습니다.',
        });
    }
});

// 로그인 joi
const postAuthScheam = Joi.object({
    nickname: Joi.string().required(),
    password: Joi.string().required(),
});

// 로그인 구현 api
router.post('/auth', async (req, res) => {
    // 로그인 유무확인
    if (req.headers.authorization) {
        const { authorization } = req.headers;
        if (authorization.split(' ')) {
            res.status(400).send({
                errorMessage: '이미 로그인 되어있습니다.',
            });
            return;
        }
    }
    try {
        const { nickname, password } = await postAuthScheam.validateAsync(req.body);

        const user = await User.findOne({ nickname, password }).exec();

        if (!user) {
            res.status(400).send({
                errorMessage: '닉네임 또는 패스워드가 잘못되었습니다.',
            });
            return;
        }

        const token = jwt.sign({ userId: user.userId }, 'secret-key');

        res.send({
            token,
        });
    } catch (err) {
        console.log(err);
        res.status(400).send({
            errorMessage: '요청한 형식이 올바르지 않습니다.',
        });
    }
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

module.exports = router;

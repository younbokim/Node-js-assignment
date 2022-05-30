const express = require('express');
const User = require('../scheams/user');
const Comments = require('../scheams/comment');
const authMiddleware = require('../middlewares/auth-Middleware');
const router = express.Router();

// 댓글 작성 api
router.post('/blogpost/:postId', async (req, res) => {
    const { postId } = req.params;
    const { nickname, comment } = req.body;

    if (!req.headers.authorization) {
        res.status(400).send({
            ereorMessage: '로그인 기능이 필요합니다.',
        });
        return;
    } else {
        if (comment === '') {
            res.status(400).send({
                ereorMessage: '댓글을 입력해 주세요!',
            });
            return;
        }

        const maxcommentsId = await Comments.findOne().sort('-commentsId').exec();
        let commentsId = 1;

        if (maxcommentsId) {
            commentsId = maxcommentsId.commentsId + 1;
        }

        const creatComments = await Comments.create({ postId, nickname, comment, commentsId });
        res.send({ comment: creatComments });
    }
});
// 댓글 수정 api
router.put('/blogpost/:postId/:commentsId', authMiddleware, async (req, res) => {
    const { nickname } = res.locals.user;
    const { commentsId } = req.params;
    const { comment } = req.body;

    const comments = await Comments.findOne({ commentsId: Number(commentsId) });

    if (!comments) {
        return res.status(400).json({ success: false, ereorMessage: '존재 하지 않는 댓글' });
    } else if (comments['nickname'] !== nickname) {
        return res.status(400).send({ ereorMessage: '사용자가 쓴 댓글이 아닙니다.' });
    }
    await Comments.updateOne({ commentsId: Number(commentsId) }, { $set: { comment } });
    res.json({ success: true });
});

// 댓글 삭제 api
router.delete('/blogpost/:postId/:commentsId', authMiddleware, async (req, res) => {
    const { nickname } = res.locals.user;
    const { commentsId } = req.params;

    const comments = await Comments.findOne({ commentsId: Number(commentsId) });
    if (!comments) {
        return res.status(400).json({ success: false, ereorMessage: '존재 하지 않는 댓글' });
    } else if (comments['nickname'] !== nickname) {
        return res.status(400).send({ ereorMessage: '사용자가 쓴 댓글이 아닙니다.' });
    }

    await Comments.deleteOne({ commentsId });
    res.send({ success: true });
});

module.exports = router;

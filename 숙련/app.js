const express = require('express');
const connect = require('./scheams');
const app = express();
const port = 9000;

connect();

const blogpostsRouter = require('./routes/blogposts');
const userRouter = require('./routes/user');
const commentRouter = require('./routes/comment');

app.use(express.urlencoded());
app.use(express.json());

app.use('/api', [blogpostsRouter, commentRouter, userRouter]);

app.listen(port, () => {
    console.log(port, '포트로 서버가 켜졌어요!');
});

const express = require("express");
const Blogposts = require("../scheams/blogposts");
const router = express.Router();



// 게시물 전체 조회

router.get("/", async (req, res) => {

    const blogposts = await Blogposts.find({ blogname }, {_id: 0, __v:0, password : 0, comments : 0});

    // 내림차순으로 데이터 정렬
    res.json({
        blogposts: blogposts.sort((a, b) => b["Date"] - a["Date"])
    })

});

// 게시글 작성 api

router.post("/blogpost", async (req, res) => {
    const { blogname, title, password, comments } = req.body;
        
    const blogposts = await Blogposts.find({ title });
    if(blogposts.length){
        return res.status(400).json({ success: false, errorMessage: "이미 있는 게시 글 입니다." });
    }


    const creatBlogposts = await Blogposts.create({ blogname, title, password, comments });

    res.send("작성글 업로드!");
});


// 게시글 조회 api
router.get("/blogpost", async (req, res)=>{
    const { title } = req.query;

    const blogposts = await Blogposts.find({ title }, {_id: 0, password: 0, __v: 0 });

    res.json({
        blogposts
    });

});


// 게시물 수정 api
router.put("/blogpost", async (req, res)=>{
    const { title, password, comments } = req.body;


    const blogposts = await Blogposts.find({ title });
    if(!blogposts.length){
        return res.status(400).json({ success: false, errorMessage: " 존재 하지 않는 게시물 입니다." });
    }

    // const postpw = await Blogposts.find({ title }); 
    // if(postpw[ password ] != password)

    if(Number(password) != Number(blogposts[0].password)){
        return res.status(400).json({ success: false, errorMessage: " 비밀번호가 일치하지 않습니다." });
    }

    await Blogposts.updateOne({title: title}, {$set : {comments}});

    res.json({success: true});

});


// 게시물 삭제 api
router.delete('/blogpost', async (req, res) => {
    const { password } = req.body;
    const dataPassword = (await Blogposts.find({})).filter(
      (a) => a.password === password
    );
    if (!dataPassword.length) {
      return res
        .status(400)
        .json({ success: false, errorMessage: '비밀번호를 확인해주세요' });
    }
    await Blogposts.deleteOne({ password });
    res.json({ success: true });
  });

module.exports = router;
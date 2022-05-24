const express = require("express");
const connect = require("./scheams");
const app = express();
const port = 5000;


connect();


const blogpostsRouter = require("./routes/blogposts");


app.use(express.json());
app.use(express.urlencoded());

app.use("/api", [blogpostsRouter]);



app.get("/", (req,res,) => {
    res.send("Hello World");
});

app.listen(port, () =>{
    console.log(port, "포트로 서버가 켜졌어요!");
});



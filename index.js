const express = require("express");
const app = express();

var port = process.env.PORT || 3000;


app.get("/",(req, resp)=>{
    resp.end("HI welcome to my heroku.");
})

app.listen(port,(err)=>{
    if(err){
        console.log(err);
        return false;
    }
    
    console.log("port os running");
})
//jshint esversion:6

require('dotenv').config();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const md5 = require("md5");
// const encrypt = require('mongoose-encryption');

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/userDB", {  useUnifiedTopology: true,
  useNewUrlParser: true});

  const userSchema = new mongoose.Schema( {
    email: String,
    password : String
  });

//   const secret = process.env.SECRET;
// userSchema.plugin(encrypt, { secret: secret,encryptedFields: ["password"] });


  const User = mongoose.model("User", userSchema);








app.get("/", function(req,res){
  res.render("home")
})

app.get("/login", function(req,res){
  res.render("login")
})
app.post("/login",function(req,res){
  const loginUserName = req.body.username;
  const loginUserPassword =md5(req.body.password);
  User.findOne({email :loginUserName} , function(err, foundList){


    if(!foundList){
        res.render("failure")
    }
    else{
      if(foundList.password ===loginUserPassword){
        res.render("secrets");
      }
      else{
        res.render("passwordWrong");
      }

    }
  })
})
app.get("/register", function(req,res){
  res.render("register")
})
app.post("/register",function(req,res){
  const userName = req.body.username;
  const userPassword = req.body.password;

  const newUser = new User({
    email: userName,
    password: md5(userPassword)
  });
  newUser.save(function(err){
    if(err){
      console.log(err);
    }
    else{
      res.render("secrets");
    }
  });

})
app.post("/failure",function(req,res){
  res.redirect("/");
})


app.listen(3000, function() {
  console.log("Server started on port 3000");
});

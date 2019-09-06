const express = require("express");
const router = express.Router();
const userData = require("../data/users");
const xss = require('xss');


router.get("/", async(req,res) => {
    res.render("pages/register");
});

router.post("/", async(req,res) =>{
    
    //console.log(req.body);
    let RegisterData = xss(req.body);
    var username = xss(req.body.username);
    var password = xss(req.body.password);
    var name = xss(req.body.fullname);
    var gender = xss(req.body.gender);
    var email = xss(req.body.email);
    var birth = xss(req.body.date);
    var phone = xss(req.body.phone);
    let errors = [];
    const error_msg = 'Registration unsuccessful';
    //check status
    if (!username) {
        errors.push("No username provided!");
        res.status(400);
      }
      if (!password) {
        errors.push("No password provided!");
        res.status(400);
      }
      if (!name) {
        errors.push("No name provided!");
        res.status(400);
      }
      let user=await userData.findExistingUser(username);
    if(user)
    {
     console.log("username matched");   
     errors.push("Username already exists. Try another user name! ");
     res.status(400);
    }
    else{
        console.log("same username not found");
    }
  if (errors.length > 0) {
    res.render("pages/register", {
      errors: errors,
      hasErrors: true
    });
    return;
  }

    try{
                                                
        userCreated = await userData.createUser(username, password, name, gender, birth, email, phone);
    }catch(err){
        console.log(err);
    }

    if(userCreated.username === username){
        res.cookie('AuthCookie', userCreated._id, { maxAge: 3600000 }); //set cookie for unique username
        res.redirect('/search');
        
    }
    else{     
        res.render('pages/register', {
            errors: error_msg,
            hasErrors: true
        });
    }
});


module.exports = router;
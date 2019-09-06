const express = require('express');
const router = express.Router();
const data = require('../data');
const users = data.users;
const xss = require('xss');


router.get('/', async(req,res)=>{
    res.render("pages/login");
});

router.post('/', async(req,res)=>{
    
    const currentusername = xss(req.body.username);
    const currentpassword = xss(req.body.password);
    const error_msg = 'Invalid username or passsword';
    if(!currentusername || typeof currentusername !== "string")
    {
        res.render('pages/login', {error_msg:error_msg});
        return;
    }
    
    const validatedData = await users.checkstatus(currentusername, currentpassword);
    if(validatedData.status===true){
      
        res.cookie('AuthCookie', validatedData.userid, { maxAge: 3600000 }); 
       

        res.redirect('/search');
    }
    else if(validatedData.status === false){
        res.render('pages/login', {error_msg: error_msg});
    }

});


module.exports = router;
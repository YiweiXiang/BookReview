const express = require("express");
const router = express.Router();
const xss = require('xss');



router.get("/", (req, res) => {
  //console.log("in search.js get");
  if(xss(req.cookies.AuthCookie))
  {
    res.render("pages/search");
  }
  else
  {
    res.redirect("/login");
  }
});

module.exports = router;

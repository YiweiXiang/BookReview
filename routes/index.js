const registerRoutes = require("./register");
const loginRoutes = require("./login");
const bookinfoRoutes = require("./bookinfo");
const searchRoutes = require("./search");
const bookData = require("../data/books");
const  profileRoutes=require("./profile");
const constructorMethod = app => {
  app.use("/register", registerRoutes);
  app.use("/login", loginRoutes);
  app.use("/bookinfo/:bookId", bookinfoRoutes);
  app.use("/search", searchRoutes);
  app.use("/profile",profileRoutes);
  app.get('/profile', function (req, res) {
    res.render("pages/profile");
  });

  app.get('/', function (req, res) {
    res.redirect("/register");
  })

  app.get('/bookinfo/:bookId', async (req, res) => {
    console.log(req.params.bookId);
    let reviews = [];
    if (req.cookies.AuthCookie) {
      try {
        const insertInfo = await bookData.getBooksByID(req.params.bookId);
        if (insertInfo) {
          console.log("book exists");
          console.log(insertInfo.reviews);
          //reviews.push(insertInfo.reviews);
          reviews = insertInfo.reviews;
          avgRating=insertInfo.avgRating;
        }
        else {
          console.log("book DOESNOT exists");
        }
      }
      catch (e) {
        error_message = "Please dont leave empty blank";
      }
      if (reviews.length > 0) {
        res.render("pages/bookinfo",
          {
            bookId: req.params.bookId,
            reviews: reviews,
            rating:avgRating,
            hasReviews: true
          }
        );
      }
      else {
        res.render("pages/bookinfo",
          req.params);
      }
    }
    else {
      res.redirect("/login");
    }
  })
  app.get('/search', function (req, res) {
    //console.log(req.params);
    if(req.cookies.AuthCookie)
    {
      res.render("pages/search");
    }
    else
    {
      res.redirect("/login");
    }
    })

  app.get("/logout", function (req, res) {
    res.clearCookie('AuthCookie');
    res.render("pages/logout");
  });

  app.use("*", (req, res) => {
    res.status(404).json({ error: "Not found" });
  });
};

module.exports = constructorMethod;

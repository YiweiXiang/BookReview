var MongoClient = require("mongodb").MongoClient,
  settings = require("./config.js"),
  Guid = require("guid");

var fullMongoUrl =
  settings.mongoConfig.serverUrl + settings.mongoConfig.database;


  async function runSetup() {
  return MongoClient.connect(fullMongoUrl)
    .then(function(db) {
      return db
        .collection("books")
        .drop()
        .then(
          function() {
            return db;
          },
          function() {
            // We can recover from this; if it can't drop the collection, it's because
            // the collection does not exist yet!
            return db;
          }
        );
    })
    .then(function(db) {
      // We've either dropped it or it doesn't exist at all; either way, let's make
      // a new version of the collection
      return db.createCollection("books");
    })
    .then(function(bookCollection) {
      var docId = 0;

      var addbook = function(title, rating, released, author) {
        return {
          _id: ++docId,
          title: title,
          rating: rating,
          reviews: [],
          info: {
            release: released,
            author: author
          }
        };
      };

      var addReview = function(book, title, comment, reviewer, rating) {
        var newReview = {
          _id: Guid.create().toString(),
          title: title,
          comment: comment,
          reviewer: reviewer,
          rating: rating
        };

        book.reviews.push(newReview);
      };

      var listOfBooks = [];

      var inception = addbook("Inception", 4.5, 2015, "Christopher Nolan");

      addReview(
        inception,
        "Really Good",
        "This movie was so interesting.",
        "Phil",
        4.5
      );
      addReview(inception, "Bad", "This book is trite.", "Agatha", 2);
      addReview(
        inception,
        "Perfect",
        "Leo should win an Oscar for this.",
        "Definitely Not Leo",
        4
      );

      var theLastSamurai = addbook(
        "The Last Samurai",
        3.8,
        2003,
        "Edward Zwick"
      );
 

      var darkKnightRises = addbook(
        "Batman: The Dark Knight Rises",
        5,
        2012,
        "Christopher Nolan"
      );

      addReview(
        darkKnightRises,
        "Aggressively mediocre",
        "Not much to say; it was okay.",
        "Sallie",
        3
      );
      addReview(
        darkKnightRises,
        "The best of the series",
        "This movie was the epitome of the underdog tale",
        "Phil",
        5
      );

      var kingsman = addbook(
        "Kingsman: The Secret Service",
        3.2,
        2015,
        "Matthew Vaughn"
      );


      addReview(
        kingsman,
        "Unexpectedly good",
        "I really liked it!",
        "Sallie",
        4
      );
      addReview(
        kingsman,
        "New favorite movie",
        "Wow, that was really fun!",
        "Alexander",
        4.5
      );

      listOfBooks.push(inception, theLastSamurai, darkKnightRises, kingsman);

      // we can use insertMany to insert an array of documents!
      return bookCollection.insertMany(listOfBooks).then(function() {
        return bookCollection.find().toArray();
      });
    });
}

/*
async function adduser(username, password, email, phone, gender) {
    return MongoClient.connect(fullMongoUrl)
    .then(function(db) {
      return db
        .collection("usertable")
        .drop()
        .then(
          function() {
            return db;
          },
          function() {
            return db;
          }
        );
    })
    .then(function(db) {
      return db.createCollection("usertable");
    })
    .then(function(userCollection) {

    const newUser = {
        _id: uuid.v4(),
        username: username,
        password: password,
        email: email,
        phone: phone,
        gender: gender
    };
    const newInsertuser = await userCollection.insertOne(newUser);
    const newId = newInsertuser.insertedId;
    return await this.getuserById(newId);
    });
}
*/

module.exports = {
	adduser,
	runSetup
};
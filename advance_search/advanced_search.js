let MongoClient = require("mongodb").MongoClient,
  runStartup = require("./steupbooklist.js"),
  settings = require("./config.js");

let fullMongoUrl =
  settings.mongoConfig.serverUrl + settings.mongoConfig.database;

runStartup().then(function(allBooks) {
  console.log(
    "After the advanced document setup has been complete, we have the following books:"
  );
  console.log(allBooks);
});

MongoClient.connect(fullMongoUrl).then(function(db) {
  let bookCollection = db.collection("advancedBooks");


  exports.getAllBooks = function() {
    return bookCollection.find().toArray();
  };


  exports.getBook = function(id) {
    if (id === undefined) return Promise.reject("You must provide an ID");

    return bookCollection
      .find({ _id: id })
      .limit(1)
      .toArray()
      .then(function(listOfBooks) {
        if (listOfBooks.length === 0)
          throw "Could not find book with id of " + id;
        return listOfBooks[0];
      });
  };


  exports.findByBookname = function(bookName) {
    if (!bookName)
      return Promise.reject("You must provide a book name");


    return bookCollection.find({ "info.bookname": bookName }).toArray();
  };

 
  exports.findByRatings = function(potentialRatings) {
    if (!potentialRatings)
      return Promise.reject(
        "You must provide an array of potentially matching ratings"
      );


    return bookCollection
      .find({ rating: { $in: potentialRatings } })
      .toArray();
  };

  exports.findBooksReleasedBefore = function(startingYear) {
    if (startingYear === undefined)
      return Promise.reject("You must give a starting year");

    return bookCollection
      .find({ "info.release": { $lt: startingYear } })
      .toArray();
  };

  exports.findBooksReleasedOnOrBefore = function(startingYear) {
    if (startingYear === undefined)
      return Promise.reject("You must give a starting year");

    return bookCollection
      .find({ "info.release": { $lte: startingYear } })
      .toArray();
  };

  exports.findbooksReleasedAfter = function(startingYear) {
    if (startingYear === undefined)
      return Promise.reject("You must give a starting year");

    return bookCollection
      .find({ "info.release": { $gt: startingYear } })
      .toArray();
  };

  exports.findBooksReleasedOnOrAfter = function(startingYear) {
    if (startingYear === undefined)
      return Promise.reject("You must give a starting year");

    return bookCollection
      .find({ "info.release": { $gte: startingYear } })
      .toArray();
  };

  exports.findBooksWithBooknameAndYear = function(bookName, releaseYear) {
    if (!bookName)
      return Promise.reject("You must provide a book name");
    if (releaseYear === undefined)
      return Promise.reject("You must give a release year");


    return bookCollection
      .find({
        $and: [
          { "info.release": releaseYear },
          { "info.bookname": bookName }
        ]
      })
      .toArray();
  };

  exports.findBooksWithBooknameOrYear = function(bookName, releaseYear) {
    if (!bookName)
      return Promise.reject("You must provide a book name");
    if (releaseYear === undefined)
      return Promise.reject("You must give a release year");


    return bookCollection
      .find({
        $or: [
          { "info.release": releaseYear },
          { "info.bookname": bookName }
        ]
      })
      .toArray();
  };



  exports.updateTitle = function(id, newTitle) {
    if (id === undefined) return Promise.reject("No id provided");
    if (!newTitle) return Promise.reject("No title provided");

    // we use $set to update only the fields specified
    return bookCollection
      .update({ _id: id }, { $set: { title: newTitle } })
      .then(function() {
        return exports.getBook(id);
      });
  };

  exports.updateBookname = function(id, newBookname) {
    if (id === undefined) return Promise.reject("No id provided");
    if (!newBookname) return Promise.reject("No neBookname provided");

    // we use $set to update only the fields specified
    return bookCollection
      .update({ _id: id }, { $set: { "info.Bookname": newBookname } })
      .then(function() {
        return exports.getBook
        (id);
      });
  };


  exports.doubleRating = function(id) {
    if (id === undefined) return Promise.reject("No id provided");

    return bookCollection
      .update({ _id: id }, { $mul: { rating: 2 } })
      .then(function() {
        return exports.getBook(id);
      });
  };

  exports.removeRating = function(id) {
    if (id === undefined) return Promise.reject("No id provided");

    return bookCollection
      .update({ _id: id }, { $unset: { rating: "" } })
      .then(function() {
        return exports.getBook(id);
      });
  };

  exports.updateRatingToMinValue = function(id, newRating) {
    if (id === undefined) return Promise.reject("No id provided");
    if (newRating === undefined) return Promise.reject("no rating provided");

    // if the value is higher than newRating, it will change to newRating; otherwise, it
    // will stay as is
    return bookCollection
      .update({ _id: id }, { $min: { rating: newRating } })
      .then(function() {
        return exports.getBook(id);
      });
  };

  exports.updateRatingToMaxValue = function(id, newRating) {
    if (id === undefined) return Promise.reject("No id provided");
    if (newRating === undefined) return Promise.reject("no rating provided");

    // if the value is lower than newRating, it will change to newRating; otherwise, it
    // will stay as is
    return bookCollection
      .update({ _id: id }, { $max: { rating: newRating } })
      .then(function() {
        return exports.getBook(id);
      });
  };




  exports.removeReview = function(id, reviewId) {
    if (id === undefined) return Promise.reject("No id provided");
    if (!reviewId) return Promise.reject("No reviewId provided");

    return bookCollection
      .update({ _id: id }, { $pull: { reviews: { _id: reviewId } } })
      .then(function() {
        return exports.getBook(id);
      });
  };
});

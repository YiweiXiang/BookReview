const mongodb = require("mongodb");
const mongoCollections = require("../config/mongoCollections");
const books = mongoCollections.books;
const users=require("./users");
const uuid = require("uuid/v4");

async function getBooksByName(name) {
    if (!name) throw "No book name provided";
    const destCollection = await books();
    return await destCollection.find({ name: name }).toArray();
}

async function getBooksByID(bookId) {
    try {
        if (!bookId || typeof bookId !== "string") {
            throw "The id type is not fit";
        }
        let destCollection = await books();
        return await destCollection.findOne({
            Bookid: bookId
        });
    } catch (e) {
        throw e;
    }
}


async function searchBooks(searchInfo) {
    try {
        if (!searchInfo || typeof searchInfo !== "string")
            return [];

        searchInfo = searchInfo.toLowerCase();
        let regEx = new RegExp('.*' + searchInfo + '.*', 'i');

        let destCollection = await books();


        let nameResult = await destCollection.find(
            {
                name: regEx
            }).toArray();

        return nameResult;

    } catch (e) {
        throw e;
    }
}

async function addBook(bookId) {// pass user

    const destCollection = await books();
    console.log("in addBook");
    let avg=0;
        const newBook={
        _id: uuid(),
        Bookid:bookId,
        avgRating:avg, //add avg rating
        reviews:[],
        userRating:[]
    }
        console.log(newBook);
        const insertInfo = await destCollection.insertOne(newBook);
        if (insertInfo.insertedCount === 0)
            throw "this review is not added";
        const thisUser = await this.getBooksByID(bookId);
        console.log(thisUser.rating);
        return thisUser;

}


async function addReviews(userid,username,bookId,review)
{
    const destCollection = await books();

    console.log("In AddReviews");
    if (typeof review !== "string")
    throw "Your should write a review";
    const book=await this.getBooksByID(bookId);
    const newReview = {
        userid: userid,
        user: username,
        review:review
    };
    const updatedInfo = await destCollection.updateOne({ Bookid: bookId }, { $addToSet: { reviews : newReview } });
    const bookInfo = await this.getBooksByID(bookId);
    console.log(bookInfo);
    console.log("after review push");
    console.log(bookInfo.reviews);
    return bookInfo.reviews;
}

async function addRating(userid,username,bookId,rating)
{
    const destCollection = await books();
    console.log("In addRating");
    if (typeof rating !== "string")
    throw "Your should enter a rating";

    const book=await this.getBooksByID(bookId);
    const newRating = {
        userid: userid,
        user: username,
        rating: rating
    };
    if(book.userRating.length>0){
        for(let i=0;i<book.userRating.length;i++){ //if no user present
            if(book.userRating[i].user==username){
                console.log("user has already rated");
                return { status: false};
            }

        }
            const updatedRating = await destCollection.updateOne({ Bookid: bookId }, { $addToSet: { userRating : newRating } });

    }
    else{
        const updatedRating = await destCollection.updateOne({ Bookid: bookId }, { $addToSet: { userRating : newRating } });
    }

    const bookInfo = await this.getBooksByID(bookId);
    console.log(bookInfo);
    console.log("after rating push");
    console.log(bookInfo.userRating);
    return {status: true};
}
async function calculateAvgRating(bookId,updatedRating){
    const destCollection = await books();
    console.log("in calculateAvgRating");
    let sum=0;
    let avgRating=0;
    const book = await this.getBooksByID(bookId);
    if(book.userRating.length>0){
        for(let i=0;i<book.userRating.length;i++){
            sum+=parseInt(book.userRating[i].rating);
        }
        avgRating=sum/book.userRating.length;
        console.log(avgRating);
    }
    else{
        avgRating=updatedRating.rating;
        console.log(avgRating);
    }
    const updatedAvgRating = await destCollection.updateOne({ Bookid: bookId }, { $set: { avgRating : avgRating } });
    return updatedAvgRating;
}
async function updateRating(book, score) {
    const num = book.numOfRating;
    const beforeRate = book.rating;
    book.rating = ((beforeRate * num) + score) / (num + 1);
    book.numOfRating++;

    return rating;
}

module.exports = {
    getBooksByName,
    getBooksByID,
    addReviews,
    calculateAvgRating,
    addBook,
    addRating,
    updateRating,
    // loadAllBooks,
    searchBooks
};
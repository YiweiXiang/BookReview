const dbConnection = require("../config/mongoConnection");
const data = require("../data/");
const books = data.books;
const users = data.users;
async function main() {
  const db = await dbConnection();
  await db.dropDatabase();

  await users.createUser("Kajol", "Kajol", "KJ", "1995-12-20", "kacharya@stevens.edu", "98745631", "female");
  await users.createUser("Sonal", "Sonal123", "Sonal", "1997-11-21", "sonal@stevens.edu", "3698524", "female");
  await users.createUser("Test", "Test123", "test", "1998-02-20", "test@gmail.com", "92587631", "male");
  //await books.addBook("Aigg5gl_CTYC");
  //await books.addRating("12345","sampleUser","Aigg5gl_CTYC","1");
  //await books.addReviews("12345","sampleUser2","Aigg5gl_CTYC","Great"); 
 
  console.log("Done seeding database");
  await db.serverConfig.close()
}


main().catch(console.log);
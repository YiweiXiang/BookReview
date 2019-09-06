Book Review application This is group project for CS546 Web Programming @Stevens Institute of Technology. Groups Members: Yiwei Xiang, Sonal Gavade, Kajal Acharya, Ao Liu

This web application is developed using Node.js and MongoDB to display reviews and ratings of books with the relevant information. Moreover, user can provide his/her own ratings and reviews to the books. 
Setting up and using this app: Before clone or download this app, make sure you have：

mongodb
node

Download this app: 
#$(local file) git clone + copy the link 

In the terminal: 
#$(in the local file) npm install
Run the app: 
node ./tasks/seed.js
#npm start 
Then open the brower, go to http://localhost:3000/login
Credentials for the professor: For login-> username: Test password: Test123

Register and Login: Firstly register yourself and then directly you login to our home page. Or if you are an existing user just click existing user and you will be directed to login page. Login and Register both take you to the home page.

Search Functionality: On the home page you can search for any book you want, list of books will be displayed. Click on more details you will be directed to book information page.

Book Information Page: Here user can have a preview of book( its cover and tabl of contents). User can add comments which will be displayed on the same page once you submit them. You can add rating too.

Profile: User can change his/her password anytime using his old password.


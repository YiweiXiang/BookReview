const mongoCollections = require("../config/mongoCollections");
const uuid = require("uuid/v4");
const users = mongoCollections.users;
const bcrypt = require("bcrypt");
const saltRounds = 16;

const createUser = async function createUser(username, password, name, birth, email, phone, gender) {

    if (typeof username !== "string") throw "Provided username not a string";
    if (typeof password !== "string") throw "Provided password not a string";
    if (typeof name !== "string") throw "Provided name is not a string";


    let hash = await bcrypt.hash(password, saltRounds);
    console.log("New USer created");
    console.log(hash);
    try {
        let ID = uuid();
        let newInfo = {
            _id: ID,
            username: username,
            password: hash, //hash
            name: name,
            gender: gender,
            birth: birth,
            email: email,
            phone: phone,
        };
        // console.log(newInfo);
        const userCollection = await users();
        const insertInfo = await userCollection.insertOne(newInfo);

        if (insertInfo.insertedCount === 0) {
            throw "this user is not added";
        }

        const thisUser = await this.getUser(ID);
        return thisUser;
    }

    catch (err) {
        console.log(err);
    }

}

const getAllUsers = async function getAllUsers() {
    try {
        const userCollection = await users();
        const allUsers = await userCollection.find({}).toArray();
        return allUsers;
    }
    catch (err) {
        console.log(err);
    }

}

const getUser = async function getUser(id) {

    if (!id) {
        throw "userid not recieved";
    }

    try {
        const userCollection = await users();
        const find_user = await userCollection.findOne({ _id: id });

        if (find_user === null) {
            throw "User not found";
        }
        return find_user;
    }
    catch (err) {
        console.log(err);
    }

}

//finding user with its provided username 
const findExistingUser = async function findExistingUser(username) {

    if (!username || username === null) {
        throw "username not recieved";
    }
    try {
        const userCollection = await users();
        const userInfoWeNeeded = await userCollection.findOne({ username: username });

        // if( userInfoWeNeeded !== null){
        //     return userInfoWeNeeded;
        // }
        return userInfoWeNeeded;
        // else{
        //     return {msg: "Provided username does not exists! Please reenter username or register first"};
        // }

    }
    catch (err) {
        console.log(err);
    }
}

const checkstatus = async function checkstatus(username, password) {

    //username to be checked.....in getexisting user
   // let hash = await bcrypt.hash(password, saltRounds);
    try {
        userInfo = await findExistingUser(username);
        if (userInfo) {
            const isMatch = await bcrypt.compare(password, userInfo.password);
            if (username === userInfo.username && isMatch) {
                return { status: true, userid: userInfo._id };
            }
            else {
                return { status: false, msg: "Invalid username or password" };
            }
        }
        else {
            return { status: false, msg: "Povide correct username or password" };
        }
    } catch (err) {
        console.log(err);
    }

}

const updateUser = async function updateUser(userInfo) {

    if (!userInfo) throw 'userInfo not recieved';
    try {
        //let hash = await bcrypt.hash(userInfo.password, saltRounds);
        var userCollection = await users();
        const tobeupdatedUser = {
            _id: userInfo._id,
            username: userInfo.username,
            password: userInfo.password,
            name: userInfo.name,
            gender: userInfo.gender,
            birth: userInfo.birth,
            email: userInfo.email,
            phone: userInfo.phone
        };
        console.log('going to update in db');
        const updatedUserInfo = await userCollection.replaceOne({ username: userInfo.username }, tobeupdatedUser);
        if (updatedUserInfo.modifiedCount === 0) {
            throw 'to be updated recipe not updated properly in the database';
        }
        else {
            console.log('came in else of updateuser');
            return { status: true };
        }
    } catch (err) {
        console.log(err);
    }

}

async function updatePassword(username, password, newpassword) {


    if (!username) throw "username not recieved";
    if (!password) throw "password not recieved";
    if (!newpassword) throw "new password not recieved";
    //let hash = await bcrypt.hash(password, saltRounds);
    let newHash = await bcrypt.hash(newpassword, saltRounds);
    console.log(password);
   // console.log(hash);
    try {
        userInfo = await findExistingUser(username);
        //console.log(userInfo.password);
        if (userInfo) {
            const isMatch = await bcrypt.compare(password, userInfo.password);
            if (username === userInfo.username && isMatch) {
                //here first calculate hash of new pass word and then check that pass !== newpassword
                if (userInfo.password !== newHash) {
                    userInfo.password = newHash;
                    //now make this changes to db now
                    changes = await updateUser(userInfo);
                    if (changes.status === true) {
                        return { status: true, msg: "Password change was successfull!!!" };
                    }
                    else {
                        return { status: false, msg: "Password change was unsuccessfull!!!" };
                    }

                }
                else {
                    console.log('came in else of if...');
                    return { status: false, msg: "Old Password and new password cannot be same!!!" };
                }

            }
            else {
                // console.log('came in else of second if...');
                return { status: false, msg: "Old Password and new password cannot be same!!!" };
            }
        }
        else {
            return { status: false, msg: "Password change was unsuccessfull!" };
        }
    } catch (err) {
        console.log(err);
    }
}

module.exports = {
    createUser,
    getAllUsers,
    getUser,
    findExistingUser,
    updateUser,
    updatePassword,
    checkstatus
};
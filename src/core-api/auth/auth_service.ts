import {default as USER} from '../../db/schemas/UserSchema';

async function getUserByEmail(email:string) {
    return USER.findOne({email});
}
async function addNewUser(userData : {email:string,name:string;password:string}){
    return USER.create(userData);
}


export {addNewUser,getUserByEmail};
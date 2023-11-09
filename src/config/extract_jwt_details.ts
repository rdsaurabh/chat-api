import { Request } from "express";

/**
 * 
 * This method can be used to parse  the details of user after the token has been verified.
 * This method is needed because we can not store objects in request headers, after authentication
 * the object which contains user details is parsed to string and stored in request headers.
 * this method is pasring the string to object.
 */
function getDecodedJwtDetails(req:Request){
   return (req.headers["auth"] && typeof req.headers["auth"] === 'string') ?  JSON.parse(req.headers["auth"]) : undefined ;
}

export {getDecodedJwtDetails };
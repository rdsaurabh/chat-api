import { Request, Response } from "express";
import { getDecodedJwtDetails } from "../../config/extract_jwt_details";
import {default as MESSAGE} from "../../db/schemas/MessageSchema";
import { getUserByEmail } from "../auth/auth_service";

async function getMessages(req:Request,res:Response){
    const jwtDetails  = getDecodedJwtDetails(req);
    const partnerEmail = req.query.partnerEmail;

    if(jwtDetails && typeof partnerEmail === 'string' && partnerEmail){
        const user = await getUserByEmail(jwtDetails.email);
        const partner = await  getUserByEmail(partnerEmail);
        
        const userAsSender = {senderId:user?.email};
        const userAsReceiver = {receiverId:user?.email};
        const partnerAsSender = {senderId:partner?.email};
        const partnerAsReceiver = {receiverId:partner?.email};

        try{
            const messageList = await MESSAGE.find({$or : [{$and:[userAsSender,partnerAsReceiver]},{$and:[partnerAsSender,userAsReceiver]}]});
            res.json({messageList});
        }catch(err){
            res.status(404).send({message: "Something Went Wrong Resource you are looking for is not present!!!"});
        }
    }else{
        res.status(403).send({message: `Failed to authorize please login`});
    }

}



export {getMessages};
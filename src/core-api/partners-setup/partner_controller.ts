import { Request, Response } from "express";
import { getPartnersByEmail } from "./partner_service";
import { getDecodedJwtDetails } from "../../config/extract_jwt_details";
import { getUserByEmail } from "../auth/auth_service";
import mongoose from "mongoose";

async function getPartners(req:Request,res:Response){
    
    try{
        const jwtDetails = getDecodedJwtDetails(req);
        if(jwtDetails){
            const partnersList = await getPartnersByEmail(jwtDetails.email);
            res.json({"allPartners":partnersList});
        }else{
            res.status(403).send({message: `Failed to authorize please login`});
        }
    }catch(err){
        res.status(404).send({message: "Something Went Wrong Resource you are looking for is not present!!!"});
    }
     
}


async function addPartner (req:Request,res:Response) {

        const jwtDetails  = getDecodedJwtDetails(req);
        const partnerEmail = req.body.partner;
        
        if(jwtDetails && partnerEmail){
            let session;
            try{
                const user = await getUserByEmail(jwtDetails.email);
                const partner = await getUserByEmail(partnerEmail);
            
                if(user && partner ){
                
                    //if already partners-- then don't add which means user already has this partner present.
                    
                    if(user.partners.includes(partner._id)){
                        res.status(200).send({"message":"Relationship Exists Already."});
                        return;
                    }
                    
                    user.partners.push(partner._id);
                    partner.partners.push(user._id);
                    
                    

                    //also this is a transaction if only one is saved then roll back should happen
                    session = await mongoose.startSession();
                    await session.startTransaction();

                    await user.save();
                    await partner.save();

                    await session.commitTransaction();
                    await session.endSession();

                    res.status(200).send({"message":"Relationship Established Successfully"});

                }else{
                    res.status(404).send({"message":"Relationship Could Not Be Established"});
                }
            }catch(err){

                if(session){
                    await session.abortTransaction();
                    await session.endSession();
                    res.status(404).send({message: "Failed to establish the realtionship Try Again!!!"}); 
                }else{
                    res.status(404).send({message: "Something Went Wrong Resource you are looking for is not present!!!"});
                } 

            }

        }else{
            res.status(403).send({message: `Failed to authorize please login`});
        }

}

export {getPartners,addPartner};
import { Request,Response,NextFunction } from "express";
import { addNewUser,getUserByEmail } from "./auth_service";
import { SECRET } from "./jwtauth_middleware";
import jwt from 'jsonwebtoken';

async function login(req:Request,res : Response){
    const {email,password} = req.body;
   
    try{
        const existingUser = await getUserByEmail(email);
        
        if(existingUser  && existingUser.password === password){
            const jwtToken = await jwt.sign({email:existingUser.email,userId:existingUser._id},SECRET,{expiresIn: '1h'});
            res.status(200).json({"message":"Signed In Successfully","userDetails":{"email":existingUser.email,"id":existingUser._id},"token":jwtToken});
        }else{
            res.status(403).send({message: `No such user is present with email ${email}!!`});
        }

    }catch(err:any){
        res.status(404).send({message: "Something Went Wrong Resource you are looking for is not present!!!"});
    }

}

async function signup(req:Request,res : Response){
    const {name,email,password} = req.body;

    try{
        const existingUser = await getUserByEmail(email);
        
        if(!existingUser){
            const newUser = await addNewUser({email,name,password});
            res.status(201).json({message:`New User With username ${email} created successfully.`});
        }else{
            res.status(403).send({message: "User Already Registered!!"});
        }

    }catch(err){
        res.status(404).send({message: "Something Went Wrong Resource you are looking for is not present!!!"});
    }
}



export {login,signup};
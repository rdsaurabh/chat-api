import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken';

const SECRET = "THIS_IS_MY_SECRET_KEY_GYSF_GY_634264H";

const authenticateJwt = (req : Request,res :Response,next:NextFunction) => {
    
    if(req.path === '/signup' || req.path === '/login'){
        next();
    }else{
        const authHeader = req.headers.authorization;
    
        if(authHeader){
            const token = authHeader.split(' ')[1];
            jwt.verify(token,SECRET,(err,auth)=>{
        
            if(err){
                res.status(401).json({message:"Authentication Failed!!! Authentication Token is invalid/expired"})
            }else{
                req.headers["auth"]= JSON.stringify(auth);
                next();
            }
        });

        }else{
            res.status(401).json({message:"Authentication Failed!!! Authentication Token is invalid/expired"})
        }
    }
  
  }

export {SECRET,authenticateJwt};
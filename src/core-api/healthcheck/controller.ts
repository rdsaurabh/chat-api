import { Request,Response,NextFunction } from "express";


function checkHealth(req:Request,res : Response){
    res.json("🚀Server is up and running ⚡️");
}


export {checkHealth};
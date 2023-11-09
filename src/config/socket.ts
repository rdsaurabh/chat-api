
import  WebSocket  from 'ws';
import jwt from 'jsonwebtoken';
import { SECRET } from '../core-api/auth/jwtauth_middleware';
import {default as MESSAGE} from '../db/schemas/MessageSchema';

function validTokenForSocket(tokenString:string){
    
    if(tokenString){
      const token = tokenString.split(' ')[1];
      let authObj : any;
      jwt.verify(token,SECRET,(err,auth)=>{
  
        if(!err){
         authObj = auth; 
        }
  
      });
      return authObj;
    }
  
  }

function initializeWebSocket(server:any){

    const activeUsers : Map<String,WebSocket> = new Map();
    const wss = new WebSocket.Server({server});
   
    wss.on('connection',(socket,req)=>{ 

        const token = req.headers.authtoken;
        
        if( !token || typeof token !== 'string'){
            socket.close();
            return;
        }
     
        const userDetails = validTokenForSocket(token);
       

        if(!userDetails){
            socket.close();
            return;
        }
       

        if(userDetails.email && !activeUsers.has(userDetails.email)){
            activeUsers.set(userDetails.email,socket);
            
            socket.on('message',(message)=>{
                console.log(message.toString());
                const msgObj = JSON.parse(message.toString());
                msgObj.senderId = userDetails.email;
  
                const receiverConn = activeUsers.get(msgObj.receiverId);
        
                if(receiverConn){
                    msgObj.status = "READ"    
                    receiverConn.send(JSON.stringify(msgObj));
                }else{
                    msgObj.status = "PENDING"
                }    
                MESSAGE.create({...msgObj,timestamp: new Date()})

            });
        
            socket.on('close',()=>{
                activeUsers.delete(userDetails.email);
                console.log(userDetails.email + " : Disconnected");
            });
 
        }else {
            socket.close();
        }
    
    });

}

export default initializeWebSocket;
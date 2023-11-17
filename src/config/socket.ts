
import  WebSocket  from 'ws';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { SECRET } from '../core-api/auth/jwtauth_middleware';
import {default as MESSAGE} from '../db/schemas/MessageSchema';


function validTokenForSocket(tokenString:string) : any {
    
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
        let userDetails : any = undefined;
       
        socket.on('message',(message)=>{
            const parsedMessage = JSON.parse(message.toString());
            
            if (parsedMessage.messageType === 'connection') {
                userDetails = validTokenForSocket("Bearer " + parsedMessage.data);
                
                if(userDetails){
                    activeUsers.set(userDetails.email,socket);
                }else{
                    socket.close();
                }
                console.log("Connection Established Successfully");

            }else if(userDetails){
                    parsedMessage.senderId = userDetails.email;
                    const receiverConn = activeUsers.get(parsedMessage.receiverId);
                    if(receiverConn){
                        console.log("should come here");
                         parsedMessage.status = "READ"    
                         receiverConn.send(JSON.stringify(parsedMessage));
                     }else{
                         parsedMessage.status = "PENDING"
                     }    
                     console.log(parsedMessage);
                     MESSAGE.create({...parsedMessage,timestamp: new Date()})
            }else{
                console.log("closing connection");
                socket.close();
            }

        });
        
 
        socket.on('close',()=>{
            if(userDetails){
                activeUsers.delete(userDetails.email);
            }
            console.log("Disconnected");
        });

    });

}

export default initializeWebSocket;
import express,{Express,Request,Response} from 'express';

import {default as healthcheck} from './src/core-api/healthcheck/routes'
import {default as authRouter} from './src/core-api/auth/auth_routes'
import {default as partnerRouter} from './src/core-api/partners-setup/partner_routes'
import {default as messagesRouter} from './src/core-api/messages/messages_routes'

import connectDB from './src/config/db';
import bodyParser from 'body-parser'
import cors from 'cors'
import initializeWebSocket from './src/config/socket';



const app : Express = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

app.use(cors({
    origin: 'https://chat-application-d8078.web.app',
    methods: ['GET', 'POST'], // Add other methods you're using
    allowedHeaders: ['Authorization', 'Content-Type'],
    credentials: true,
  }));

app.use("/healthcheck",healthcheck);
app.use("/auth",authRouter);
app.use("/partners",partnerRouter);
app.use("/messages",messagesRouter);
 
app.get("/",(req,res)=>{
  res.json("Welcome to backend of chat api another changes");
});

connectDB();

const port = 8080;
const server = app.listen(port,()=>{
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});


initializeWebSocket(server);
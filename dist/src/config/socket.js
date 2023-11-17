"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = __importDefault(require("ws"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const jwtauth_middleware_1 = require("../core-api/auth/jwtauth_middleware");
const MessageSchema_1 = __importDefault(require("../db/schemas/MessageSchema"));
function validTokenForSocket(tokenString) {
    if (tokenString) {
        const token = tokenString.split(' ')[1];
        let authObj;
        jsonwebtoken_1.default.verify(token, jwtauth_middleware_1.SECRET, (err, auth) => {
            if (!err) {
                authObj = auth;
            }
        });
        return authObj;
    }
}
function initializeWebSocket(server) {
    const activeUsers = new Map();
    const wss = new ws_1.default.Server({ server });
    wss.on('connection', (socket, req) => {
        let userDetails = undefined;
        socket.on('message', (message) => {
            const parsedMessage = JSON.parse(message.toString());
            if (parsedMessage.messageType === 'connection') {
                userDetails = validTokenForSocket("Bearer " + parsedMessage.data);
                if (userDetails) {
                    activeUsers.set(userDetails.email, socket);
                }
                else {
                    socket.close();
                }
                console.log("Connection Established Successfully");
            }
            else if (userDetails) {
                parsedMessage.senderId = userDetails.email;
                const receiverConn = activeUsers.get(parsedMessage.receiverId);
                if (receiverConn) {
                    console.log("should come here");
                    parsedMessage.status = "READ";
                    receiverConn.send(JSON.stringify(parsedMessage));
                }
                else {
                    parsedMessage.status = "PENDING";
                }
                console.log(parsedMessage);
                MessageSchema_1.default.create(Object.assign(Object.assign({}, parsedMessage), { timestamp: new Date() }));
            }
            else {
                console.log("closing connection");
                socket.close();
            }
        });
        socket.on('close', () => {
            if (userDetails) {
                activeUsers.delete(userDetails.email);
            }
            console.log("Disconnected");
        });
    });
}
exports.default = initializeWebSocket;

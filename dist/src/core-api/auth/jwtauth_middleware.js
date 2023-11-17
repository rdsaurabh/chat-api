"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateJwt = exports.SECRET = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const SECRET = "THIS_IS_MY_SECRET_KEY_GYSF_GY_634264H";
exports.SECRET = SECRET;
const authenticateJwt = (req, res, next) => {
    if (req.path === '/signup' || req.path === '/login') {
        next();
    }
    else {
        const authHeader = req.headers.authorization;
        if (authHeader) {
            const token = authHeader.split(' ')[1];
            jsonwebtoken_1.default.verify(token, SECRET, (err, auth) => {
                if (err) {
                    res.status(401).json({ message: "Authentication Failed!!! Authentication Token is invalid/expired" });
                }
                else {
                    req.headers["auth"] = JSON.stringify(auth);
                    next();
                }
            });
        }
        else {
            res.status(401).json({ message: "Authentication Failed!!! Authentication Token is invalid/expired" });
        }
    }
};
exports.authenticateJwt = authenticateJwt;

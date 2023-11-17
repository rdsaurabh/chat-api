"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
function connectDB() {
    const url = "mongodb://127.0.0.1:27017/chatdb";
    try {
        mongoose_1.default.connect(url);
    }
    catch (err) {
        console.log(err.message);
    }
    const dbConnection = mongoose_1.default.connection;
    dbConnection.once("open", () => {
        console.log(`Database Connected: ${url}`);
    });
    dbConnection.on("error", () => {
        console.error(`Connection Error: ${url}`);
    });
}
exports.default = connectDB;

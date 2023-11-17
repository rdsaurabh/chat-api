"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const messageSchema = new mongoose_1.default.Schema({
    messageText: { type: String,
        required: true },
    senderId: { type: String,
        required: true },
    receiverId: { type: String,
        required: true },
    status: { type: String,
        required: true },
    timestamp: { type: String,
        required: true }
});
exports.default = mongoose_1.default.model('message', messageSchema);

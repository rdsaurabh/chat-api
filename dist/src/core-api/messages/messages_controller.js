"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMessages = void 0;
const extract_jwt_details_1 = require("../../config/extract_jwt_details");
const MessageSchema_1 = __importDefault(require("../../db/schemas/MessageSchema"));
const auth_service_1 = require("../auth/auth_service");
function getMessages(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const jwtDetails = (0, extract_jwt_details_1.getDecodedJwtDetails)(req);
        const partnerEmail = req.query.partnerEmail;
        if (jwtDetails && typeof partnerEmail === 'string' && partnerEmail) {
            const user = yield (0, auth_service_1.getUserByEmail)(jwtDetails.email);
            const partner = yield (0, auth_service_1.getUserByEmail)(partnerEmail);
            const userAsSender = { senderId: user === null || user === void 0 ? void 0 : user.email };
            const userAsReceiver = { receiverId: user === null || user === void 0 ? void 0 : user.email };
            const partnerAsSender = { senderId: partner === null || partner === void 0 ? void 0 : partner.email };
            const partnerAsReceiver = { receiverId: partner === null || partner === void 0 ? void 0 : partner.email };
            try {
                const messageList = yield MessageSchema_1.default.find({ $or: [{ $and: [userAsSender, partnerAsReceiver] }, { $and: [partnerAsSender, userAsReceiver] }] });
                res.json({ messageList });
            }
            catch (err) {
                res.status(404).send({ message: "Something Went Wrong Resource you are looking for is not present!!!" });
            }
        }
        else {
            res.status(403).send({ message: `Failed to authorize please login` });
        }
    });
}
exports.getMessages = getMessages;

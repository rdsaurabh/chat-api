"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const jwtauth_middleware_1 = require("../auth/jwtauth_middleware");
const messages_controller_1 = require("./messages_controller");
const router = express_1.default.Router();
router.use(jwtauth_middleware_1.authenticateJwt);
router.get("/", messages_controller_1.getMessages);
exports.default = router;

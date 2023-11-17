"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const partner_controller_1 = require("./partner_controller");
const jwtauth_middleware_1 = require("../auth/jwtauth_middleware");
const router = express_1.default.Router();
router.use(jwtauth_middleware_1.authenticateJwt);
router.get("/", partner_controller_1.getPartners);
router.post("/", partner_controller_1.addPartner);
exports.default = router;

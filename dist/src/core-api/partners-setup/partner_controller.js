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
exports.addPartner = exports.getPartners = void 0;
const partner_service_1 = require("./partner_service");
const extract_jwt_details_1 = require("../../config/extract_jwt_details");
const auth_service_1 = require("../auth/auth_service");
const mongoose_1 = __importDefault(require("mongoose"));
function getPartners(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const jwtDetails = (0, extract_jwt_details_1.getDecodedJwtDetails)(req);
            if (jwtDetails) {
                const partnersList = yield (0, partner_service_1.getPartnersByEmail)(jwtDetails.email);
                res.json({ "allPartners": partnersList });
            }
            else {
                res.status(403).send({ message: `Failed to authorize please login` });
            }
        }
        catch (err) {
            res.status(404).send({ message: "Something Went Wrong Resource you are looking for is not present!!!" });
        }
    });
}
exports.getPartners = getPartners;
function addPartner(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const jwtDetails = (0, extract_jwt_details_1.getDecodedJwtDetails)(req);
        const partnerEmail = req.body.partner;
        if (jwtDetails && partnerEmail) {
            let session;
            try {
                const user = yield (0, auth_service_1.getUserByEmail)(jwtDetails.email);
                const partner = yield (0, auth_service_1.getUserByEmail)(partnerEmail);
                if (user && partner) {
                    //if already partners-- then don't add which means user already has this partner present.
                    if (user.partners.includes(partner._id)) {
                        res.status(200).send({ "message": "Relationship Exists Already." });
                        return;
                    }
                    user.partners.push(partner._id);
                    partner.partners.push(user._id);
                    //also this is a transaction if only one is saved then roll back should happen
                    session = yield mongoose_1.default.startSession();
                    yield session.startTransaction();
                    yield user.save();
                    yield partner.save();
                    yield session.commitTransaction();
                    yield session.endSession();
                    res.status(200).send({ "message": "Relationship Established Successfully" });
                }
                else {
                    res.status(404).send({ "message": "Relationship Could Not Be Established" });
                }
            }
            catch (err) {
                if (session) {
                    yield session.abortTransaction();
                    yield session.endSession();
                    res.status(404).send({ message: "Failed to establish the realtionship Try Again!!!" });
                }
                else {
                    res.status(404).send({ message: "Something Went Wrong Resource you are looking for is not present!!!" });
                }
            }
        }
        else {
            res.status(403).send({ message: `Failed to authorize please login` });
        }
    });
}
exports.addPartner = addPartner;

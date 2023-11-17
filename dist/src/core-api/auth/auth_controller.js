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
exports.signup = exports.login = void 0;
const auth_service_1 = require("./auth_service");
const jwtauth_middleware_1 = require("./jwtauth_middleware");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function login(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { email, password } = req.body;
        try {
            const existingUser = yield (0, auth_service_1.getUserByEmail)(email);
            if (existingUser && existingUser.password === password) {
                const jwtToken = yield jsonwebtoken_1.default.sign({ email: existingUser.email, userId: existingUser._id }, jwtauth_middleware_1.SECRET, { expiresIn: '1h' });
                res.status(200).json({ "message": "Signed In Successfully", "userDetails": { "email": existingUser.email, "id": existingUser._id }, "token": jwtToken });
            }
            else {
                res.status(403).send({ message: `No such user is present with email ${email}!!` });
            }
        }
        catch (err) {
            res.status(404).send({ message: "Something Went Wrong Resource you are looking for is not present!!!" });
        }
    });
}
exports.login = login;
function signup(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { name, email, password } = req.body;
        try {
            const existingUser = yield (0, auth_service_1.getUserByEmail)(email);
            if (!existingUser) {
                const newUser = yield (0, auth_service_1.addNewUser)({ email, name, password });
                res.status(201).json({ message: `New User With username ${email} created successfully.` });
            }
            else {
                res.status(403).send({ message: "User Already Registered!!" });
            }
        }
        catch (err) {
            res.status(404).send({ message: "Something Went Wrong Resource you are looking for is not present!!!" });
        }
    });
}
exports.signup = signup;

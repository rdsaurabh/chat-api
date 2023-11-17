"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const routes_1 = __importDefault(require("./src/core-api/healthcheck/routes"));
const auth_routes_1 = __importDefault(require("./src/core-api/auth/auth_routes"));
const partner_routes_1 = __importDefault(require("./src/core-api/partners-setup/partner_routes"));
const messages_routes_1 = __importDefault(require("./src/core-api/messages/messages_routes"));
const db_1 = __importDefault(require("./src/config/db"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const socket_1 = __importDefault(require("./src/config/socket"));
const app = (0, express_1.default)();
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use((0, cors_1.default)({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Authorization', 'Content-Type'],
    credentials: true,
}));
app.use("/healthcheck", routes_1.default);
app.use("/auth", auth_routes_1.default);
app.use("/partners", partner_routes_1.default);
app.use("/messages", messages_routes_1.default);
(0, db_1.default)();
const port = 8080;
const server = app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
(0, socket_1.default)(server);

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
// Environment variables
require("dotenv/config");
// Routes import
const index_1 = __importDefault(require("./router/index"));
const app = (0, express_1.default)();
// Setup DB
const db_1 = __importDefault(require("./config/db"));
(0, db_1.default)();
// JSON Parser
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Middleware Setup
app.use((0, morgan_1.default)("combined"));
app.use((0, cors_1.default)({
    origin: "*"
}));
// Routes
app.use("/", index_1.default);
// Start the server
const port = process.env.PORT || 9000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

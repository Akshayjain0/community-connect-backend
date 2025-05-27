"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const routes_1 = __importDefault(require("./routes/routes"));
const http_errors_1 = __importDefault(require("http-errors"));
const middlewares_1 = require("./middlewares");
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json({ limit: "16kb" }));
app.use((0, cors_1.default)({
    origin: "http://13.202.85.79:8021", // must be exact
    credentials: true, // allow cookies, auth headers
}));
app.use(express_1.default.urlencoded({ extended: true, limit: "16kb" }));
app.use(express_1.default.static("public"));
app.use((0, cookie_parser_1.default)());
app.use((0, helmet_1.default)());
app.use((0, morgan_1.default)("dev"));
app.use("/api/v1", routes_1.default);
app.get("/", (req, res) => {
    res.send("Hello, Typescript with express js.");
});
app.use((req, res, next) => {
    next((0, http_errors_1.default)(404, "Resource not found"));
});
// Error-handling middleware
app.use(middlewares_1.errorHandler);
exports.default = app;

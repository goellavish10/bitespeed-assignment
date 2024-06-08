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
Object.defineProperty(exports, "__esModule", { value: true });
exports.sequelize = void 0;
const sequelize_1 = require("sequelize");
const dbname = process.env.DATABASE_NAME;
const dbuser = process.env.DATABASE_USER;
const dbpassword = process.env.DATABASE_PASSWORD;
const dbhost = process.env.DATABASE_HOST;
exports.sequelize = new sequelize_1.Sequelize(dbname, dbuser, dbpassword, {
    host: dbhost,
    port: parseInt(process.env.DB_PORT, 10),
    dialect: "mysql"
});
function connectDB() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield exports.sequelize.authenticate();
            console.log("Database connected successfully!");
        }
        catch (error) {
            console.error("Unable to connect to the database: ", error);
        }
    });
}
exports.default = connectDB;

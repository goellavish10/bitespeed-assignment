import { Sequelize } from "sequelize";
export declare const sequelize: Sequelize;
declare function connectDB(): Promise<void>;
export default connectDB;

import express from "express";
import morgan from "morgan";
import cors from "cors";

// Environment variables
import dotenv from "dotenv";
dotenv.config({ path: "./config/.env" });

// Routes import
import router from "./router/index.ts";

const app = express();

// Setup DB
import connectDB from "./config/db.ts";
connectDB();

// JSON Parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware Setup
app.use(morgan("combined"));
app.use(
  cors({
    origin: "*"
  })
);

// Routes
app.use("/", router);

// Start the server
const port = process.env.PORT || 9000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

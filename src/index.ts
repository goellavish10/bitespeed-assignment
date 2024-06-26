import express from "express";
import morgan from "morgan";
import cors from "cors";

// Environment variables
import "dotenv/config";

// Routes import
import router from "./router/index";

const app = express();

// Setup DB
import connectDB from "./config/db";
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

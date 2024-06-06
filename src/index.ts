import express from "express";
import morgan from "morgan";
import cors from "cors";

// Routes import
import router from "./router/index.ts";

const app = express();

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

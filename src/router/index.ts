// express router
import { identify } from "../controller/Identify.ts";
import express from "express";

const router = express.Router();

router.get("/identify", identify);

export default router;

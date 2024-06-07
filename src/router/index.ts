// express router
import { identify } from "../controller/Identify.ts";
import express from "express";

const router = express.Router();

router.post("/identify", identify);

export default router;

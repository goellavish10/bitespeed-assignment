// express router
import { homeRoute } from "../controller/home";
import { identify } from "../controller/Identify";
import express from "express";

const router = express.Router();

router.get("/", homeRoute);
router.post("/identify", identify);

export default router;

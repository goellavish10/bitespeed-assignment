import { Request, Response } from "express";
import { identityReconcilationLogic } from "../models/contact.service";
import { generateResponseObj } from "../utils/index";
import { IdentifyResponse, QueryResponse } from "../interfaces/response";

export const identify = async (req: Request, res: Response) => {
  try {
    const { phoneNumber, email } = req.body;
    if (!phoneNumber && !email) {
      return res.status(400).json({
        message: "Bad Request: Please provide either email or phoneNumber"
      });
    }
    const response: QueryResponse = await identityReconcilationLogic(
      email,
      phoneNumber
    );
    const responseObj: IdentifyResponse = generateResponseObj(
      response.primaryContactId,
      response.emails,
      response.phoneNumbers,
      response.secondaryContactIds
    );
    return res.status(200).json(responseObj);
  } catch (err: unknown) {
    console.log(err);
    res.status(500).send("Internal Server Error");
  }
};

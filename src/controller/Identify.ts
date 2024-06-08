import { Request, Response } from "express";
import {
  contactExists,
  createPrimaryContactEntry
} from "../models/contact.service.ts";
import { generateResponseObj } from "../utils/index.ts";
import { IdentifyResponse, QueryResponse } from "../interfaces/response.ts";

export const identify = async (req: Request, res: Response) => {
  try {
    const { phoneNumber, email } = req.body;
    const contactEntryExists: boolean = await contactExists(email, phoneNumber);
    // if (!contactEntryExists) {
    const response: QueryResponse = await createPrimaryContactEntry(
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
    // }
  } catch (err: unknown) {
    console.log(err);
    res.status(500).send("Internal Server Error");
  }
};

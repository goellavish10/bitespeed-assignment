import { Request, Response } from "express";
import {
  contactExists,
  createPrimaryContactEntry
} from "../models/contact.service.ts";

export const identify = async (req: Request, res: Response) => {
  try {
    const { phoneNumber, email } = req.body;
    const contactEntryExists: boolean = await contactExists(email, phoneNumber);
    if (!contactEntryExists) {
      await createPrimaryContactEntry(email, phoneNumber);
    }
    return res.status(200).send({ contactEntryExists });
  } catch (err: unknown) {
    console.log(err);
    res.status(500).send("Internal Server Error");
  }
};

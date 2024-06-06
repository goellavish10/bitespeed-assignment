import { Request, Response } from "express";

interface IdentifyRequest {
  phoneNumber: string | null;
  email: string | null;
}

export const identify = async (req: Request, res: Response) => {
  try {
  } catch (err: unknown) {
    console.log(err);
    res.status(500).send("Internal Server Error");
  }
};

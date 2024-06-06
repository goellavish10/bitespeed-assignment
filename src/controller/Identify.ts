import { Request, Response } from "express";
export const identify = async (req: Request, res: Response) => {
  try {
    res.send("Identify");
  } catch (err: unknown) {
    console.log(err);
    res.status(500).send("Internal Server Error");
  }
};

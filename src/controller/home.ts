import { Request, Response } from "express";

export function homeRoute(req: Request, res: Response) {
  res.send("Hello Bitespeed Team!");
}

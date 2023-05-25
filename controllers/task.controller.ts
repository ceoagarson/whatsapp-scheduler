import { Request, NextFunction, Response } from "express";
import { TaskBody } from "../types/task.type";

export const Index=(req:Request,res:Response,next:NextFunction)=>{
return res.status(200).json({message:"ok"})
}
import { Request,NextFunction, Response } from "express";

export const Index=(req:Request,res:Response,next:NextFunction)=>{
    res.send("hello")
}
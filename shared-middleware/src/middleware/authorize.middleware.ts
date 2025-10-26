import { NextFunction, Request, Response } from "express";
import { ApiResult } from "../utils/comman";

export const AuthorizeUser = (allowedRole: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const currentRole = req.headers["x-user-role"] as string;
        if (allowedRole.includes(currentRole)) {
            next()
        } else {
            res.status(403).json(ApiResult({ message: "You Are Not Authorized For This" }))
            return
        }
    }
}   
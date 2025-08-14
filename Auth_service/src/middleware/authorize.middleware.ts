import { NextFunction, Request, Response } from "express";
import { ApiResult } from "../utils/comman";
import { Role } from "../constants";

export const AuthorizeUser = (allowedRole: Role[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const currentRole = req.user.role;
        if (allowedRole.includes(currentRole)) {
            next()
        } else {
            res.status(403).json(ApiResult({ message: "You Are Not Authorized For This" }))
            return
        }
    }
}   
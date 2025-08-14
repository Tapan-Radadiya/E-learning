import { NextFunction } from "express";
import { Response, Request } from "express";
import { decodeJWT } from "../utils/comman";

export const AuthenticateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const bearerToken = req.headers.authorization
        if (!bearerToken) {
            res.status(401).json({ message: "Unauthorized No Token Found" })
            return
        }
        const authToken = bearerToken.split(" ")[1]
        const userData = await decodeJWT(authToken, "ACCESS")
        if ('id' in userData) {
            // Valid Access Token
            req.user = { email: userData.email, id: userData.id, role: userData.role }
            next()
        } else {
            res.status(401).json({ message: "Unauthorized Invalid Token" })
            return
        }
    } catch (error: any) {
        if (error.name === 'TokenExpiredError') {
            res.status(401).json({ message: "Unauthorized Token Expired" })
            return
        }
        console.log('error->', error)
        res.status(401).json({ message: "Unauthorized Invalid Token" });
        return
    }
}
import { NextFunction } from "express";
import { Response, Request } from "express";
import passport from "passport";

export const OauthMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate(
        "google",
        {
            scope: ["profile", "email"],
            prompt: "login select_account",
            session: false,
            failureRedirect: "http://localhost:4000/login",
        }
    )(req, res, next);
}

export const googleOauthCallbackhandler = async (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate("google", { session: false, failureRedirect: "http://localhost:4000/login" }, (err: any, user: any, info: any) => {

        if (err || !user) {
            return res.redirect("http://localhost:4000/login");
        }
        res.redirect(`http://localhost:4000/login`);
    })(req, res, next);
}
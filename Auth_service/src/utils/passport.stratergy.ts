import { Strategy as GoogleStrategy } from 'passport-google-oauth2'
import passport from "passport"

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    callbackURL: "http://localhost:8080/service1/oauth/callback",
    passReqToCallback: true,    
},
    //   @ts-ignore
    function (request, accessToken, refreshToken, profile, cb) {
        return cb(null,profile)
    }
));
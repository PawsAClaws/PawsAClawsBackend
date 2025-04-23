import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth2"

export const usePassportGoogle = () => {
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID as string,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        callbackURL: `${process.env.BASE_URL}/api/v1/auth/google/callback`,
        passReqToCallback: true
    }, (request,accessToken, refreshToken, profile, done) => {
        return done(null, profile)
    }))

    passport.serializeUser((user, done) => {
        done(null, user)
    })

    passport.deserializeUser((user:any, done) => {
        done(null, user)
    })
}
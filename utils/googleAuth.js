import GoogleStrategy from "passport-google-oauth20"
import passport from "passport";
import GUser from "../models/GUserModel.js"
import dotenv from "dotenv";
dotenv.config({ path: 'config/secretKey.env' });
//Below is  passport Strategy


export const googlePassportConnection = () => {
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URI,
    },
        async function (accessToken, refreshToken, profile, next) {
            console.log(profile);
            const user = await GUser.findOne({
                googleID: profile.id,
            });

            if (!user) {
                const newUser = await GUser.create({
                    googleID: profile.id,
                    name: profile.displayName,
                    email : profile.emails[0].value,
                });
                return next(null, newUser);
            }
            else {
                return next(null, user);
            }
        }
    ));
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser(async (id, done) => {
        const user = await GUser.findById(id);
        done(null, user);
    })
}







export const getGoogleLogout = (req,res,next)=>{
    req.session.destroy((error)=>{
        if(error) {
            return res.send({
                success : true,
                error,
            })
        }
        res.clearCookie("connect.sid");
        res.send({
            success : true,
            message : 'logged Out successful'
        })
    })
}
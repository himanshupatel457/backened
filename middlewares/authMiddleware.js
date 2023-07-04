import JWT from "jsonwebtoken";
import User from "../models/userModel.js";

//require login/sign in

export const requireSignIn = (req, res, next) => {
    try {
        
    const decoded = JWT.verify(req.headers.authorization, process.env.JWT_SECRET_KEY);
    req.user = decoded;
    console.log(decoded);
    next(); //this will let request flow after  verification is done
    } catch (error) {
        console.log(error);
        res.status(401).send({
            success :false,
            message : 'NOT AUTHORISED VERIFICATION FAILED'
        })
    }
}

// Permission to be a admin for admin routes


export const isAdmin = async (req,res,next) =>{
    try {
        const user = await User.findById(req.user._id);
        const role = user.role;
        if(role === 3){
            next();
        }
        else {
            return res.status(401).send({
                success : false,
                message : 'UNAUTHORISED ACCESS'
            })
        }
    } catch (error) {
        console.log(error);
        res.status(401).send({ 
            success: false,
            message : `problem occured during Auth`
        })
    }
}
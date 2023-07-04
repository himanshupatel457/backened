import express from "express"
import { signUpController, loginController, testController, isProtected, getResetPasswordLink, getPasswordChange, getPasswordMatch, getProfileUpdated, getAllOrders, getAdminOrders, updateOrderStatus } from "../controllers/authController.js";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";
import passport from 'passport'
import { getGoogleLogout } from "../utils/googleAuth.js";
// import dotenv from 'dotenv';
// dotenv.config({path : 'config/secretKey.env'});


const router = express.Router();

//authentication routes

// SIGNUP ROUTE : METHOD POST
router.post('/signUp', signUpController);

//LOGIN ROUTE : METHOD POST
router.post('/login', loginController);

// THIS IS A TESTING GOOGLE AUTH CURRENTLY

router.get('/google', passport.authenticate('google', { scope: ['profile','email'] }));

//after routing to /glogin

router.get('/glogout',getGoogleLogout);

router.get('/glogin',passport.authenticate('google'),(req,res,next)=>{
    res.send('YES LOGGED IN');
});

router.get('/info',(req,res,next)=>{
    res.send({
        success : true,
        user : req.user,
    })
})

// 

// passport.authenticate('google', { scope: ['profile'], successRedirect: process.env.FRONTEND_HOME_URL })







//testing Route 

router.get('/test', requireSignIn, isAdmin, testController);



//Protected admin Route

router.get('/admin-auth', requireSignIn, isAdmin, isProtected);

//Protected user Route

router.get('/user-auth', requireSignIn, isProtected)


//reset pass link

router.post('/forgot-password', getResetPasswordLink);

//verufy for correct  user using token

router.get('/reset-password/:id/:token', getPasswordMatch);

//change pass

router.post('/:id/:token', getPasswordChange);

//update Profile

router.put('/update-profile', requireSignIn, getProfileUpdated);

//get all user orders

router.get(`/orders`, requireSignIn, getAllOrders);


//get all admin orders

router.get(`/admin-orders`, requireSignIn, isAdmin, getAdminOrders)

//update order status 

router.put(`/order-status/:orderId`, requireSignIn, isAdmin, updateOrderStatus);

export default router;
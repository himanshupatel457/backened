import express from "express";
import morgan from "morgan";
import authRoutes from "./routes/authRoute.js"
import categoryRoutes from './routes/categoryRoutes.js'
import productRoutes from './routes/productRoutes.js'
import cors from "cors";
/////////////////////////////////////////////////////////////////////////////////////////
import session from "express-session";
////////////////////////////////////////////////////////////////////////////////////////

import { googlePassportConnection } from "./utils/googleAuth.js";
import passport from "passport";
const app = express();

// General Middlewares for everyrequest
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

///////////////////////////////////////////////////////////////////////////////////////////
//GOOGLE LOGIN TEST TO BE REMOVED IF FAILS

//required Middlewares

app.use(session({
    secret: "tyjbhkmljhgfchjjkiuyh",
    resave: false,
    saveUninitialized: false,
    // cookie: {
    //     secure: true,
    //     httpOnly: false,
    //     maxAge: 3600000,
    // },
}))


app.use(passport.initialize());
app.use(passport.session());
app.use(passport.authenticate("session"));
googlePassportConnection();











////////////////////////////////////////////////////////////////////////////////////////////

//gathering all routes

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/category', categoryRoutes);
app.use('/api/v1/products', productRoutes);

app.get("/", (req, res, next) => {
    res.send('<h1> I am back </h1>');
});



export default app;
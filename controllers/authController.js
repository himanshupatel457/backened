import Order from "../models/orderModel.js";
import User from "../models/userModel.js";
import { hashPassword, comparePassword } from "../utils/authUtils.js";
import JWT from "jsonwebtoken";
import nodemailer, { createTransport } from 'nodemailer';


//Below is Mailer's Transporter creation

const transporter = createTransport({
    service: 'gmail',
    auth: {
        user: 'foodkart457@gmail.com',
        pass: process.env.PASS
    }
});




export const signUpController = async (req, res, next) => {
    try {
        const { name, email, password, address, phoneNumber, role } = req.body;

        // check if name,email,pass,addres,phone,role is missing 

        if (!name) return res.send({ message: `name is missing` });
        if (!email) return res.send({ message: `email is missing` });
        if (!password) return res.send({ message: `password is missing` });
        if (!address) return res.send({ message: `address is missing` });
        if (!phoneNumber) return res.send({ message: `phoneNumber is missing` });
        // if(!role) role = 1;
        if (!role) return res.send({ message: `role is missing` });


        //check for existing user ans deliver a response as per it

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(200).send({
                success: false,
                message: `Already an existing Please Loging to Continue `,
                existingUser
            })
        }
        // this is for new User 
        const hashedPassword = await hashPassword(password);
        // save hashed password in database
        const user = new User({ name, email, phoneNumber, address, role, password: hashedPassword });
        user.save();

        return res.status(201).send({
            success: true,
            message: `User signedUp successflly`
        })
    } catch (error) {
        // console.log(`Error in signUpcontroller : ${error}`);
        res.status(500).send({
            success: false,
            message: `Error in SIGNUP CONTROLLER : ${error}`
        })
    }
}



// LOGIN CONTROLLER 

export const loginController = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        //validate email and pass availability
        if (!email || !password) {
            return res.status(200).send({
                success: false,
                message: `Credentials are Missing `
            });
        }

        const user = await User.findOne({ email });
        //check if user found or not 

        if (!user) {
            console.log('USER NOT FOUND DURING LOGIN ');
            return res.status(200).send({
                success: false,
                message: `User Not Registered`
            });
        }
        // console.log(user._id);

        const matched = await comparePassword(password, user.password);
        // console.log('I AM HERE');
        if (!matched) {
            return res.status(200).send({
                success: false,
                message: `INVALID CREDENTIALS`
            })
        }

        //if everything is rigth generate a Token 
        const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: "7d" });

        //Now send this token
        res.status(200).send({
            success: true,
            message: `LOGIN SUCCESSFUL`,
            user: {
                name: user.name,
                email: user.email,
                phoneNumber: user.phoneNumber,
                address: user.address,
                role: user.role
            },
            token
        });
    }
    catch (err) {
        console.log(err);
        res.status(500).send({
            success: false,
            message: `Error in LOGIN CONTROLLER : ${err}`
        })
    }
}



// export const loginController = async (req, res, next) => {
//     try {
//         const { email, password } = req.body;

//         // Validate email and password availability
//         if (!email || !password) {
//             return res.status(400).json({
//                 success: false,
//                 message: 'Invalid credentials. Please provide both email and password.',
//             });
//         }

//         const user = await User.findOne({ email });

//         // Check if user exists
//         if (!user) {
//             console.log('USER NOT FOUND DURING LOGIN');
//             return res.status(401).json({
//                 success: false,
//                 message: 'User not found. Please check your email or password.',
//             });
//         }

//         const matched = await comparePassword(password, user.password);

//         if (!matched) {
//             return res.status(401).json({
//                 success: false,
//                 message: 'Invalid credentials. Please check your email or password.',
//             });
//         }

//         // Generate a token
//         const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: '7d' });

//         // Send the token and user details
//         res.status(200).json({
//             success: true,
//             message: 'Login successful',
//             user: {
//                 name: user.name,
//                 email: user.email,
//                 phoneNumber: user.phoneNumber,
//                 address: user.address,
//                 role: user.role,
//             },
//             token,
//         });
//     } catch (err) {
//         console.log(err);
//         res.status(500).json({
//             success: false,
//             message: `Error in LOGIN CONTROLLER: ${err}`,
//         });
//     }
// };


//GOOGLE LOGIN CONTROLLER IIN TESTING 









export const testController = (req, res, next) => {

    res.status(200).send({
        message: 'this is protected Route'
    })
}



// Protected confirmin middleware

export const isProtected = (req, res, next) => {
    res.status(200).send({
        isProtected: true
    })
}

//forgot pass  reset link 

export const getResetPasswordLink = async (req, res, next) => {
    const { email } = req.body;
    console.log(email);
    if (!email) {
        return res.status(401).send({
            success: false,
            message: 'Enter User Mail ID'
        })
    }


    const user = await User.findOne({ email });
    if (!user) {
        return res.status(200).send({
            success: false,
            message: 'user not registered'
        });
    }

    try {
        const token = JWT.sign({ _id: user._id, }, process.env.JWT_SECRET_KEY, {
            expiresIn: '5m'
        })
        console.log("token : ", token);

        const setToken = await User.findByIdAndUpdate({ _id: user._id }, { resetToken: token, resetTokenExpiration: Date.now() + 60 * 5 * 1000 }, { new: true });
        console.log(setToken, " ", token);
        if (setToken) {
            const mailOptions = {
                from: "foodkart457@gmail.com",
                to: email,
                subject: ' [Do not Share ]Ecommerce Kart : Reset Password link',
                html: `
                    <div>
                <p style="font-size: 16px; margin-bottom: 10px;">
                    Dear User,
                </p>
                <p style="font-size: 16px; margin-bottom: 10px;">
                    You have requested to reset your password. Please click on the link below to reset your password:
                </p>
                <p style="font-size: 16px; margin-bottom: 10px;">
                  Reset Password Link:
                  <a href="http://localhost:3000/reset-password/${user._id}/${token}" style="font-size: 16px; text-decoration: underline; color: #000000;">
                    http://localhost:3000/reset-password/${user._id}/${token}
                  </a>
                </p>
                <p style="font-size: 16px;">
                  If you didn't request this password reset, please ignore this email.
                </p>
              </div>
            `,
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.log(error);
                    res.status(401).send({
                        success: false,
                        message: 'mail not sent !'
                    })
                }
                else {
                    console.log(`Email sent succefully `, info.response);
                    res.status(201).send({
                        success: true,
                        message: `mail Sent Successfully`
                    })
                }
            })
        }


    }
    catch (error) {
        console.log(error);
        return res.status(401).send({
            success: false,
            message: 'user not registered'
        });
    }
};




//verify user for valid token

export const getPasswordMatch = async (req, res, next) => {
    const { id, token } = req.params;

    console.log(id, " ", token);

    try {
        const user = await User.findOne({ _id: id, resetToken: token });
        const verifyUser = JWT.verify(token, process.env.JWT_SECRET_KEY);
        if (user && verifyUser._id) {
            res.status(201).send({
                success: true,
                message: 'User verfied'
            })

        }
        else {
            res.status(401).send({
                success: false,
                message: 'User not  found or not registered'
            })
        }
    } catch (error) {
        console.log(error);
        res.status(401).send({
            success: false,
            message: 'User not  found or not registered'
        })
    }
}



export const getPasswordChange = async (req, res, next) => {
    const id = req.params.id;
    const token = req.params.token;
    const { password } = req.body;

    try {
        const user = await User.findOne({ _id: id, resetToken: token });
        const verifyUser = JWT.verify(token, process.env.JWT_SECRET_KEY);


        if (user && verifyUser._id) {

            const newPassword = await hashPassword(password);
            const setUserPass = await User.findByIdAndUpdate({ _id: id }, { password: newPassword, resetToken: null, resetTokenExpiration: null });
            // setUserPass.save();
            res.status(201).send({
                success: true,
                message: 'passworrd changed'
            })

        }
        else {
            res.status(401).send({
                success: false,
                message: 'User not  found or not registered'
            })
        }

    } catch (error) {
        console.log(error);
        res.status(401).send({
            success: false,
            message: 'User not  found or not registered'
        })
    }
}





export const getProfileUpdated = async (req, res, next) => {
    try {
        const { name, email, password, address, phoneNumber } = req.body;
        const user = await User.findById(req.user._id);
        if (password && password < 6) {
            return res.json({ error: 'Password must be atleast 6 digits' });
        }

        const hashedPassword = password ? await hashPassword(password) : undefined
        const updatedUser = await User.findByIdAndUpdate(req.user._id, {
            name: name || user.name,
            password: hashedPassword || user.password,
            address: address || user.address,
            phoneNumber: phoneNumber || user.phoneNumber,

        }, { new: true })
        res.status(201).send({
            success: true,
            message: `Profile updated successully`,
            updatedUser
        })
    } catch (error) {
        console.log(error);
        res.status(400).send({
            success: false,
            message: 'problem in update profile controller',
            error

        })
    }
}


export const getAllOrders = async (req, res, next) => {
    try {
        const orders = await Order.find({ buyer: req.user._id }).populate('products', '-photo').populate('buyer', 'name');
        res.send(orders);

    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: 'some error in getting all orders',
            error
        })
    }
}


export const getAdminOrders = async (req, res, next) => {
    try {
        const orders = await Order.find({}).populate('products', '-photo').populate('buyer', 'name').sort({ createdAt: "-1" });
        res.send(orders);

    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: 'some error in getting all orders',
            error
        })
    }
}



export const updateOrderStatus = async (req, res, next) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;
        const orders = await Order.findByIdAndUpdate(orderId, { status }, { new: true });
        res.json(orders)
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'problem in updating order status',
            error,
        })
    }
}
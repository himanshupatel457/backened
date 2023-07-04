import mongoose from "mongoose";
import validator from "validator";



const Schema = mongoose.Schema;

const GuserSchema = new Schema({
    googleID: {
        type: String,
        unique: true,
        required :true,
    },
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        // required: true,
        unique: true,
        trim: true,
    },
    address: {
        type: String,
        // required: true,
        default : null,
    },
    phoneNumber: {
        type: Number,
        // required: true,
        default : null,
    },
    role: {
        type: Number,
        default: 1
    },
},
    {
        timestamps: true
    })

const GUser = mongoose.model('GUser', GuserSchema);

export default GUser;





// import mongoose from "mongoose";
// import validator from "validator";

// const { Schema } = mongoose;

// const guserSchema = new Schema({
//     googleID: {
//         type: String,
//         unique: true,
//         default: null,
//     },
//     name: {
//         type: String,
//         trim: true,
//     },
//     email: {
//         type: String,
//         required: true,
//         unique: true,
//         trim: true,
//         validate: {
//             validator: validator.isEmail,
//             message: 'Invalid email address',
//         },
//     },
//     address: {
//         type: String,
//     },
//     phoneNumber: {
//         type: Number,
//     },
//     role: {
//         type: Number,
//         default: 1,
//     },
// }, {
//     timestamps: true,
// });

// const GUser = mongoose.model('GUser', guserSchema);

// export default GUser;

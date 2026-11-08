// const { Schema, model } = require("mongoose");

// const userSchema = new Schema(
//     {
//         name: {
//             type: String,
//             required: [true, "Name is required"],
//             trim: true,
//         },

//         email: {
//             type: String,
//             required: [true, "Email is required"],
//             trim: true,
//             unique: true,
//             lowercase: true,
//         },

//         password: {
//             type: String,
//             required: [true, "Password is required"],
//             select: false,
//         },

//         phone: {
//             type: String,
//             unique: true,
//             default: null,
//         },

//         profileImage: {
//             type: String,
//             default: null,
//         },

//         role: {
//             type: String,
//             enum: ["customer", "admin"],
//             default: "customer",
//         },

//         // status: {
//         //     type: String,
//         //     enum: ["active", "inactive", "blocked"],
//         //     default: "active",
//         // },

//         isActive:{
//             type: Boolean,
//             default: true,
//         },

//         isEmailVerified: {
//             type: Boolean,
//             default: false,
//         },
//         // createdAt: {
//         //     type: Date,
//         //     default: Date.now,
//         // },
//         // updatedAt: {
//         //     type: Date,
//         //     default: Date.now,
//         // },
//     },
//     {
//         timestamps: true,
//         versionKey: false,
//     }
// );

// const User = model("User", userSchema);

// module.exports = User;


// // const userSchema = new Schema({}, {})


const users = [
    {
        id: "1",
        name: "John Doe",
        email: "john.doe@example.com",
        age: 30,
    },
];

module.exports = users;
module.exports = [];

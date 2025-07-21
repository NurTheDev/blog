const mongoose = require("mongoose");
const {Schema} = mongoose;

const userSchema = new Schema({
    name:{
        type: String,
        required: true,
        trim: true,
        minLength: [3, "Name must be at least 3 characters long"],
        maxLength: [32, "Name must be at most 32 characters long"],
    }, email:{
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            "Please provide a valid email",
        ],
    },
    password:{
        type: String,
        required: true,
        minLength: [6, "Password must be at least 6 characters long"]
    },
    avatar:{
        type: String,
        default: "https://img.freepik.com/premium-vector/person-with-blue-shirt-that-says-name-person_1029948-7040.jpg?semt=ais_hybrid&w=740",
        trim: true
    }, phone:{
        type: String,
        trim: true,
        unique: true,
        sparse: true,
        required: false,
        match: [/^\d{10}$/, 'Phone number must be 10 digits long'],
    },
    address: {
        type: String,
        trim: true,
    },
    country: {
        type: String,
        trim: true,
    },
    city: {
        type: String,
        trim: true,
    },
    zipCode: {
        type: String,
        trim: true,
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    blogs: [{
        type: Schema.Types.ObjectId,
        ref: "blog"
    }]
},{
    versionKey: false,
    timestamps: true
})
const userModel = mongoose.model("user", userSchema);
module.exports = userModel

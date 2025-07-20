const userModel = require("../models/user.model");
const bcrypt = require("bcrypt");
const validation = require("../helpers/validation");

/**
 * Register a new user
 * @param req
 * @param res
 * @returns {Promise<*>}
 */
exports.register = async(req, res)=>{
    const {name, email, password}= req.body;
    const validationResponse = validation(req);
    if(!validationResponse.status) return res.status(400).json({message:validationResponse.message})
    if(!email.includes("@")) return res.status(400).json({message:"Please enter valid email"})
    if(password.length < 6) return res.status(400).json({message:"Password must be at least 6 characters long"})
    try {
        const isEmailTaken = await userModel.findOne({email: email});
        if(isEmailTaken) return res.status(400).json({message:"Email already in use"})
        const salt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(password, salt)
        const user = await userModel.create({name, email, password: hashPassword})
        if(!user) return res.status(400).json({message:"Error registering user"})
        res.status(201).json({message:"User registered successfully"})
    }catch (error) {
        console.error("Error registering user:", error);
        res.status(500).json({ message: "Error registering user" });
    }
}

/**
 * Login a user
 * @param req
 * @param res
 * @returns {Promise<*>}
 */
exports.login = async(req, res)=>{
    const {email, password}= req.body;
    const isValid = validation(req);
    if(!isValid.status) return res.status(400).json({message:isValid.message})
    if(!isValid.status) return res.status(400).json({message:isValid.message})
    if(!email.includes("@")) return res.status(400).json({message:"Please enter valid email"})
    if(password.length < 6) return res.status(400).json({message:"Password must be at least 6 characters long"})
    try{
        const user = await userModel.findOne({email: email});
        if(!user) return res.status(400).json({message:"User not found"})
        const isPasswordValid = await bcrypt.compare(password, user.password)
        if(!isPasswordValid) return res.status(400).json({message:"Invalid password"})
        res.status(200).json({message:"User logged in successfully"})
    }catch(error){
        console.error("Error logging in Auth.controller:", error);
        res.status(500).json({ message: "Error logging in user" });
    }
}
/**
 * Update a user
 * @param req
 * @param res
 * @returns {Promise<*>}
 */
exports.updateUser = async(req, res)=>{
    const {name, email, password, avatar, address, phone, country, city, zipCode} = req.body;
    const {id} = req.params
    try {
        const user = await userModel.findById(id);
        if (!user) return res.status(400).json({message: "User not found"})
        if (name) user.name = name;
        if (email) user.email = email;
        if (password) user.password = password;
        if (avatar) user.avatar = avatar;
        if (address) user.address = address;
        if (phone) user.phone = phone;
        if (country) user.country = country;
        if (city) user.city = city;
        if (zipCode) user.zipCode = zipCode;
       const updatedUser = await user.save();
        res.status(200).json({message: "User updated successfully", user: updatedUser})
    }catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ message: "Error updating user" });
    }
}

const mongoose = require('mongoose');
require('dotenv').config();
const connectDB = async () => {
    try {
        const DB_URI = process.env.MONGODB_URI
        if(!DB_URI){
            throw new Error('MONGODB_URI is not defined in .env file')
        }
        const connection = await mongoose.connect(DB_URI);
        console.log("Connected to MongoDB" + connection.connection.host);
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        process.exit(1);
    }
}
module.exports = connectDB

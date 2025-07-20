const connection = require("./src/database/connectDB");
const app = require("./src/app");
require("dotenv").config();
const port = process.env.PORT || 3000;
connection().then(()=>{
    app.listen(port, ()=>{
        console.log(`Server is running on port ${port}, visit: http://localhost:${port}`);
    })
}).catch((err)=>{
    console.log("Error connecting to MongoDB:", err);
    process.exit(1);
})

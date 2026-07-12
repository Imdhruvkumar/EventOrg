const express = require("express");
const cors = require("cors");
const dotenv = require('dotenv');
const connectDB= require('./config/db.js');
const authRoutes = require('./routes/auth.js')
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

//routes

app.use('./api/auth',authRoutes);

connectDB();
const PORT = process.env.PORT || 5000;

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`)
});
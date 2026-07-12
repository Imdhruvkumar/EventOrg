const User = require('../models/User');


const registerUser = async (req,res)=>{
    const {name,email,password} = req.body;
    let userExist = await User.findOne({email});
    if (userExist) {
        return res.status(501).json({message:"User already exists"});
    }
    const salt = await bcrypt.genSalt(10);
    const hashPassword= await bcrypt.hash(password,salt)
    try {
        const user = new User({name,email,password:hashPassword});
        await user.save();
        res.status(201).json({message:"User register successfully"});

        const otp = Math.floor(100000 + Math.random * 900000).toString();
        console.log(`OTP for ${email}:${otp}`);
    } catch (error) {
        req.status(400).json({message:error.message});
    }
};

module.exports={
    registerUser
};
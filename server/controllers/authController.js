const User = require('../models/User');
const {sendOTPEmail} = require('../utils/email.js');
const Otp = require('../models/Otp');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs')
const generateToken =  (id,role) => {
    return jwt.sign({id ,role},process.env.JWT_SECRET,{expiresIn:'7d'});
}

const registerUser = async (req,res)=>{
    const {name,email,password} = req.body;
    let userExist = await User.findOne({email});
    if (userExist) {
        return res.status(501).json({message:"User already exists"});
    }
    const salt = await bcrypt.genSalt(10);
    const hashPassword= await bcrypt.hash(password,salt)
    try {
        const user = await User.create({name,email,password:hashPassword,role:'user',isVerified:false });


        const otp = Math.floor(100000 + Math.random()* 900000).toString();
        console.log(`OTP for ${email}:${otp}`);
        await Otp.create({email,otp,action:'account_verification'});

        await sendOTPEmail(email,otp,'account_verification');
        res.status(201).json({
            message:'User registered successfully. Please check your email for OTP to verify your account. ',
            email:user.email
        });
        
    } catch (error) {
        res.status(400).json({message:error.message});
    }
};

const loginUser = async (req,res) =>{
    const {email,password} = req.body;
    let user = await User.findOne({email});
    if(!user){
        return res.status(400).json({error:'Invalid credentials, Please Sing Up first'});
    }
    const isMatch = await bcrypt.compare(password,user.password);
    if (!isMatch) {
        return res.status(400).json({error:'Invalid credentials'});
    }

    if (!user.isVerified && user.role === 'user') {
       const otp = Math.floor(100000 + Math.random()* 900000).toString();
       await Otp.deleteMany({email,action:'account_verification'});
       await Otp.create({email,otp,action:'account_verification'});
        await sendOTPEmail(email,otp,'account_verification'); 
        return res.status(400).json({
            error:'Account not verified. A new OTP has been sent to your email.'
        });
    }
    

     res.json({
        message:'Login successful',
        _id: user._id,
        name: user.name,
        email:user.email,
        role:user.role,
        token: generateToken(user._id, user.role)

    })
};

const verifyOtp = async (req,res) =>{
    const {email,otp} = req.body;
    const otpRecord = await Otp.findOne({email,otp,action:'account_verification'});
    if (!otpRecord) {
        return res.status(400).json({message:'Invalid or Expired OTP'});

    }

     const user = await User.findOneAndUpdate({email},{isVerified:true});
    await Otp.deleteMany({email,action:'account_verification'});
    return res.json({
        message:'Account verified successfully, you can now log in',
         _id: user._id,
        name: user.name,
        email:user.email,
        role:user.role,
        token: generateToken(user._id, user.role)
    });

};

module.exports={
    registerUser,
    loginUser,
    verifyOtp
};
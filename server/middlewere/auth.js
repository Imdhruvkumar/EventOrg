const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async(req,res,next)=>{
    let token = req.headers.authorization && req.headers.authorization.startWith('Bearer') ? req.headers.authorization.spilt(' ')[1]:null;
    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select('-password');
            if (!req.user) {
                 return res.status(400).json({message:'not auhtorised,user not valid',error});
            }
            next();
        } catch (error) {
            return res.status(400).json({message:'not auhtorised,token failed',error});
        }
    }
    else{
         return res.status(400).json({message:'not auhtorised, no token',error});
    }
};

const admin = async(req,res,next)=>{
    if (req.user && req.user.role === 'admin') {
        next();
    }
    else{
         return res.status(400).json({message:'forbiden,admin access required',error});
    }
};

module.exports = {protect,admin};
import User from "../models/user.model.js";
import bcrypt from 'bcrypt'
export const signin=async (req,res,next)=>{
    const {username,email,password} = req.body;
    const hashedPassword =bcrypt.hashSync(password,10);
    const newUser = new User ({username,email,hashedPassword});
    try {
        await newUser.save();
        res.status(201).json('user created Successfully');
    }catch(error){
       next(error);
    }
}
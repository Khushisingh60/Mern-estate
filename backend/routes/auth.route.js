import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import authmiddleware from '../middleware/authmiddleware.js';

const router = express.Router();

// Register Route
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();
    return res.status(201).json({ success: true, message: 'Account created successfully' });
  } catch (error) {
    console.error('Error in /register:', error.message);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

router.post('/login',async (req,res)=>{
    try{
        const {email,password}=req.body;
        const user=await User.findOne({email})
        if(!user){
            return res.status(401).json({success:false,message:"User not exist"})
        }

        const checkpassword= await bcrypt.compare(password,user.password)

        if(!checkpassword){
            return res.status(401).json({success:false,message:"wrong credentials"})
        }

        const token = jwt.sign({id: user._id},"secretkeyofrealestateapp123@#",{expiresIn:"5h"})

        return res.status(200).json({success:true,token,user:{name: user.name},message:"logged in Successfully"})
    }catch(error){
        return res.status(500).json({success:false,message:"Error in login"})
    }
})

router.get('/verify',authmiddleware,async (req,res)=>{
    return res.status(200).json({success:true ,user:req.user})
})

router.post('/google', async(req,res)=>{
  try{
    const user = await User.findOne({email: req.body.email})
    if(user){
      const token = jwt.sign({id:user._id},"secretkeyofrealestateapp123@#" );
      const {password: pass,...rest}=user._doc;
      res
       .cookie('access_token',token,{httpOnly:true})
       .status(200)
       .json(rest)
    }else{
      const generatePassword = Math.random().toString(36).slice(-8);
      const hashedPassword = await bcrypt.hash(generatePassword, 10);
      const newUser= new User({username: req.body.name.split(" ").join("").toLowerCase() +
         Math.random().toString(36).slice(-4),email:req.body.email,password:hashedPassword, avatar: req.body.photo});
      await newUser.save();
      const token=jwt.sign({id:newUser._id},"secretkeyofrealestateapp123@#");
      const {password: pass, ...rest}=newUser._doc;
      res.cookie('access_token',token,{httpOnly:true}).status(200).json(rest);
    }
  }catch (error) {
    console.error("Error in Google Auth:", error);
    res.status(500).json({ message: "Internal server error" });
  }
  
})

export default router;

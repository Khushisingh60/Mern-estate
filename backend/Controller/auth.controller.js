import User from '../models/user.model.js';
import bcrypt from 'bcrypt';
import { errorHandler } from '../utils/error.js';
import jwt from 'jsonwebtoken';

export const signup = async (req, res, next) => {
  console.log(req.body);
  const { username, email, password } = req.body;

  if (!password) {
    return res.status(400).json({ error: 'Password is required' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();
    res.status(201).json('User created successfully!');
  } catch (error) {
    console.error(error);
    next(error);
  }
};



// export const signin = async (req, res, next) => {
//   const { email, password } = req.body;
//   console.log(req.body);

//   try {
//     const validUser = await User.findOne({ email });
//     if (!validUser) return next(errorHandler(404, 'User not found!'));

//     const validPassword = await bcrypt.compare(password, validUser.password);
//     if (!validPassword) return next(errorHandler(401, 'Wrong credentials!'));

//     const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);
//     console.log('Generated Token:', token);

//     const { password: pass, ...rest } = validUser._doc;

//     res
//       .cookie('access_token', token, { httpOnly: true })
//       .status(200)
//       .json(rest);

//     console.log('Set-Cookie Header:', res.getHeaders()['set-cookie']); // Log the Set-Cookie header
//   } catch (error) {
//     next(error);
//   }
// };



// export const signin = async (req, res, next) => {
//   const { email, password } = req.body;
//   console.log(req.body);

//   try {
//     const validUser = await User.findOne({ email });
//     if (!validUser) return next(errorHandler(404, 'User not found!'));

//     const validPassword = await bcrypt.compare(password, validUser.password);
//     if (!validPassword) return next(errorHandler(401, 'Wrong credentials!'));

//     // Generate JWT token
//     const token = jwt.sign({ userId: validUser._id }, 'secretkeyofrealestateapp123@#', { expiresIn: '5h' });

    

//     // Destructure to exclude password from the response
//     const { password: pass, ...rest } = validUser._doc;

//     // Send token in the response body
//     res.status(200).json({
//       ...rest,
//       token, // Add token to the response so the client can use it
//     });
//   } catch (error) {
//     next(error);
//   }
// };
import nodemailer from 'nodemailer';

const otpStore = {}; // Temporary store for OTPs (Use Redis or DB in production)

// Configure Nodemailer
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'khushisingh0598@gmail.com', // Your email
    pass: "tqkb lcdu alyt igyd", // App password
  },
});

export const sendOtp = async (req, res, next) => {
  const { email } = req.body;
  
  if (!email) return res.status(400).json({ error: 'Email is required' });

  try {
    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // Generate 6-digit OTP
    console.log(otp);
    otpStore[email] = { otp, expiresAt: Date.now() + 5 * 60 * 1000 }; // Store OTP for 5 minutes

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your OTP Code',
      text: `Your OTP code is ${otp}. It expires in 5 minutes.`,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'OTP sent successfully!' ,
      success:true
     });
  } catch (error) {
    next(error);
  }
};

export const verifyOtp = async (req, res, next) => {
  const { email, otp } = req.body;
  
  if (!email || !otp) return res.status(400).json({ error: 'Email and OTP are required' });

  try {
    const storedOtpData = otpStore[email];
    if (!storedOtpData || storedOtpData.otp !== otp || Date.now() > storedOtpData.expiresAt) {
      return res.status(400).json({ error: 'Invalid or expired OTP' });
    }

    delete otpStore[email]; // Remove OTP after successful verification
    res.status(200).json({ message: 'OTP verified successfully!',success:true });
  } catch (error) {
    console.log(error);
    next(error);
  }
};


export const signin = async (req, res, next) => {
  const { email, password,role } = req.body;
  console.log(req.body);

  try {
    const validUser = await User.findOne({ email });
    if (!validUser) return next(errorHandler(404, 'User not found!'));

    
    console.log(password);
    // console.log(validUser.password);
    
     
    const validPassword = await bcrypt.compare(password, validUser.password);
    console.log(password);
    console.log(validUser.password);
    if (!validPassword) return next(errorHandler(401, 'Wrong credentials!'));

    if (validUser.role !== role) {
      return next(errorHandler(403, 'Unauthorized: Incorrect role!'));
    }


    // Generate JWT token with role included
    const token = jwt.sign(
      { userId: validUser._id, role: validUser.role }, // Include role
      'secretkeyofrealestateapp123@#',
      { expiresIn: '5h' }
    );

    // Destructure to exclude password from the response
    const { password: pass, ...rest } = validUser._doc;

    // Send token and role in the response
    res.status(200).json({
      ...rest,
      token, // Add token
      role: validUser.role, // Add role
    });
  } catch (error) {
    next(error);
  }
};


export const google = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      const { password: pass, ...rest } = user._doc;
      res
        .cookie('access_token', token, { httpOnly: true })
        .status(200)
        .json(rest);
    } else {
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);
      const hashedPassword = await bcrypt.hash(generatedPassword, 10);
      const newUser = new User({
        username:
          req.body.name.split(' ').join('').toLowerCase() +
          Math.random().toString(36).slice(-4),
        email: req.body.email,
        password: hashedPassword,
        avatar: req.body.photo,
      });
      await newUser.save();
      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
      const { password: pass, ...rest } = newUser._doc;
      res
        .cookie('access_token', token, { httpOnly: true })
        .status(200)
        .json(rest);
    }
  } catch (error) {
    next(error);
  }
};

export const signOut = async (req, res, next) => {
  try {
    // No need to clear the cookie as we're not using cookies anymore
    // In JWT-based authentication, client-side should remove the token
    
    // Optionally, if you want to log out on the server side as well,
    // you could invalidate the token (though JWTs are stateless, so they can't be invalidated easily on the server).
    // But it's a good practice to inform the client to delete the token from localStorage/sessionStorage.

    res.status(200).json('User has been logged out!'); // Send logout confirmation
  } catch (error) {
    next(error);
  }
};


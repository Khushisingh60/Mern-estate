
// import express from 'express';
// import mongoose from 'mongoose';
// import dotenv from 'dotenv';
// import userRouter from './routes/user.route.js';
// import authRouter from './routes/auth.route.js';
// import listingRouter from './routes/listing.route.js';
// import cookieParser from 'cookie-parser';
// import path from 'path';
// import cors from 'cors';
// import User from './models/user.model.js';
// dotenv.config();

// mongoose
//   .connect(process.env.MONGO)
//   .then(() => {
//     console.log('Connected to MongoDB!');
//   })
//   .catch((err) => {
//     console.log(err);
//   });

//   const __dirname = path.resolve();

// const app = express();

// app.use(express.json());
// app.use(cookieParser());



// app.use(cors({
//   origin: 'http://localhost:5173',
//   credentials: true,
//   allowedHeaders: ['Authorization', 'Content-Type'],
// }));


// app.listen(3000, () => {
//   console.log('Server is running on port 3000!');
// });

// app.post('/api/user/save/:userId', async (req, res) => {
//   const { userId } = req.params;
//   const { listingId } = req.body;

//   try {
//     const user = await User.findById(userId);
//     if (!user) return res.status(404).json({ success: false, message: 'User not found' });

//     if (user.savedPosts.includes(listingId)) {
//       // If listingId exists, remove it (unsave)
//       user.savedPosts = user.savedPosts.filter((id) => id !== listingId);
//     } else {
//       // If listingId does not exist, add it (save)
//       user.savedPosts.push(listingId);
//     }

//     await user.save();
//     res.status(200).json({ success: true, savedPosts: user.savedPosts });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: 'Server error' });
//   }
// });

// app.delete('/api/user/unsave/:userId', async (req, res) => {
//   const { userId } = req.params;
//   const { listingId } = req.body; 

//   if (!listingId) {
//     return res.status(400).json({ success: false, message: 'Listing ID is required' });
//   }

//   console.log('Listing ID to remove:', listingId);

//   try {
//     // Fetch the user by ID
//     const user = await User.findById(userId);

//     if (!user) {
//       return res.status(404).json({ success: false, message: 'User not found' });
//     }

//     console.log('Saved posts before removing:', user.savedPosts);

//     // Ensure listingId is compared as ObjectId
//     const listingObjectId = mongoose.Types.ObjectId.isValid(listingId) 
//       ? new mongoose.Types.ObjectId(listingId) 
//       : null;

//     if (!listingObjectId) {
//       return res.status(400).json({ success: false, message: 'Invalid listing ID' });
//     }

//     // Filter out the listingId from savedPosts
//     user.savedPosts = user.savedPosts.filter((id) => !id.equals(listingObjectId));

//     console.log('Saved posts after removing:', user.savedPosts);

//     // Save the updated user document
//     await user.save();

//     res.status(200).json({ success: true, savedPosts: user.savedPosts });
//   } catch (error) {
//     console.error('Error while unsaving the listing:', error);
//     res.status(500).json({ success: false, message: 'Server error', error });
//   }
// });


// app.use('/api/user', userRouter);
// app.use('/api/auth', authRouter);
// app.use('/api/listing', listingRouter);


// app.use(express.static(path.join(__dirname, '/client/dist')));

// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
// })

// app.use((err, req, res, next) => {
//   const statusCode = err.statusCode || 500;
//   const message = err.message || 'Internal Server Error';
//   return res.status(statusCode).json({
//     success: false,
//     statusCode,
//     message,
//   });
// });

import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRouter from './routes/user.route.js';
import authRouter from './routes/auth.route.js';
import listingRouter from './routes/listing.route.js';
import cookieParser from 'cookie-parser';
import path from 'path';
import cors from 'cors';
import User from './models/user.model.js';
import nodemailer from 'nodemailer';
import Alert from './models/alert.model.js'
import paymentRoutes from './routes/payment.route.js'
dotenv.config();

mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log('Connected to MongoDB!');
  })
  .catch((err) => {
    console.log(err);
  });

const __dirname = path.resolve();

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
  allowedHeaders: ['Authorization', 'Content-Type'],
}));

// Configure nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: "khushisingh0598@gmail.com",
    pass: "feyx zrve ewvb gcap",
  },
});

// Temporary storage for OTPs
const otpStore = {}; // { email: { otp: '123456', expires: Date.now() + 300000 } }

// Generate OTP function
const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

// Send OTP
app.post('/api/auth/send-otp', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ success: false, message: 'Email is required' });

  const otp = generateOtp();
  otpStore[email] = { otp, expires: Date.now() + 300000 }; // OTP expires in 5 minutes

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Your OTP for Verification',
    text: `Your OTP is ${otp}. It is valid for 5 minutes.`,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.json({ success: true, message: 'OTP sent successfully' });
  } catch (error) {
    console.error('Error sending OTP:', error);
    res.status(500).json({ success: false, message: 'Failed to send OTP' });
  }
});

// Verify OTP
app.post('/api/auth/verify-otp', (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) return res.status(400).json({ success: false, message: 'Email and OTP are required' });

  const record = otpStore[email];
  if (!record || record.expires < Date.now()) {
    return res.status(400).json({ success: false, message: 'OTP has expired or is invalid' });
  }

  if (record.otp !== otp) {
    return res.status(400).json({ success: false, message: 'Invalid OTP' });
  }

  delete otpStore[email]; // Remove OTP after successful verification
  res.json({ success: true, message: 'OTP verified successfully' });
});

// Signup endpoint
app.post('/api/auth/signup', async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ success: false, message: 'All fields are required' });
  }

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email is already registered' });
    }

    // Create new user
    const newUser = new User({ username, email, password });
    await newUser.save();

    res.status(201).json({ success: true, message: 'User registered successfully' });
  } catch (error) {
    console.error('Error during signup:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.listen(3000, () => {
  console.log('Server is running on port 3000!');
});

app.post('/api/user/save/:userId', async (req, res) => {
  const { userId } = req.params;
  const { listingId } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    if (user.savedPosts.includes(listingId)) {
      // If listingId exists, remove it (unsave)
      user.savedPosts = user.savedPosts.filter((id) => id !== listingId);
    } else {
      // If listingId does not exist, add it (save)
      user.savedPosts.push(listingId);
    }

    await user.save();
    res.status(200).json({ success: true, savedPosts: user.savedPosts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.delete('/api/user/unsave/:userId', async (req, res) => {
  const { userId } = req.params;
  const { listingId } = req.body; 

  if (!listingId) {
    return res.status(400).json({ success: false, message: 'Listing ID is required' });
  }

  console.log('Listing ID to remove:', listingId);

  try {
    // Fetch the user by ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    console.log('Saved posts before removing:', user.savedPosts);

    // Ensure listingId is compared as ObjectId
    const listingObjectId = mongoose.Types.ObjectId.isValid(listingId) 
      ? new mongoose.Types.ObjectId(listingId) 
      : null;

    if (!listingObjectId) {
      return res.status(400).json({ success: false, message: 'Invalid listing ID' });
    }

    // Filter out the listingId from savedPosts
    user.savedPosts = user.savedPosts.filter((id) => !id.equals(listingObjectId));

    console.log('Saved posts after removing:', user.savedPosts);

    // Save the updated user document
    await user.save();

    res.status(200).json({ success: true, savedPosts: user.savedPosts });
  } catch (error) {
    console.error('Error while unsaving the listing:', error);
    res.status(500).json({ success: false, message: 'Server error', error });
  }
});

// Using the imported Alert model

app.get('/api/users/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ email: user.email });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});


app.post('/api/alerts', async (req, res) => {
  console.log(req.body);
  const { email,location, minPrice, maxPrice,city} = req.body;

  try {
    const alert = new Alert({
      location: location || 'any',
      city, // Default to 'any' if no location is specified
      minPrice,
      maxPrice,
      email,
    });

    await alert.save();
    res.json({ success: true, message: 'Alert created successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Failed to create alert.' });
  }
});

// Notify users when a listing is created
const notifyUsers = async (newListing) => {
  try {
    const matchingAlerts = await Alert.find({
      $or: [{ location: 'any' }, { city: newListing.city }],
      minPrice: { $lte: newListing.regularPrice },
      maxPrice: { $gte: newListing.regularPrice },
    });

    for (const alert of matchingAlerts) {
      const mailOptions = {
        from: 'khushisingh0598@gmail.com',
        to: alert.email,
        subject: 'New Matching Listing Alert',
        text: `A new listing matches your criteria:\n\n${newListing.name}\n${newListing.description}\nPrice: $${newListing.regularPrice}\nLocation: ${newListing.city}, ${newListing.colony}\n\nVisit our platform for more details.`,
      };

      await transporter.sendMail(mailOptions);
    }
  } catch (error) {
    console.error('Error sending notification emails:', error);
  }
};


app.use('/api/user', userRouter);
app.use('/api/auth', authRouter);
app.use('/api/listing', listingRouter);

app.use(express.static(path.join(__dirname, '/client/dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
});

app.use('/api/payment', paymentRoutes);
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});


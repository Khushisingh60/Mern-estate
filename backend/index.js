// import express from 'express';
// import cors from 'cors';
// import mongoose from 'mongoose';
// import authRoutes from './routes/auth.route.js';
// import cookieParser from 'cookie-parser';
// import userRouter from './routes/user.route.js';

// const app = express();
// const PORT = 5000;

// // Middleware
// app.use(cors());
// app.use(express.json());

// // Routes
// app.use('/api/auth', authRoutes);
// app.use('/api/user', userRouter);

// app.use(cookieParser());

// // MongoDB Connection
// mongoose
//   .connect('mongodb://localhost:27017/yourDatabaseName', {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(() => console.log('MongoDB Connected'))
//   .catch((error) => console.error('MongoDB Connection Error:', error));

// // Start Server
// app.listen(PORT, () => {
//   console.log(`Server running on http://localhost:${PORT}`);
// });

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


app.use('/api/user', userRouter);
app.use('/api/auth', authRouter);
app.use('/api/listing', listingRouter);


app.use(express.static(path.join(__dirname, '/client/dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
})

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});


// app.post('/api/user/save/:userId', async (req, res) => {
//   try {
//     const { userId } = req.params;
//     const { listingId } = req.body;

//     // Debugging logs
//     console.log('User ID:', userId);
//     console.log('Listing ID:', listingId);

//     // Validate inputs
//     if (!userId || !listingId) {
//       return res.status(400).json({ success: false, message: 'Invalid userId or listingId.' });
//     }

//     // Example database operation
//     const user = await User.findById(userId);
//     if (!user) {
//       return res.status(404).json({ success: false, message: 'User not found.' });
//     }

//     // Add/remove listingId logic
//     if (user.savedPosts.includes(listingId)) {
//       user.savedPosts = user.savedPosts.filter(id => id !== listingId);
//     } else {
//       user.savedPosts.push(listingId);
//     }

//     await user.save();
//     res.json({ success: true, savedPosts: user.savedPosts });
//   } catch (err) {
//     console.error('Error in backend:', err); // Log the full error
//     res.status(500).json({ success: false, message: 'Internal Server Error' });
//   }
// });


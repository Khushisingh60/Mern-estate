import bcrypt from 'bcrypt';
import User from '../models/user.model.js';
import { errorHandler } from '../utils/error.js';
import Listing from '../models/listing.model.js';
import cors from 'cors';
import jwt from 'jsonwebtoken'

export const test = (req, res) => {
  res.json({
    message: 'Api route is working!',
  });
};



export const updateUser = async (req, res, next) => {
  if (req.user.userId !== req.params.id) {
    return next(errorHandler(401, 'You can only update your own account!'));
  }

  try {
    // Check if password is provided and hash it
    if (req.body.password) {
      req.body.password = await bcrypt.hash(req.body.password, 10); // Await the hashing process
    }

    // Update the user data in the database
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          password: req.body.password, // password will now be a string after hashing
          avatar: req.body.avatar,
        },
      },
      { new: true }
    );

    // Exclude the password field from the response
    const { password, ...rest } = updatedUser._doc;

    res.status(200).json(rest);
  } catch (error) {
    console.log(error.message);
    next(error);
  }
};


// export const deleteUser = async (req, res, next) => {
//   if (req.user.id !== req.params.id)
//     return next(errorHandler(401, 'You can only delete your own account!'));
//   try {
//     await User.findByIdAndDelete(req.params.id);
//     res.clearCookie('access_token');
//     res.status(200).json('User has been deleted!');
//   } catch (error) {
//     next(error);
//   }
// };

export const deleteUser = async (req, res, next) => {
  try {
    // Extract the token from the Authorization header
    const authHeader = req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next(errorHandler(401, 'Access Denied. No token provided.'));
    }
    console.log('h1');
    const token = authHeader.split(' ')[1]; // Get the actual token
    console.log('2')
    // Verify the token
    console.log(token);
    const decoded = jwt.verify(token, 'secretkeyofrealestateapp123@#');
    console.log(decoded);
    console.log('3');
    req.user = decoded; // Attach decoded user info to request object
    console.log('4');
    // Check if the user is authorized to delete their own account
    
    if (req.user.userId !== req.params.id) {
      return next(errorHandler(401, 'You can only delete your own account!'));
    }
    console.log('5');
    // Perform user deletion
    const user = await User.findById(req.params.id);
    if (!user) {
      return next(errorHandler(404, 'User not found.'));
    }
    console.log('6');

    await User.findByIdAndDelete(req.params.id);
    console.log('7');
    // Respond with success message
    res.status(200).json({ message: 'User has been deleted!' });
    console.log('8');
  } catch (error) {
    // Handle token-related errors and other unexpected errors
    if (error instanceof jwt.JsonWebTokenError) {
      return next(errorHandler(401, 'Invalid or expired token.'));
    }

    // Pass other errors to the error handler middleware
    next(error);
  }
};

export const getUserListings = async (req, res, next) => {
  if (req.user.userId === req.params.id) {
    try {
      const listings = await Listing.find({ userRef: req.params.id });
      res.status(200).json(listings);
    } catch (error) {
      next(error);
    }
  } else {
    return next(errorHandler(401, 'You can only view your own listings!'));
  }
};

export const getUser = async (req, res, next) => {
  try {
    
    const user = await User.findById(req.params.id);
  
    if (!user) return next(errorHandler(404, 'User not found!'));
  
    const { password: pass, ...rest } = user._doc;
  
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

export const getSavedPosts = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).populate('savedPosts');
    if (!user) return next(errorHandler(404, 'User not found!'));
    
    res.status(200).json(user.savedPosts); // Return the saved posts
  } catch (error) {
    next(error);
  }
};

export const getNews=async(req,res,next)=>{
  try{
    const response = await fetch(
       "https://newsapi.org/v2/everything?q=real+estate&apiKey=f09ff51d010c4e5ebc29a0ef5b485f47"
    );
    res.status(200).json(response);
    
  }catch(err){
    console.log(err);
  }
}
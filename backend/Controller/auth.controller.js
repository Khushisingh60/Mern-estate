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



export const signin = async (req, res, next) => {
  const { email, password } = req.body;
  console.log(req.body);

  try {
    const validUser = await User.findOne({ email });
    if (!validUser) return next(errorHandler(404, 'User not found!'));

    const validPassword = await bcrypt.compare(password, validUser.password);
    if (!validPassword) return next(errorHandler(401, 'Wrong credentials!'));

    // Generate JWT token
    const token = jwt.sign({ userId: validUser._id }, 'secretkeyofrealestateapp123@#', { expiresIn: '5h' });

    

    // Destructure to exclude password from the response
    const { password: pass, ...rest } = validUser._doc;

    // Send token in the response body
    res.status(200).json({
      ...rest,
      token, // Add token to the response so the client can use it
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


import express from 'express';
import { deleteUser, test, updateUser,  getUserListings, getUser, getSavedPosts ,getNews} from '../Controller/user.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

import User from '../models/user.model.js';

const router = express.Router();

router.get('/test', test);
router.post('/update/:id', verifyToken, updateUser)
router.delete('/delete/:id', verifyToken, deleteUser)
router.get('/listings/:id', verifyToken, getUserListings)
router.get('/:id', verifyToken, getUser)
router.get('/news',getNews );

//router.get('/saved',verifyToken,getSavedPosts)


  
  // Get saved listings for a user
  router.get("/saved/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const user = await User.findById(userId).populate("savedPosts");
      if (!user) return res.status(404).json({ message: "User not found" });
  
      res.json(user.savedPosts);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });
  
  export default router;
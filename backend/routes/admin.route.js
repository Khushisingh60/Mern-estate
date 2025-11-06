import express from 'express';
import Listing from '../models/listing.model.js';
import { verifyAdmin } from '../utils/verifyAdmin.js';

const router1 = express.Router();


router1.get('/listings', verifyAdmin, async (req, res) => {
  try {
    const listings = await Listing.find();
    console.log(listings);
    res.status(200).json(listings);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Update a listing (Admin only)
router1.put('/listings/:id', verifyAdmin, async (req, res) => {
  try {
    const updatedListing = await Listing.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedListing) return res.status(404).json({ message: 'Listing not found' });

    res.status(200).json(updatedListing);
  } catch (error) {
    res.status(500).json({ message: 'Error updating listing', error });
  }
});

// Delete a listing (Admin only)
router1.delete('/listings/:id', verifyAdmin, async (req, res) => {
  try {
    const deletedListing = await Listing.findByIdAndDelete(req.params.id);
    if (!deletedListing) return res.status(404).json({ message: 'Listing not found' });

    res.status(200).json({ message: 'Listing deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting listing', error });
  }
});

export default router1;

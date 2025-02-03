import Listing from '../models/listing.model.js';
import { errorHandler } from '../utils/error.js';
import cloudinary from '../config/cloudinaryConfig.js';
import User from '../models/user.model.js';
import Alert from '../models/alert.model.js'
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: "khushisingh0598@gmail.com",
    pass: "feyx zrve ewvb gcap",
  },
});

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

export const createListing = async (req, res, next) => {
  try {
    const { imageUrls, ...data } = req.body;

    // Validate image URLs
    if (!imageUrls || !Array.isArray(imageUrls) || imageUrls.length === 0) {
      return res.status(400).json({ message: 'You must provide at least one image' });
    }

    // Create the listing
    const listing = await Listing.create({ ...data, imageUrls });
    notifyUsers(listing);
    res.status(201).json(listing);
  } catch (error) {
    next(error);
  }
};


export const deleteListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return next(errorHandler(404, 'Listing not found!'));
    }
    console.log(req.user);
    console.log(listing.userRef);
    if (req.user.userId !== listing.userRef.toString()) {
      return next(errorHandler(401, 'You can only delete your own listings!'));
    }
    

    // Delete the listing
    await Listing.findByIdAndDelete(req.params.id);
    res.status(200).json('Listing has been deleted!');
  } catch (error) {
    next(error);
  }
};

export const updateListing = async (req, res, next) => {
  try {
    const { images, ...data } = req.body;
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return next(errorHandler(404, 'Listing not found!'));
    }

    if (req.user.userId !== listing.userRef.toString()) {
      return next(errorHandler(401, 'You can only update your own listings!'));
    }

    let imageUrls = listing.imageUrls;

    if (images && images.length > 0) {
      const uploadedImages = await Promise.all(
        images.map((image) =>
          cloudinary.uploader.upload(image, {
            folder: 'listings',
          })
        )
      );

      imageUrls = uploadedImages.map((upload) => upload.secure_url);
    }

    const updatedListing = await Listing.findByIdAndUpdate(
      req.params.id,
      { ...data, imageUrls },
      { new: true }
    );
    console.log('updated');
    res.status(200).json(updatedListing);
  } catch (error) {
    next(error);
  }
};

export const getListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return next(errorHandler(404, 'Listing not found!'));
    }
    res.status(200).json(listing);
  } catch (error) {
    next(error);
  }
};

export const getListings = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 9;
    const startIndex = parseInt(req.query.startIndex) || 0;
    let offer = req.query.offer === 'true' ? true : { $in: [true, false] };
    let furnished = req.query.furnished === 'true' ? true : { $in: [true, false] };
    let parking = req.query.parking === 'true' ? true : { $in: [true, false] };
    let type = req.query.type || { $in: ['sale', 'rent'] };
    const searchTerm = req.query.searchTerm || '';
    const sort = req.query.sort || 'createdAt';
    const order = req.query.order === 'asc' ? 1 : -1;

    const listings = await Listing.find({
      name: { $regex: searchTerm, $options: 'i' },
      offer,
      furnished,
      parking,
      type,
    })
      .sort({ [sort]: order })
      .limit(limit)
      .skip(startIndex);

    res.status(200).json(listings);
  } catch (error) {
    next(error);
  }
};

export const toggleSaveListing = async (req, res, next) => {
  try {
    const listingId = req.body.listingId;
    const user = await User.findById(req.params.id);

    if (!user) return next(errorHandler(404, 'User not found!'));

    // Toggle saved post
    if (user.savedPosts.includes(listingId)) {
      // If already saved, remove from savedPosts
      user.savedPosts = user.savedPosts.filter(id => id.toString() !== listingId);
    } else {
      // If not saved, add to savedPosts
      user.savedPosts.push(listingId);
    }

    await user.save(); // Save updated user

    res.status(200).json({ savedPosts: user.savedPosts }); // Return updated list of saved posts
  } catch (error) {
    next(error);
  }
};

import Listing from '../models/listing.model.js';
import { errorHandler } from '../utils/error.js';
import cloudinary from '../config/cloudinaryConfig.js';

export const createListing = async (req, res, next) => {
  try {
    const { imageUrls, ...data } = req.body;

    // Validate image URLs
    if (!imageUrls || !Array.isArray(imageUrls) || imageUrls.length === 0) {
      return res.status(400).json({ message: 'You must provide at least one image' });
    }

    // Create the listing
    const listing = await Listing.create({ ...data, imageUrls });
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

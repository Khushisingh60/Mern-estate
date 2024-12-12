import mongoose from 'mongoose';

const ListingSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    address: { type: String, required: true },
    type: { type: String, enum: ['sale', 'rent'], required: true },
    bedrooms: { type: Number, required: true },
    bathrooms: { type: Number, required: true },
    regularPrice: { type: Number, required: true },
    discountPrice: { type: Number },
    offer: { type: Boolean, default: false },
    parking: { type: Boolean, default: false },
    furnished: { type: Boolean, default: false },
    imageUrls: { type: [String], required: true },
    userRef: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

export default mongoose.model('Listing', ListingSchema);

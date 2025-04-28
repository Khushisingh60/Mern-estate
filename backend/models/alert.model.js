import mongoose from 'mongoose';

const alertSchema = new mongoose.Schema({
  email:{type:String,required:true},
  location: { type: String, required: true },
  city:{type:String,required:true},
  minPrice: { type: Number, required: true },
  maxPrice: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
  
});

export default mongoose.model('Alert', alertSchema);

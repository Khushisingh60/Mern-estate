import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: ' ds62lyjki', // Replace with your Cloudinary cloud name
  api_key: 'CLOUDINARY_URL=cloudinary://895124768522786:PEc5vkb_d2bBJCCxPN4Rx2vTd4o@ds62lyjki',       // Replace with your API key
  api_secret: 'PEc5vkb_d2bBJCCxPN4Rx2vTd4o', // Replace with your API secret
});

export default cloudinary;

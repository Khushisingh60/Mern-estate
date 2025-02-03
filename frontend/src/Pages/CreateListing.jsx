import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import mongoose from 'mongoose';


export default function CreateListing() {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    imageUrls: [],
    name: '',
    description: '',
    address: '',
    city:'',
    colony:'',
    type: 'rent',
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 50,
    discountPrice: 0,
    offer: false,
    parking: false,
    furnished: false,
  });


  
  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  console.log(formData);

  const handleImageSubmit = async (e) => {
    if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
      setUploading(true);
      setImageUploadError(false);
      const promises = [];

      for (let i = 0; i < files.length; i++) {
        promises.push(uploadToCloudinary(files[i]));
      }

      try {
        const urls = await Promise.all(promises);
        setFormData({
          ...formData,
          imageUrls: formData.imageUrls.concat(urls),
        });
        setImageUploadError(false);
      } catch (err) {
        setImageUploadError('Image upload failed (2 MB max per image)');
      } finally {
        setUploading(false);
      }
    } else {
      setImageUploadError('You can only upload 6 images per listing');
      setUploading(false);
    }
  };

  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'qzt3axdt'); // Replace with your Cloudinary upload preset

    const response = await fetch('https://api.cloudinary.com/v1_1/ds62lyjki/image/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to upload image');
    }

    const data = await response.json();
    return data.secure_url;
  };

  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== index),
    });
  };

  const handleChange = (e) => {
    if (e.target.id === 'sale' || e.target.id === 'rent') {
      setFormData({
        ...formData,
        type: e.target.id,
      });
    }

    if (
      e.target.id === 'parking' ||
      e.target.id === 'furnished' ||
      e.target.id === 'offer'
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.checked,
      });
    }

    if (
      e.target.type === 'number' ||
      e.target.type === 'text' ||
      e.target.type === 'textarea'
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.value,
      });
    }
  };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
  
//     try {
//       // Validate form data
//       if (formData.imageUrls.length < 1) {
//         return setError('You must upload at least one image');
//       }
  
//       if (+formData.regularPrice < +formData.discountPrice) {
//         return setError('Discount price must be lower than regular price');
//       }
  
//       // Prepare for API request
//       setLoading(true);
//       setError(false);
  
//       const token = currentUser.token; // Retrieve token from local storage
  
//       if (!token) {
//         setLoading(false);
//         return setError('You must be logged in to create a listing');
//       }
  
//       // Make the API request
//       const res = await fetch('http://localhost:3000/api/listing/create', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${token}`, // Include the token in the Authorization header
//         },
//         body: JSON.stringify({
//           ...formData,
//           userRef: currentUser._id,
//           category: formData.category, // Ensure category is sent to the backend
//         }),
        
//       });
  
//       const data = await res.json();
  
//       setLoading(false);
  
//       if (!res.ok) {
//         // Handle server errors
//         return setError(data.message || 'Failed to create listing');
//       }
  
//       // Navigate to the listing page
//       console.log(data)
//       console.log('listing created successfully');
//       console.log(currentUser)
//       navigate(`/listing/${data._id}`);
//     } catch (error) {
//       // Handle unexpected errors
//       console.error('Error creating listing:', error);
//       setError(error.message || 'An unexpected error occurred');
//       setLoading(false);
//     }
//   };


  const handleSubmit = async (e) => {
    e.preventDefault();
    // setLoading(true);

    try {
      if (formData.imageUrls.length < 1) {
                return setError('You must upload at least one image');
              }
          
              if (+formData.regularPrice < +formData.discountPrice) {
                return setError('Discount price must be lower than regular price');
              }
          
              // Prepare for API request
      //         setLoading(true);
      //         setError(false);
          
      //         const token = currentUser.token; // Retrieve token from local storage
          
      //         if (!token) {
      //           setLoading(false);
      //           return setError('You must be logged in to create a listing');
      //         }
          
      
      // const res = await fetch('http://localhost:3000/api/listing/create', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     Authorization: `Bearer ${currentUser.token}`,
      //   },
      //   body: JSON.stringify({
      //     ...formData,
      //     userRef: currentUser._id,
      //     category: formData.category,
      //   }),
      // });

      // const data = await res.json();

      // setLoading(false);

      // if (!res.ok) {
      //   return setError(data.message || 'Failed to create listing');
      // }

      //navigate('/subscription', { state: { listingId: data._id, listingData: data } });

      // const mockListingId = 'mockListingId-' + Date.now(); 
      // const mockData = {
      //   _id: mockListingId,
      //   ...formData,
      // };
  
      // // Navigate to the subscription page with mock data
      // navigate('/subscription', { state: { listingId: mockData._id, listingData: mockData } 
//       const generateListingId = () => mongoose.Types.ObjectId(); // Creates a valid ObjectId

// const listingId = generateListingId();

//       console.log(listingId);
      const amount = formData.offer
        ? formData.discountPrice
        : formData.regularPrice;

      // Mock API success response
      const mockData = {
        //_id: listingId,
        ...formData,
        userRef: currentUser._id,
        amount,
      };

      // Navigate to the subscription page with mock data
      navigate('/subscription', {
        state: {
          // listingId: mockData._id,
          listingData: mockData,
          userId: currentUser._id,
          amount,
        },
      });
    } catch (err) {
      //setLoading(false);
      console.log(err);
      setError('An error occurred while creating the listing');
    }
  };

  
  return (
    <main className='p-3 max-w-4xl mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>
        Create a Listing
      </h1>

      <form onSubmit={handleSubmit} className='flex flex-col sm:flex-row gap-4'>
        <div className='flex flex-col gap-4 flex-1'>
          <input
            type='text'
            placeholder='Name'
            className='border p-3 rounded-lg'
            id='name'
            maxLength='62'
            minLength='10'
            required
            onChange={handleChange}
            value={formData.name}
          />
          <textarea
            type='text'
            placeholder='Description'
            className='border p-3 rounded-lg'
            id='description'
            required
            onChange={handleChange}
            value={formData.description}
          />
          <input
            type='text'
            placeholder='Address'
            className='border p-3 rounded-lg'
            id='address'
            required
            onChange={handleChange}
            value={formData.address}
          />
          <input
            type='text'
            placeholder='Residential Area'
            className='border p-3 rounded-lg'
            id='colony'
            required
            onChange={handleChange}
            value={formData.colony}
          />
          <input
            type='text'
            placeholder='City'
            className='border p-3 rounded-lg'
            id='city'
            required
            onChange={handleChange}
            value={formData.city}
          />
          <div className='flex gap-6 flex-wrap'>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='sale'
                className='w-5'
                onChange={handleChange}
                checked={formData.type === 'sale'}
              />
              <span>Sell</span>
            </div>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='rent'
                className='w-5'
                onChange={handleChange}
                checked={formData.type === 'rent'}
              />
              <span>Rent</span>
            </div>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='parking'
                className='w-5'
                onChange={handleChange}
                checked={formData.parking}
              />
              <span>Parking spot</span>
            </div>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='furnished'
                className='w-5'
                onChange={handleChange}
                checked={formData.furnished}
              />
              <span>Furnished</span>
            </div>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='offer'
                className='w-5'
                onChange={handleChange}
                checked={formData.offer}
              />
              <span>Offer</span>
            </div>
          </div>
          <div className='flex flex-wrap gap-6'>
            <div className='flex items-center gap-2'>
              <input
                type='number'
                id='bedrooms'
                min='1'
                max='10'
                required
                className='p-3 border border-gray-300 rounded-lg'
                onChange={handleChange}
                value={formData.bedrooms}
              />
              <p>Beds</p>
            </div>
            <div className='flex items-center gap-2'>
              <input
                type='number'
                id='bathrooms'
                min='1'
                max='10'
                required
                className='p-3 border border-gray-300 rounded-lg'
                onChange={handleChange}
                value={formData.bathrooms}
              />
              <p>Baths</p>
            </div>
            <div className='flex items-center gap-2'>
              <input
                type='number'
                id='regularPrice'
                min='50'
                max='10000000'
                required
                className='p-3 border border-gray-300 rounded-lg'
                onChange={handleChange}
                value={formData.regularPrice}
              />
              <div className='flex flex-col items-center'>
                <p>Regular price</p>
                {formData.type === 'rent' && (
                  <span className='text-xs'>($ / month)</span>
                )}
              </div>
            </div>
            {formData.offer && (
              <div className='flex items-center gap-2'>
                <input
                  type='number'
                  id='discountPrice'
                  min='0'
                  max='10000000'
                  required
                  className='p-3 border border-gray-300 rounded-lg'
                  onChange={handleChange}
                  value={formData.discountPrice}
                />
                <div className='flex flex-col items-center'>
                  <p>Discounted price</p>

                  {formData.type === 'rent' && (
                    <span className='text-xs'>($ / month)</span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
        <div className='flex flex-col flex-1 gap-4'>
          <p className='font-semibold'>
            Images:
            <span className='font-normal text-gray-600 ml-2'>
              The first image will be the cover (max 6)
            </span>
          </p>
          <div className='flex gap-4'>
            <input
              onChange={(e) => setFiles(e.target.files)}
              className='p-3 border border-gray-300 rounded w-full'
              type='file'
              id='images'
              accept='image/*'
              multiple
            />
            <button
              type='button'
              disabled={uploading}
              onClick={handleImageSubmit}
              className='p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80'
            >
              {uploading ? 'Uploading...' : 'Upload'}
            </button>
          </div>
          <p className='text-red-700 text-sm'>
            {imageUploadError && imageUploadError}
          </p>
          {formData.imageUrls.length > 0 &&
            formData.imageUrls.map((url, index) => (
              <div
                key={url}
                className='flex justify-between p-3 border items-center'
              >
                <img
                  src={url}
                  alt='listing image'
                  className='w-20 h-20 object-contain rounded-lg'
                />
                <button
                  type='button'
                  onClick={() => handleRemoveImage(index)}
                  className='p-3 text-red-700 rounded-lg uppercase hover:opacity-75'
                >
                  Delete
                </button>
              </div>
            ))}
          <button
            disabled={loading || uploading}
            className='p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80'
          >
            {loading ? 'Creating...' : 'Create listing'}
          </button>
          {error && <p className='text-red-700 text-sm'>{error}</p>}
        </div>
      </form>
    </main>
  );
}

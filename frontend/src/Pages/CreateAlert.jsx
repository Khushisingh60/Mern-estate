import { useState, useEffect } from 'react';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';

function CreateAlert() {
  const [formData, setFormData] = useState({ location: '', minPrice: '', maxPrice: '', city: '' });
  const [success, setSuccess] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const token = localStorage.getItem('token'); // Retrieve token from storage
  const decodedToken = jwtDecode(token);
  const userId = decodedToken.userId;

  // Fetch the user's email based on userId
  useEffect(() => {
    const fetchUserEmail = async () => {
      try {
        console.log(decodedToken)
        console.log(userId);
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/users/${userId}`);
        console.log(response.data.email);
        setUserEmail(response.data.email);
      } catch (error) {
        console.error('Failed to fetch user email', error);
      }
    };

    fetchUserEmail();
  }, [userId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userEmail) {
      console.error('User email not available. Cannot proceed with alert creation.');
      return;
    }

    try {
      const alertData = {
        ...formData,
        email: userEmail,
        location: formData.location || 'any', // Default to 'any' if location is not provided
      };

      const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/alerts`, alertData, {
        headers: { 'Content-Type': 'application/json' },
      });

      if (res.data.success) {
        setSuccess(true);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">Set Alert</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="location"
            placeholder="Area"
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <input
            type="text"
            name="city"
            placeholder="City"
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <input
            type="number"
            name="minPrice"
            placeholder="Min Price"
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <input
            type="number"
            name="maxPrice"
            placeholder="Max Price"
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white font-medium py-2 rounded-lg hover:bg-blue-600 transition duration-200"
          >
            Set Alert
          </button>
        </form>
        {success && (
          <p className="mt-4 text-green-500 text-center font-medium">
            Alert set successfully!
          </p>
        )}
      </div>
    </div>
  );
}

export default CreateAlert;

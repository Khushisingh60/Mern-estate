import { useSelector } from 'react-redux';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signOutUserStart,
} from '../redux/user/userSlice';
import { Link } from 'react-router-dom';

export default function Profile() {
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [showListingsError, setShowListingsError] = useState(false);
  const [userListings, setUserListings] = useState([]);
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(updateUserStart());
    try {
      const response = await fetch(`http://localhost:3000/api/user/update/${currentUser._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${currentUser.token}`,
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();

      if (!response.ok) {
        dispatch(updateUserFailure(data.message || 'Failed to update user.'));
        return;
      }

      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure('An unexpected error occurred.'));
    }
  };

  

const handleDeleteUser = async () => {
  dispatch(deleteUserStart());
    try {
      console.log('Token:', currentUser.token);
      const response = await axios.delete(
        `http://localhost:3000/api/user/delete/${currentUser._id}`,
        {
          headers: {
            Authorization: `Bearer ${currentUser.token}`,
          },
        }
      );
  
      if (response.status !== 200) {
        dispatch(deleteUserFailure(response.data.message || 'Failed to delete user.'));
        return;
      }
  
      dispatch(deleteUserSuccess(response.data));
    } catch (error) {
      console.error('Error deleting user:', error.response?.data?.message || error.message);
      dispatch(deleteUserFailure(error.response?.data?.message || 'An unexpected error occurred.'));
    }
  };
  
  // const handleSignOut = async () => {
  //   dispatch(signOutUserStart());
  //   try {
  //     const response = await fetch('http://localhost:3000/api/auth/signout');
  //     const data = await response.json();

  //     if (!response.ok) {
  //       dispatch(deleteUserFailure(data.message || 'Failed to sign out.'));
  //       return;
  //     }

  //     dispatch(deleteUserSuccess(data));
  //   } catch (error) {
  //     dispatch(deleteUserFailure('An unexpected error occurred.'));
  //   }
  // };

  const handleSignOut = () => {
    // Clear the JWT token stored on the client side
    localStorage.removeItem('token');  // Or use sessionStorage if you're using that
  
    // Optionally, you could call your backend to clear any server-side session if you want to.
    axios.post('http://localhost:3000/api/signout')
      .then(response => {
        console.log(response.data); // 'User has been logged out!'
      })
      .catch(error => {
        console.error('Error logging out:', error);
      });
  };
  
  const handleShowListings = async () => {
    setShowListingsError(false);
  
    try {
      const token = currentUser.token; // Retrieve the token from currentUser
  
      if (!token) {
        setShowListingsError(true);
        console.error('Token is missing');
        return;
      }
  
      const response = await fetch(`http://localhost:3000/api/user/listings/${currentUser._id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Include the token in the Authorization header
        },
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        setShowListingsError(true);
        console.error(data.message); // Log the backend error message for debugging
        return;
      }
  
      setUserListings(data);
    } catch (error) {
      console.error('Error fetching user listings:', error);
      setShowListingsError(true);
    }
  };
  
  const handleListingDelete = async (listingId) => {
    try {
      const response = await fetch(`http://localhost:3000/api/listing/delete/${listingId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${currentUser.token}`,
        },
      });
      const data = await response.json();

      if (!response.ok) {
        console.log(data.message || 'Failed to delete listing.');
        return;
      }

      setUserListings((prev) =>
        prev.filter((listing) => listing._id !== listingId)
      );
    } catch (error) {
      console.log('An unexpected error occurred:', error.message);
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Username"
          id="username"
          defaultValue={currentUser.username}
          className="border p-3 rounded-lg"
          onChange={handleChange}
        />
        <input
          type="email"
          placeholder="Email"
          id="email"
          defaultValue={currentUser.email}
          className="border p-3 rounded-lg"
          onChange={handleChange}
        />
        <input
          type="password"
          placeholder="Password"
          id="password"
          className="border p-3 rounded-lg"
          onChange={handleChange}
        />
        <button
          disabled={loading}
          className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80"
        >
          {loading ? 'Loading...' : 'Update'}
        </button>
        <Link
          to="/create-listing"
          className="bg-green-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-95"
        >
          Create Listing
        </Link>
      </form>
      <div className="flex justify-between mt-5">
        <span
          onClick={handleDeleteUser}
          className="text-red-700 cursor-pointer"
        >
          Delete account
        </span>
        <span onClick={handleSignOut} className="text-red-700 cursor-pointer">
          Sign out
        </span>
      </div>

      <p className="text-red-700 mt-5">{error || ''}</p>
      <p className="text-green-700 mt-5">
        {updateSuccess ? 'User is updated successfully!' : ''}
      </p>
      <button onClick={handleShowListings} className="text-green-700 w-full">
        Show Listings
      </button>
      <p className="text-red-700 mt-5">
        {showListingsError ? 'Error showing listings' : ''}
      </p>

      {userListings.length > 0 && (
        <div className="flex flex-col gap-4">
          <h1 className="text-center mt-7 text-2xl font-semibold">
            Your Listings
          </h1>
          {userListings.map((listing) => (
            <div
              key={listing._id}
              className="border rounded-lg p-3 flex justify-between items-center gap-4"
            >
              <Link to={`/listing/${listing._id}`}>
                <img
                  src={listing.imageUrls[0]}
                  alt="listing cover"
                  className="h-16 w-16 object-contain"
                />
              </Link>
              <Link
                className="text-slate-700 font-semibold hover:underline truncate flex-1"
                to={`/listing/${listing._id}`}
              >
                <p>{listing.name}</p>
              </Link>
              <div className="flex flex-col items-center">
                <button
                  onClick={() => handleListingDelete(listing._id)}
                  className="text-red-700 uppercase"
                >
                  Delete
                </button>
                <Link to={`/update-listing/${listing._id}`}>
                  <button className="text-green-700 uppercase">Edit</button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

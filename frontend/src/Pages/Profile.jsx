// import { useSelector, useDispatch } from 'react-redux';
// import { useState, useEffect } from 'react';
// import axios from 'axios';
// import { Link, useNavigate } from 'react-router-dom';
// import { FaPlus, FaList, FaTrash, FaSignOutAlt, FaUserShield } from 'react-icons/fa'; // Added Admin icon
// import {
//   updateUserStart,
//   updateUserSuccess,
//   updateUserFailure,
//   deleteUserFailure,
//   deleteUserStart,
//   deleteUserSuccess,
//   signOutUserStart,
// } from '../redux/user/userSlice';


// export default function Profile() {
//   const { currentUser, loading, error } = useSelector((state) => state.user);
//   const [formData, setFormData] = useState({});
//   const [updateSuccess, setUpdateSuccess] = useState(false);
//   const [showListingsError, setShowListingsError] = useState(false);
//   const [userListings, setUserListings] = useState([]);
//   const [role, setRole] = useState('user'); // Default role
  
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   // Get role from localStorage
//   useEffect(() => {
//     const storedRole = localStorage.getItem('role');
//     if (storedRole) {
//       setRole(storedRole);
//     }
//   }, []);

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.id]: e.target.value });
//   };

  

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     dispatch(updateUserStart());
//     try {
//       const response = await fetch(`http://localhost:3000/api/user/update/${currentUser._id}`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${currentUser.token}`,
//         },
//         body: JSON.stringify(formData),
//       });

//       const data = await response.json();
//       if (!response.ok) {
//         dispatch(updateUserFailure(data.message || 'Failed to update user.'));
//         return;
//       }

//       dispatch(updateUserSuccess(data));
//       setUpdateSuccess(true);
//     } catch (error) {
//       dispatch(updateUserFailure('An unexpected error occurred.'));
//     }
//   };

//   const handleSignOut = async () => {
//     dispatch(signOutUserStart());
//     try {
//       const response = await fetch('http://localhost:3000/api/auth/signout');
//       const data = await response.json();

//       if (!response.ok) {
//         dispatch(deleteUserFailure(data.message || 'Failed to sign out.'));
//         return;
//       }

//       dispatch(deleteUserSuccess(data));
//       localStorage.removeItem('role'); // Clear role from localStorage
//       navigate('/sign-in');
//     } catch (error) {
//       dispatch(deleteUserFailure('An unexpected error occurred.'));
//     }
//   };

//   const handleShowListings = async () => {
//     setShowListingsError(false);

//     try {
//       const token = currentUser.token;
//       if (!token) {
//         setShowListingsError(true);
//         return;
//       }

//       const response = await fetch(`http://localhost:3000/api/user/listings/${currentUser._id}`, {
//         method: 'GET',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       const data = await response.json();
//       if (!response.ok) {
//         setShowListingsError(true);
//         return;
//       }

//       setUserListings(data);
//     } catch (error) {
//       setShowListingsError(true);
//     }
//   };

//   return (
//     <div className="flex">
//       {/* Sidebar */}
//       <div className="w-1/4 bg-gray-400 text-white p-4 min-h-screen">
//         <div className="flex flex-col gap-4">
//           <Link to="/create-listing" className="flex items-center gap-2 p-3 bg-gray-800 rounded-lg hover:opacity-95">
//             <FaPlus /> Create Listing
//           </Link>
//           <button onClick={handleShowListings} className="flex items-center gap-2 p-3 bg-gray-800 rounded-lg hover:opacity-95">
//             <FaList /> Show Listings
//           </button>
//           <button onClick={handleSignOut} className="flex items-center gap-2 p-3 bg-gray-800 rounded-lg hover:opacity-95">
//             <FaSignOutAlt /> Sign Out
//           </button>
//           <button onClick={() => navigate('/admin-dashboard')} className="flex items-center gap-2 p-3 bg-gray-800 rounded-lg hover:opacity-95">
//             <FaTrash /> Delete Account
//           </button>

//           {/* Admin Dashboard Button (Visible only for admins) */}
//           {role === 'admin' && (
//             <Link to="/admin-dashboard" className="flex items-center gap-2 p-3 bg-gray-800 rounded-lg hover:opacity-95">
//               <FaUserShield /> Admin Dashboard
//             </Link>
//           )}
//         </div>
//       </div>

//       {/* Main Profile Section */}
//       <div className="p-3 max-w-lg mx-auto flex-1">
//         <h1 className="text-3xl font-semibold text-center my-7">Update Profile</h1>
//         <form onSubmit={handleSubmit} className="flex flex-col gap-4">
//           <input
//             type="text"
//             placeholder="Username"
//             id="username"
//             defaultValue={currentUser.username}
//             className="border p-3 rounded-lg"
//             onChange={handleChange}
//           />
//           <input
//             type="email"
//             placeholder="Email"
//             id="email"
//             defaultValue={currentUser.email}
//             className="border p-3 rounded-lg"
//             onChange={handleChange}
//           />
//           <input
//             type="password"
//             placeholder="Password"
//             id="password"
//             className="border p-3 rounded-lg"
//             onChange={handleChange}
//           />
//           <button
//             disabled={loading}
//             className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80"
//           >
//             {loading ? 'Loading...' : 'Update'}
//           </button>
//         </form>
//         <p className="text-red-700 mt-5">{error || ''}</p>
//         <p className="text-green-700 mt-5">{updateSuccess ? 'User is updated successfully!' : ''}</p>
//         <p className="text-red-700 mt-5">{showListingsError ? 'Error showing listings' : ''}</p>

//         {/* Listings */}
//         {userListings.length > 0 && (
//           <div className="flex flex-col gap-4">
//             <h1 className="text-center mt-7 text-2xl font-semibold">Your Listings</h1>
//             {userListings.map((listing) => (
//               <div key={listing._id} className="border rounded-lg p-3 flex justify-between items-center gap-4">
//                 <Link to={`/listing/${listing._id}`}>
//                   <img src={listing.imageUrls[0]} alt="listing cover" className="h-16 w-16 object-contain" />
//                 </Link>
//                 <Link className="text-slate-700 font-semibold hover:underline truncate flex-1" to={`/listing/${listing._id}`}>
//                   <p>{listing.name}</p>
//                 </Link>
//                 <div className="flex flex-col items-center">
//                   <button className="text-red-700 uppercase">Delete</button>
//                   <Link to={`/update-listing/${listing._id}`}>
//                     <button className="text-green-700 uppercase">Edit</button>
//                   </Link>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

import { useSelector, useDispatch } from 'react-redux';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { FaPlus, FaList, FaTrash, FaSignOutAlt, FaUserShield, FaInbox } from 'react-icons/fa';
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signOutUserStart,
} from '../redux/user/userSlice.js';

export default function Profile() {
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [showListingsError, setShowListingsError] = useState(false);
  const [userListings, setUserListings] = useState([]);
  const [role, setRole] = useState('user');
  const [inboxMessages, setInboxMessages] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const storedRole = localStorage.getItem('role');
    if (storedRole) {
      setRole(storedRole);
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(updateUserStart());
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/user/update/${currentUser._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${currentUser.token}`,
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) return dispatch(updateUserFailure(data.message));
      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (err) {
      dispatch(updateUserFailure('Unexpected error'));
    }
  };

  const handleSignOut = async () => {
    dispatch(signOutUserStart());
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/signout`);
      const data = await res.json();
      if (!res.ok) return dispatch(deleteUserFailure(data.message));
      dispatch(deleteUserSuccess(data));
      localStorage.removeItem('role');
      navigate('/sign-in');
    } catch (err) {
      dispatch(deleteUserFailure('Unexpected error'));
    }
  };

  const handleShowListings = async () => {
        setShowListingsError(false);
    
        try {
          const token = currentUser.token;
          if (!token) {
            setShowListingsError(true);
            return;
          }
    
          const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/user/listings/${currentUser._id}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          });
    
          const data = await response.json();
          if (!response.ok) {
            setShowListingsError(true);
            return;
          }
    
          setUserListings(data);
        } catch (error) {
          setShowListingsError(true);
        }
      };


  const handleFetchInbox = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/user/inbox/${currentUser._id}`);
      const data = await res.json();
      if (!res.ok) throw new Error();
      setInboxMessages(data);
    } catch (err) {
      console.error('Inbox fetch error:', err);
    }
  };

  const handleSelectChat = async (chatId) => {
    setSelectedChat(chatId);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/user/chat/${chatId}`);
      const data = await res.json();
      if (!res.ok) throw new Error();
      setChatMessages(data);
    } catch (err) {
      console.error('Chat load error:', err);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/user/chat/${selectedChat}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ senderId: currentUser._id, message: newMessage }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error();
      setChatMessages((prev) => [...prev, data]);
      setNewMessage('');
    } catch (err) {
      console.error('Send message error:', err);
    }
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <div className="w-1/4 bg-gray-400 text-white p-4 min-h-screen">
        <div className="flex flex-col gap-4">
          <Link to="/create-listing" className="flex items-center gap-2 p-3 bg-gray-800 rounded-lg hover:opacity-95">
            <FaPlus /> Create Listing
          </Link>
          <button onClick={handleShowListings} className="flex items-center gap-2 p-3 bg-gray-800 rounded-lg hover:opacity-95">
            <FaList /> Show Listings
          </button>
          <Link to="/inbox" className="flex items-center gap-2 p-3 bg-gray-800 rounded-lg hover:opacity-95">
            <FaInbox /> Inbox
          </Link>

          <button onClick={handleSignOut} className="flex items-center gap-2 p-3 bg-gray-800 rounded-lg hover:opacity-95">
            <FaSignOutAlt /> Sign Out
          </button>
          <button onClick={() => navigate('/admin-dashboard')} className="flex items-center gap-2 p-3 bg-gray-800 rounded-lg hover:opacity-95">
            <FaTrash /> Delete Account
          </button>
          {role === 'admin' && (
            <Link to="/admin-dashboard" className="flex items-center gap-2 p-3 bg-gray-800 rounded-lg hover:opacity-95">
              <FaUserShield /> Admin Dashboard
            </Link>
          )}
        </div>
      </div>

      {/* Main Section */}
      <div className="p-4 flex-1 max-w-3xl mx-auto">
        <h1 className="text-3xl font-semibold text-center my-7">Update Profile</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input type="text" placeholder="Username" id="username" defaultValue={currentUser.username} onChange={handleChange} className="border p-3 rounded-lg" />
          <input type="email" placeholder="Email" id="email" defaultValue={currentUser.email} onChange={handleChange} className="border p-3 rounded-lg" />
          <input type="password" placeholder="Password" id="password" onChange={handleChange} className="border p-3 rounded-lg" />
          <button disabled={loading} className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80">
            {loading ? 'Loading...' : 'Update'}
          </button>
        </form>

        {updateSuccess && <p className="text-green-600 mt-4">Profile updated successfully!</p>}
        {error && <p className="text-red-600 mt-4">{error}</p>}
        {showListingsError && <p className="text-red-600 mt-4">Error fetching listings.</p>}

        {/* Inbox Section */}
        {inboxMessages.length > 0 && (
          <div className="mt-10">
            <h2 className="text-xl font-semibold mb-4">Inbox</h2>
            <ul className="space-y-2">
              {inboxMessages.map((msg) => (
                <li
                  key={msg.chatId}
                  className="border p-2 rounded cursor-pointer bg-gray-100 hover:bg-gray-200"
                  onClick={() => handleSelectChat(msg.chatId)}
                >
                  <p><span className="font-bold">From:</span> {msg.senderName}</p>
                  <p className="text-sm text-gray-600 truncate">{msg.lastMessage}</p>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Chatroom */}
        {selectedChat && (
          <div className="mt-10 border p-4 rounded-lg bg-white">
            <h2 className="text-lg font-semibold mb-2">Chatroom</h2>
            <div className="h-64 overflow-y-scroll mb-3 border p-2">
              {chatMessages.map((m, index) => (
                <div key={index} className={`mb-2 ${m.senderId === currentUser._id ? 'text-right' : 'text-left'}`}>
                  <span className="inline-block bg-gray-200 p-2 rounded">{m.message}</span>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="border p-2 flex-1 rounded"
                placeholder="Type your message..."
              />
              <button onClick={handleSendMessage} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                Send
              </button>
            </div>
          </div>
        )}

        {/* Listings */}
        {userListings.length > 0 && (
          <div className="flex flex-col gap-4">
            <h1 className="text-center mt-7 text-2xl font-semibold">Your Listings</h1>
            {userListings.map((listing) => (
              <div key={listing._id} className="border rounded-lg p-3 flex justify-between items-center gap-4">
                <Link to={`/listing/${listing._id}`}>
                  <img src={listing.imageUrls[0]} alt="listing cover" className="h-16 w-16 object-contain" />
                </Link>
                <Link className="text-slate-700 font-semibold hover:underline truncate flex-1" to={`/listing/${listing._id}`}>
                  <p>{listing.name}</p>
                </Link>
                <div className="flex flex-col items-center">
                  <button className="text-red-700 uppercase">Delete</button>
                  <Link to={`/update-listing/${listing._id}`}>
                    <button className="text-green-700 uppercase">Edit</button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}


// import { useEffect, useState } from 'react';
// import { Link } from 'react-router-dom';
// import { useSelector } from 'react-redux';

// export default function Contact({ listing }) {
//   const [landlord, setLandlord] = useState(null);
//   const [message, setMessage] = useState('');
//   const onChange = (e) => {
//     setMessage(e.target.value);
//   };
//   const { currentUser } = useSelector((state) => state.user);
//   const token = currentUser?.token; 

//   useEffect(() => {
//     const fetchLandlord = async () => {
//       try {
        
//         const res = await fetch(`http://localhost:3000/api/user/${listing.userRef}`,{
//           headers: {
//             'Content-Type': 'application/json',
//             Authorization: `Bearer ${token}`, 
//           },
//         });
//         const data = await res.json();
//         setLandlord(data);
//       } catch (error) {
//         console.log(error);
//       }
//     };
//     fetchLandlord();
//   }, [listing.userRef]);
//   return (
//     <>
//       {landlord && (
//         <div className='flex flex-col gap-2'>
//           <p>
//             Contact <span className='font-semibold'>{landlord.username}</span>{' '}
//             for{' '}
//             <span className='font-semibold'>{listing.name.toLowerCase()}</span>
//           </p>
//           <textarea
//             name='message'
//             id='message'
//             rows='2'
//             value={message}
//             onChange={onChange}
//             placeholder='Enter your message here...'
//             className='w-full border p-3 rounded-lg'
//           ></textarea>

//           <Link
//           to={`mailto:${landlord.email}?subject=Regarding ${listing.name}&body=${message}`}
//           className='bg-slate-700 text-white text-center p-3 uppercase rounded-lg hover:opacity-95'
//           >
//             Send Message          
//           </Link>
//         </div>
//       )}
//     </>
//   );
// }

import { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';

export default function Contact({ listing }) {
  const [landlord, setLandlord] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const socketRef = useRef(null);
  const navigate = useNavigate();

  const { currentUser } = useSelector((state) => state.user);
  const token = currentUser?.token;

  useEffect(() => {
    if (!currentUser) return;
    
    // Connect to Socket.IO server
    socketRef.current = io(`${import.meta.env.VITE_API_BASE_URL}`);
    socketRef.current.emit('registerUser', currentUser._id);

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [currentUser]);

  useEffect(() => {
    const fetchLandlord = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/user/${listing.userRef}`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        setLandlord(data);
      } catch (error) {
        console.log(error);
      }
    };
    
    if (listing.userRef) {
      fetchLandlord();
    }
  }, [listing.userRef, token]);

  const handleSend = async () => {
    if (!currentUser) {
      navigate('/sign-in');
      return;
    }
    
    if (message.trim() === '' || !landlord) return;
    
    setLoading(true);
    
    try {
      // Send message using REST API
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/chat/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          receiverId: landlord._id,
          message,
          listingId: listing._id
        }),
      });
      
      const data = await res.json();
      
      // Also emit through socket for real-time updates
      socketRef.current.emit('sendMessage', {
        senderId: currentUser._id,
        receiverId: landlord._id,
        message,
        listingId: listing._id,
        chatId: data.chatId
      });
      
      setMessage('');
      
      // Ask if user wants to go to chat
      const goToChat = window.confirm('Message sent! Would you like to go to your messages?');
      if (goToChat) {
        navigate('/inbox');
      }
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {landlord && landlord._id !== currentUser?._id ? (
        <div className='flex flex-col gap-2'>
          <p>
            Contact <span className='font-semibold'>{landlord.username}</span> for{' '}
            <span className='font-semibold'>{listing.name.toLowerCase()}</span>
          </p>
          <textarea
            name='message'
            id='message'
            rows='2'
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder='Enter your message here...'
            className='w-full border p-3 rounded-lg'
          ></textarea>

          <button
            onClick={handleSend}
            disabled={loading || message.trim() === ''}
            className='bg-slate-700 text-white text-center p-3 uppercase rounded-lg hover:opacity-95 disabled:opacity-75'
          >
            {loading ? 'Sending...' : 'Send Message'}
          </button>
        </div>
      ) : landlord?._id === currentUser?._id ? (
        <p className='text-slate-700 italic'>This is your listing</p>
      ) : (
        <p className='text-slate-700'>Loading contact information...</p>
      )}
    </>
  );
}
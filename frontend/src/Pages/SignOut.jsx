// import { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import OAuth from '../components/OAuth';
// import axios from 'axios';

// export default function SignUp() {
//   const [formData, setFormData] = useState({});
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.id]: e.target.value,
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       setLoading(true);
//       const res = await axios.post('http://localhost:3000/api/auth/signup', formData, {
//         headers: { 'Content-Type': 'application/json' },
//       });
//       console.log(res.data);
//       if (!res.data.success) {
//         setLoading(false);
//         setError(res.data.message);
//         return;
//       }
//       setLoading(false);
//       setError(null);
//       navigate('/sign-in');
//     } catch (error) {
//       setLoading(false);
//       setError(error.response?.data?.message || error.message);
//     }
//   };

//   return (
//     <div className="p-3 max-w-lg mx-auto">
//       <h1 className="text-3xl text-center font-semibold my-7">Sign Up</h1>
//       <form onSubmit={handleSubmit} className="flex flex-col gap-4">
//         <input
//           type="text"
//           placeholder="username"
//           className="border p-3 rounded-lg"
//           id="username"
//           onChange={handleChange}
//         />
//         <input
//           type="email"
//           placeholder="email"
//           className="border p-3 rounded-lg"
//           id="email"
//           onChange={handleChange}
//         />
//         <input
//           type="password"
//           placeholder="password"
//           className="border p-3 rounded-lg"
//           id="password"
//           onChange={handleChange}
//         />
//         <button
//           disabled={loading}
//           className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
//         >
//           {loading ? 'Loading...' : 'Sign Up'}
//         </button>
//         <OAuth />
//       </form>
//       <div className="flex gap-2 mt-5">
//         <p>Have an account?</p>
//         <Link to={'/sign-in'}>
//           <span className="text-blue-700">Sign in</span>
//         </Link>
//       </div>
//       {error && <p className="text-red-500 mt-5">{error}</p>}
//     </div>
//   );
// }

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function SignUp() {
  const [formData, setFormData] = useState({});
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState('form'); // Steps: 'form', 'otp'
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleOtpChange = (e) => {
    setOtp(e.target.value);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await axios.post('http://localhost:3000/api/auth/send-otp', { email: formData.email }, {
        headers: { 'Content-Type': 'application/json' },
      });
      console.log(res.data);
      if (!res.data.success) {
        setError(res.data.message);
        setLoading(false);
        return;
      }
      setError(null);
      setLoading(false);
      setStep('otp'); // Proceed to OTP step
    } catch (error) {
      setLoading(false);
      setError(error.response?.data?.message || error.message);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await axios.post('http://localhost:3000/api/auth/verify-otp', { email: formData.email, otp }, {
        headers: { 'Content-Type': 'application/json' },
      });
      console.log(res.data);
      if (!res.data.success) {
        setError(res.data.message);
        setLoading(false);
        return;
      }
      // Proceed with the full signup process after OTP verification
      const signupRes = await axios.post('http://localhost:3000/api/auth/signup', formData, {
        headers: { 'Content-Type': 'application/json' },
      });
      console.log(signupRes.data);
      if (!signupRes.data.success) {
        setError(signupRes.data.message);
        setLoading(false);
        return;
      }
      setError(null);
      setLoading(false);
      navigate('/sign-in');
    } catch (error) {
      setLoading(false);
      setError(error.response?.data?.message || error.message);
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">Sign Up</h1>
      {step === 'form' ? (
        <form onSubmit={handleFormSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="username"
            className="border p-3 rounded-lg"
            id="username"
            onChange={handleChange}
          />
          <input
            type="email"
            placeholder="email"
            className="border p-3 rounded-lg"
            id="email"
            onChange={handleChange}
          />
          <input
            type="password"
            placeholder="password"
            className="border p-3 rounded-lg"
            id="password"
            onChange={handleChange}
          />
          <button
            disabled={loading}
            className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
          >
            {loading ? 'Sending OTP...' : 'Send OTP'}
          </button>
        </form>
      ) : (
        <form onSubmit={handleOtpSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Enter OTP"
            className="border p-3 rounded-lg"
            value={otp}
            onChange={handleOtpChange}
          />
          <button
            disabled={loading}
            className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
          >
            {loading ? 'Verifying OTP...' : 'Verify OTP'}
          </button>
        </form>
      )}
      <div className="flex gap-2 mt-5">
        <p>Have an account?</p>
        <Link to={'/sign-in'}>
          <span className="text-blue-700">Sign in</span>
        </Link>
      </div>
      {error && <p className="text-red-500 mt-5">{error}</p>}
    </div>
  );
}

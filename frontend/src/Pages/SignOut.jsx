import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function SignUp() {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState('form'); // Steps: 'form', 'otp'
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Debugging useEffect (logs step changes)
  useEffect(() => {
    console.log('Current Step:', step);
  }, [step]);

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
    alert('handleFormSubmit function is running!'); // This should pop up when you click "Send OTP"
  
    if (!formData.email) {
      setError('Please enter a valid email.');
      return;
    }
  
    try {
      setLoading(true);
      console.log('Sending OTP request...');
      const res = await axios.post('http://localhost:3000/api/auth/send-otp', { email: formData.email }, {
        headers: { 'Content-Type': 'application/json' },
      });
  
      console.log('OTP Sent Response:', res.data.success);
  
      if (!res.data.success) {
        console.log("not success");
        setError(res.data.message);
        setLoading(false);
        return;
      }
  
      setError(null);
      setLoading(false);
      console.log('Updating Step to OTP');
      setStep('otp'); // This should trigger the OTP form to appear
    } catch (error) {
      console.log('Error Sending OTP:', error);
      setLoading(false);
      setError(error.response?.data?.message || error.message);
    }
  };
  

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    alert('handleOtpSubmit function is running!'); 
    if (!otp) {
      setError('Please enter the OTP.');
      return;
    }

    try {
      setLoading(true);
      console.log('Verifying OTP...');
      const res = await axios.post('http://localhost:3000/api/auth/verify-otp', { email: formData.email, otp }, {
        headers: { 'Content-Type': 'application/json' },
      });

      console.log('OTP Verification Response:', res.data);

      if (!res.data.success) {
        setError(res.data.message);
        setLoading(false);
        return;
      }

      // Proceed with signup after OTP verification
      console.log('Signing Up User...');
      const signupRes = await axios.post('http://localhost:3000/api/auth/signup', formData, {
        headers: { 'Content-Type': 'application/json' },
      });

      console.log('Signup Response:', signupRes.data);

      if (!signupRes.data.success) {
        setError(signupRes.data.message);
        setLoading(false);
        return;
      }

      setError(null);
      setLoading(false);
      navigate('/sign-in');
    } catch (error) {
      console.log('Error Verifying OTP:', error);
      setLoading(false);
      setError(error.response?.data?.message || error.message);
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">Sign Up</h1>

      {step === 'form' && (
        <form onSubmit={handleFormSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Username"
            className="border p-3 rounded-lg"
            id="username"
            value={formData.username}
            onChange={handleChange}
          />
          <input
            type="email"
            placeholder="Email"
            className="border p-3 rounded-lg"
            id="email"
            value={formData.email}
            onChange={handleChange}
          />
          <input
            type="password"
            placeholder="Password"
            className="border p-3 rounded-lg"
            id="password"
            value={formData.password}
            onChange={handleChange}
          />
          <button
            disabled={loading}
            className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
          >
            {loading ? 'Sending OTP...' : 'Send OTP'}
          </button>
        </form>
      )}

      {step ==='otp' && (
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

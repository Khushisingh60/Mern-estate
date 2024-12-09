import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../Context/Contextprovider';
import { useDispatch, useSelector } from 'react-redux';
import { signInStart ,signInFailure,signInSuccess} from '../redux/user/userSlice';
import OAuth from '../Components/OAuth';


const Signin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const {loading, error} =useSelector((state)=>state.user)
  const navigate = useNavigate();
  const dispatch=useDispatch();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(signInStart());
      const response = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      
      if (response.data.success) {
        login(response.data.user);
        localStorage.setItem('token', response.data.token);
        dispatch(signInSuccess(response.data)); // Corrected this line
        navigate('/');
      } else {
        dispatch(signInFailure(response.data.message)); // Corrected this line
        console.error('Login failed: ', response.data.message);
      }
    } catch (error) {
      dispatch(signInFailure(error.message));
      console.error('Error during login:', error);
    }
  };
  

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white shadow-md rounded-lg">
        <h2 className="text-2xl font-bold text-center text-gray-700">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-gray-600">
              Email
            </label>
            <input
              type="email"
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter Email"
              required
              className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-gray-600">
              Password
            </label>
            <input
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter Password"
              required
              className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            disabled={loading}
            type="submit"
            className="w-full px-4 py-2 text-white bg-slate-700 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
           {loading ? 'Loading...' : 'Sign in'}
          </button>
          <OAuth/>
          <p className="text-center text-gray-600">
            Don't have an account?{' '}
            <Link to="/register" className="text-blue-500 hover:underline">
              Register
            </Link>
          </p>
        </form>
      </div>
      {error && <p className="text-red-500 mt-5">{error}</p>}
    </div>
  );
};

export default Signin;

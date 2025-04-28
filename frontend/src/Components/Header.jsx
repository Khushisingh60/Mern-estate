

import { FaBookmark, FaNewspaper, FaBell, FaInfoCircle } from 'react-icons/fa'; // Import alert icon
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function Header() {
  const { currentUser } = useSelector((state) => state.user); // Access current user from Redux state
  const navigate = useNavigate();

  const handleSelectChange = (event) => {
    const value = event.target.value;
    if (value === 'apartment') navigate('/apartment');
    else if (value === 'flats') navigate('/flats');
    else if (value === 'property') navigate('/property');
  };

  return (
    <header className="bg-slate-200 shadow-md">
      <div className="flex justify-between items-center max-w-6xl mx-auto p-3">
        {/* Logo */}
        <Link to="/">
          <h1 className="font-bold text-sm sm:text-xl flex flex-wrap">
            <span className="text-slate-500 text-4xl">Estate</span>
            <span className="text-slate-700 text-2xl">Ease</span>
          </h1>
        </Link>

        {/* Dropdown Menu */}
        {/* <form className="bg-slate-100 p-3 rounded-lg flex items-center">
          <select
            className="bg-transparent focus:outline-none w-24 sm:w-64"
            defaultValue="default"
            onChange={handleSelectChange}
          >
            <option value="default" disabled>
              Choose option...
            </option>
            <option value="apartment">Apartment</option>
            <option value="flats">Flats</option>
            <option value="property">Property</option>
          </select>
        </form> */}

        {/* Navigation Links */}
        <ul className="flex gap-8 items-center text-lg">
          {/* Home
          <Link to="/">
            <li className="hidden sm:inline text-slate-700 hover:underline">Home</li>
          </Link> */}

          {/* About */}
          <Link to="/about">
          <li className="text-slate-700 flex items-center gap-1">
              <FaInfoCircle className="text-slate-600" />
              <span className="hidden sm:inline">About</span>
            </li>
          </Link>

          {/* Saved Posts - Show only if user is logged in */}
          {currentUser && (
            <Link to={`/saved/${currentUser._id}`}>
              <li className="text-slate-700  flex items-center gap-1">
                <FaBookmark className="text-slate-600" />
                <span className="hidden sm:inline">Saved</span>
              </li>
            </Link>
          )}

          {/* News Articles */}
          <Link to="/news">
            <li className="text-slate-700  flex items-center gap-1">
              <FaNewspaper className="text-slate-600" />
              <span className="hidden sm:inline">News</span>
            </li>
          </Link>

          {/* Alert Icon */}
          <li
            className="text-slate-700  flex items-center gap-1 cursor-pointer"
            onClick={() => navigate('/create-alert')}
          >
            <FaBell className="text-slate-600" />
            <span className="hidden sm:inline">Alerts</span>
          </li>

          {/* Profile / Sign In */}
          <Link to="/profile">
            {currentUser ? (
              <img
                className="rounded-full h-7 w-7 object-cover"
                src={currentUser.avatar}
                alt="profile"
              />
            ) : (
              <li className="text-slate-700 ">Sign in</li>
            )}
          </Link>
        </ul>
      </div>
    </header>
  );
}

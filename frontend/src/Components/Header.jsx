import { FaBookmark, FaNewspaper, FaBell, FaInfoCircle, FaConciergeBell } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function Header() {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();

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

        {/* Navigation Links */}
        <ul className="flex gap-8 items-center text-lg">
          {/* About */}
          <Link to="/about">
            <li className="text-slate-700 flex items-center gap-1 hover:text-slate-900">
              <FaInfoCircle className="text-slate-600" />
              <span className="hidden sm:inline">About</span>
            </li>
          </Link>

          {/* Services - NEW */}
          <Link to="/services">
            <li className="text-slate-700 flex items-center gap-1 hover:text-slate-900">
              <FaConciergeBell className="text-slate-600" />
              <span className="hidden sm:inline">Services</span>
            </li>
          </Link>

          {/* Saved Posts */}
          {currentUser && (
            <Link to={`/saved/${currentUser._id}`}>
              <li className="text-slate-700 flex items-center gap-1 hover:text-slate-900">
                <FaBookmark className="text-slate-600" />
                <span className="hidden sm:inline">Saved</span>
              </li>
            </Link>
          )}

          {/* News Articles */}
          <Link to="/news">
            <li className="text-slate-700 flex items-center gap-1 hover:text-slate-900">
              <FaNewspaper className="text-slate-600" />
              <span className="hidden sm:inline">News</span>
            </li>
          </Link>

          {/* Alert Icon */}
          <li
            className="text-slate-700 flex items-center gap-1 cursor-pointer hover:text-slate-900"
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
              <li className="text-slate-700 hover:underline">Sign in</li>
            )}
          </Link>
        </ul>
      </div>
    </header>
  );
}

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SignOut from './Pages/SignOut';
import Signin from './Pages/Signin';
import About from './Pages/About';
import Profile from './Pages/Profile';
import Home from './Pages/Home';
import Header from './Components/Header';
import SavedPosts from './Pages/SavedPosts';
import NewsList from './Pages/NewsList';
import PrivateRoute from './Components/PrivateRoute';
import CreateListing from './Pages/CreateListing';
import UpdateListing from './Pages/UpdateListing';
import Listing from './Pages/Listing';
import Search from './Pages/Search';
import CreateAlert from './Pages/CreateAlert';
import SubscriptionPage from './Pages/SubscriptionPage';
import AdminRoute from './Components/AdminROute.jsx';
import Admin from './Pages/Admin.jsx';
import Inbox from './Pages/Inbox.jsx';
import { SocketProvider } from './Context/SocketContext'; // Import the SocketProvider

export default function App() {
  return (
    <SocketProvider>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/sign-in" element={<Signin />} />
          <Route path="/sign-up" element={<SignOut />} />
          <Route path="/about" element={<About />} />
          <Route path="/saved/:userId" element={<SavedPosts />} />
          <Route path="/news" element={<NewsList />} />
          <Route path="/search" element={<Search />} />
          <Route path="/listing/:listingId" element={<Listing />} />
          <Route path="/create-alert" element={<CreateAlert />} />
          <Route path="/subscription" element={<SubscriptionPage />} />
          <Route path="/inbox" element={<Inbox />} />

          <Route element={<AdminRoute />}>
            <Route path="/admin-dashboard" element={<Admin />} />
          </Route>
          <Route element={<PrivateRoute />}>
            <Route path="/profile" element={<Profile />} />
            <Route path="/create-listing" element={<CreateListing />} />
            <Route path="/update-listing/:listingId" element={<UpdateListing />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </SocketProvider>
  );
}

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SignOut from './Pages/SignOut.jsx';
import Signin from './Pages/Signin.jsx';
import About from './Pages/About.jsx';
import Profile from './Pages/Profile.jsx';
import Home from './Pages/Home.jsx';
import Header from './components/Header.jsx';
import SavedPosts from './Pages/SavedPosts.jsx';
import NewsList from './Pages/NewsList.jsx';
import PrivateRoute from './components/PrivateRoute.jsx';
import CreateListing from './Pages/CreateListing.jsx';
import UpdateListing from './Pages/UpdateListing.jsx';
import Listing from './Pages/Listing.jsx';
import Search from './Pages/Search.jsx';
import CreateAlert from './Pages/CreateAlert.jsx';
import SubscriptionPage from './Pages/SubscriptionPage.jsx';
import AdminRoute from './components/AdminROute.jsx';
import Admin from './Pages/Admin.jsx';
import Inbox from './Pages/Inbox.jsx';
import { SocketProvider } from './Context/SocketContext.jsx'; // Import the SocketProvider

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
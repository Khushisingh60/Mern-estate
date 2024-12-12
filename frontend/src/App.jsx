import {BrowserRouter, Routes,Route} from 'react-router-dom'
import SignOut from './Pages/SignOut'
import Signin from './Pages/Signin'
import About from './Pages/About'
import Profile from './Pages/Profile'
import Home from './Pages/home'
import Header from './Components/Header'

import PrivateRoute from './Components/PrivateRoute'
import CreateListing from './Pages/CreateListing';
import UpdateListing from './Pages/UpdateListing';
import Listing from './Pages/Listing';
import Search from './Pages/Search';


export default function App(){
  return (
  
  <BrowserRouter>
  <Header/>
  <Routes>
    <Route path='/' element={<Home/>}/>
    <Route path='/sign-in' element={<Signin/>}/>
    <Route path='/sign-up' element={<SignOut/>}/>
    <Route path='/about' element={<About/>}/>
    <Route path='/search' element={<Search />} />
        <Route path='/listing/:listingId' element={<Listing />} />
    <Route element={<PrivateRoute/>}>
    <Route path='/profile' element={<Profile />} />
          <Route path='/create-listing' element={<CreateListing />} />
          <Route
            path='/update-listing/:listingId'
            element={<UpdateListing />}
          />
    </Route>
  
  </Routes>
  </BrowserRouter>
  
  );
}



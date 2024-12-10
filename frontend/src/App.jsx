import {BrowserRouter, Routes,Route} from 'react-router-dom'
import SignOut from './Pages/SignOut'
import Signin from './Pages/Signin'
import About from './Pages/About'
import Profile from './Pages/Profile'
import Home from './Pages/home'
import Header from './Components/Header'
import Contextprovider from './Context/Contextprovider';
import PrivateRoute from './Components/PrivateRoute'

export default function App(){
  return (
  <Contextprovider>
  <BrowserRouter>
  <Header/>
  <Routes>
    <Route path='/' element={<Home/>}/>
    <Route path='/sign-in' element={<Signin/>}/>
    <Route path='/sign-up' element={<SignOut/>}/>
    <Route path='/about' element={<About/>}/>
    <Route element={<PrivateRoute/>}>
      <Route path='/profile' element={<Profile/>}/>
    </Route>
  
  </Routes>
  </BrowserRouter>
  </Contextprovider>
  );
}



import React, { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import Login from './pages/auth/login/Login';
import Home from './pages/home/Home';
import Signup from './pages/auth/signup/Signup';
import Sidebar from './components/common/Sidebar';
import RightPanel from './components/common/RightPanel';

const App = () => {
  return (
    <div className='flex max-w-6xl mx-auto'>
      <Sidebar />
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/signup' element={<Signup/>}/>
        <Route path='/notifications' element={<Notification />}/>
        <Route path='/profile/:username' element={<Profile />}/>
      </Routes>
      <RightPanel />
    </div>
  )
  };

export default App;
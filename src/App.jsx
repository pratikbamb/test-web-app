import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import {
  FusionAuthLoginButton,
  FusionAuthLogoutButton,
  RequireAuth,
  useFusionAuth
} from '@fusionauth/react-sdk';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Manatee from './components/Manatee/Manatee';
import Auth from './components/Auth/Auth';
import Account from './components/Account/Account';
import Otp from './components/Otp/Otp';


function App() {
  const { isAuthenticated, user } = useFusionAuth();

  console.log("isAuthenticated: ", isAuthenticated);
  console.log("user: ", user);

  return (
    <>
      <header></header>
      <BrowserRouter>
        <Routes>
          <Route path="/account" element={<Account />} />
          <Route path="/manatee" element={<Manatee />} />
          <Route path="/otp" element={<Otp />} />
          <Route path="/" element={<Auth />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App


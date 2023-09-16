import {
  FusionAuthLogoutButton,
  RequireAuth,
  useFusionAuth
} from '@fusionauth/react-sdk';
import React from 'react';
import axios from 'axios';
import { Navigate } from 'react-router-dom';

export default function Manatee() {
  const { isAuthenticated, user } = useFusionAuth();

  async function getTokenAndRedirectToAccountPage() {
    const cookiesString = document.cookie;
    console.log("cookie: ", cookiesString)
    const url = `http://localhost:8087/api/jwt-token`;
    const payload = {
      claims: {
        'new': 'abc'
      },
      "tenantId": "d7bf815e-0c07-4ff7-9e23-45c9a6b7fb44"
    };
    const options = {
      withCredentials: true
    };
    // const res = await axios.post(url, payload, options);
    const res = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    })
    console.log("res: ", res);
  }

  return (
    <>
      {isAuthenticated ?
        <div>
          <RequireAuth>Welcome {user.name}</RequireAuth><br />
          <FusionAuthLogoutButton />
        </div> : <Navigate to='/' />
      }
    </>
  )
}
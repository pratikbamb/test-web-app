import { Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import './Auth.css'
import {
  FusionAuthLoginButton,
  useFusionAuth
} from '@fusionauth/react-sdk';
import Cookies from 'js-cookie';
import axios from 'axios';
import { useEffect, useState } from 'react';
import Error from '../Error/Error';


function Auth() {
  const [phNumberValue, setPhNumberValue] = useState('');
  const [errorMessagesValue, setErrorMessagesValue] = useState([]);
  const [stateValue, setStateValue] = useState('');
  const { isAuthenticated, user } = useFusionAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  console.log("isAuthenticated: ", isAuthenticated);
  console.log("user: ", user);

  const clientId = 'dd122ca6-7039-4ac8-b464-dc4420eb8a9e';

  let externalUrls = {
    authUrl: 'https://auth.digico.onebyzero.ai',
    // authUrl: 'http://localhost:9011',
    redirectUrl: 'https://test-web.digico.onebyzero.ai',
    authApiUrl: 'https://authapi.digico.onebyzero.ai',
    // authApiUrl: 'http://localhost:8088'
  };
  // let externalUrls = {
  //   authUrl: 'http://localhost:9011',
  //   redirectUrl: 'http://localhost:5173',
  //   authApiUrl: 'http://localhost:8088'
  // };


  const handlePhNumberChange = (event) => {
    console.log("phNumber: ", event.target.value);
    setPhNumberValue(event.target.value);
  }

  useEffect(() => {
    !isAuthenticated ? triggerLoginButton() : null;

    if (searchParams.get("errorMessage")) {
      setErrorMessagesValue(searchParams.getAll("errorMessage"));
    }
  }, []);

  const handlePasswordlessClick = async () => {
    console.log("Inside handlePasswordlessClick");

    if (!phNumberValue) {
      setErrorMessagesValue(['Contact Number required']);
      return;
    }
    const config = {
      method: 'POST',
      url: `${externalUrls.authApiUrl}/api/auth/passwordless/otp/generate/app`,
      data: {
        loginId: phNumberValue,
        client_id: clientId
      }
    }
    try {
      await axios.post(config.url, config.data);
      setErrorMessagesValue([]);
      navigate('/otp', {
        replace: false,
        state: {
          client_id: clientId,
          code_challenge_method: safeEncode('input[name="code_challenge_method"]', false),
          code_challenge: safeEncode('input[name="code_challenge"]', false),
          redirect_uri: safeEncode('input[name=redirect_uri]', false),
          response_type: safeEncode('input[name=response_type]', false),
          scope: safeEncode('input[name=scope]', false),
          state: stateValue,
          tenantId: safeEncode('input[name=tenantId]', false),
          additionalParams: {
            app_redirect_url: externalUrls.redirectUrl
          }
        }
      });
    }
    catch (error) {
      console.log("error occurred while sending otp. details: ", error.response);
      setErrorMessagesValue([error.response.data.message]);
    }
  }

  const triggerLoginButton = async () => {
    const stateParam = `${generateRandomString()}:`;
    console.log("stateParam: ", stateParam)
    Cookies.set('lastState', stateParam);

    const url = `${externalUrls.authUrl}/app/login?client_id=${clientId}&scope=openid+offline_access&redirect_uri=${externalUrls.redirectUrl}&state=${stateParam}:&`;
    const res = await axios.get(url,
      {
        withCredentials: true
      }
    );
    // console.log("res: ", res.data);

    const parser = new DOMParser();
    const htmlDoc = parser.parseFromString(res.data, 'text/html');
    console.log("htmlDoc: ", htmlDoc);
    const formDiv = htmlDoc.getElementById('oauth-id');
    console.log("formDiv: ", formDiv);
    const appFormDiv = document.getElementById('app-form-id');

    if (!appFormDiv.hasChildNodes()) {
      const federatedCsrf = htmlDoc.getElementById('login-button-container').dataset['federatedCsrf'];
      console.log("federatedCsrf: ", federatedCsrf);
      document.getElementById('login-button-container').setAttribute('data-federated-csrf', federatedCsrf);
      console.log("appFormDiv.hasChildNodes(): ", appFormDiv.hasChildNodes());

      appFormDiv.appendChild(formDiv);
    }

    console.log("resp: ", res.request.responseURL);
    const redirectURL = res.request.responseURL;
    const params = new URLSearchParams(new URL(redirectURL).search);
    let queryParamsObject = {}
    for (const [key, value] of params.entries()) {
      queryParamsObject[key] = value;
    }


    setStateValue(captureState(stateParam));
    console.log("stateValue: ", captureState());

    return queryParamsObject;
  }

  const safeEncode = (selector, encode = true) => {
    var element = document.querySelector(selector);
    if (element === null) {
      return '';
    }

    if (encode)
      return encodeURIComponent(element.value);
    else
      return element.value;
  }

  const captureState = (stateParam) => {
    var state = {
      c: clientId,
      r: externalUrls.redirectUrl,
      s: stateParam
    }

    // It should not be necessary to encode this Base64 encoded string, but it should not hurt.
    return encodeURIComponent(base64URLEncode(JSON.stringify(state)));
  }

  const base64URLEncode = (s) => {
    return btoa(s).replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
  }

  function dec2hex(dec) {
    return ('0' + dec.toString(16)).substr(-2);
  }

  function generateRandomString() {
    const array = new Uint32Array(56 / 2);
    window.crypto.getRandomValues(array);
    return Array.from(array, dec2hex).join('');
  }

  return (
    <>
      {isAuthenticated ? <Navigate to='/manatee' /> :
        <main className='page-body container'>
          <div id="app-form-id"></div>
          {errorMessagesValue.map((errorMessage, i) => {
            // return <p key={i}>{errorMessage}</p>
            return <Error key={i} message={errorMessage}></Error>
          })}
          <div className='flex flex-col'>
            <div className=''>
              <div className="panel">
                <main>
                  {/* <FusionAuthLoginButton /> */}

                  <div id="login-button-container" className="login-button-container">
                    <div>
                      <form>
                        <input className="inputText" name="" placeholder='Enter Mobile Number' value={phNumberValue} onChange={handlePhNumberChange} />
                      </form>
                      <button className="passwordless-login-button mt-10" onClick={handlePasswordlessClick}>
                        <div className="login-button">
                          <div>
                            <div className="text">Login</div>
                          </div>
                        </div>
                      </button>
                    </div>
                    <div className='or-wrapper'>
                      <p>------ OR ------</p>
                    </div>
                    <div className='form-row'>
                      <button id="google-login-button" className="google login-button" data-login-method="UseRedirect" data-scope="openid profile email" data-identity-provider-id="82339786-3dff-42a6-aac6-1f1ceecb6c46">
                        <div>
                          <div className="icon">
                            <svg version="1.1" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                              <g>
                                <path className="cls-1" fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                                <path className="cls-2" fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                                <path className="cls-3" fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                                <path className="cls-4" fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                                <path className="cls-5" fill="none" d="M0 0h48v48H0z"></path>
                              </g>
                            </svg>
                          </div>
                          <div className="text">Sign in with Google</div>
                        </div>
                      </button>
                    </div>
                    <div className='form-row'>
                      <button id="twitter-login-button" className="twitter login-button">
                        <div>
                          <div className="icon">
                            <svg version="1.1" fill="none" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
                              <g>
                                <rect className="cls-1" fill="none" width="400" height="400"></rect>
                              </g>
                              <g>
                                <path className="cls-2" fill="#fff" d="M153.62,301.59c94.34,0,145.94-78.16,145.94-145.94,0-2.22,0-4.43-.15-6.63A104.36,104.36,0,0,0,325,122.47a102.38,102.38,0,0,1-29.46,8.07,51.47,51.47,0,0,0,22.55-28.37,102.79,102.79,0,0,1-32.57,12.45,51.34,51.34,0,0,0-87.41,46.78A145.62,145.62,0,0,1,92.4,107.81a51.33,51.33,0,0,0,15.88,68.47A50.91,50.91,0,0,1,85,169.86c0,.21,0,.43,0,.65a51.31,51.31,0,0,0,41.15,50.28,51.21,51.21,0,0,1-23.16.88,51.35,51.35,0,0,0,47.92,35.62,102.92,102.92,0,0,1-63.7,22A104.41,104.41,0,0,1,75,278.55a145.21,145.21,0,0,0,78.62,23"></path>
                                <rect className="cls-3" fill="none" width="400" height="400"></rect>
                              </g>
                            </svg>
                          </div>
                          <div className="text">Login with Twitter</div>
                        </div>
                      </button>
                    </div>
                  </div>
                </main>
              </div>
            </div>
          </div>
        </main>
      }
    </>
  )
}

export default Auth;


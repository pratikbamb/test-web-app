import { useLocation, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useEffect, useState } from 'react';
import './Otp.css';
import Error from '../Error/Error';

function Otp() {
  const params = useLocation();
  const data = params.state;
  console.log("data: ", data);
  const navigate = useNavigate();
  const [otpValue, setOtpValue] = useState('');
  const [errorMessagesValue, setErrorMessagesValue] = useState([]);


  let externalUrls = {
    authUrl: 'https://auth.digico.onebyzero.ai',
    redirectUrl: 'https://test-web.digico.onebyzero.ai',
    authApiUrl: 'https://authapi.digico.onebyzero.ai',
    // authApiUrl: 'http://localhost:8088'
  };
  // let externalUrls = {
  //   authUrl: 'http://localhost:9011',
  //   redirectUrl: 'http://localhost:5173',
  //   authApiUrl: 'http://localhost:8088'
  // };

  const handleOtpChange = (event) => {
    setOtpValue(event.target.value);
  }

  useEffect(() => {
    if (!data) {
      navigate('/', { replace: false });
    }
  }, []);

  const handlePasswordlessClick = async () => {
    console.log("Inside handlePasswordlessClick");

    if (!otpValue) {
      setErrorMessagesValue(['OTP required']);
      return;
    }
    const config = {
      method: 'POST',
      url: `${externalUrls.authApiUrl}/api/auth/passwordless/otp/verify/app`,
      data: {
        ...data,
        otp: otpValue
      }
    }
    try {
      const res = await axios.post(config.url, config.data);
      console.log("otp api res: ", res);

      window.location.replace(res.data.url);
    }
    catch (error) {
      console.log("error occurred while sending otp. details: ", error.response);
      navigate('/', { replace: false })
    }
  }

  return (
    <>
      <main className='page-body container'>
        <button className='back-btn' onClick={() => navigate(-1)}>Back</button>
        {errorMessagesValue.map((errorMessage, i) => {
          // return <p key={i}>{errorMessage}</p>
          return <Error key={i} message={errorMessage}></Error>
        })}
        <div className='flex flex-col'>
          <div className=''>
            <div className="panel">
              <main>
                <div>
                  <form>
                    <input className="inputText" name="" placeholder='Enter OTP' value={otpValue} onChange={handleOtpChange} />
                  </form>
                  <button className="passwordless-login-button mt-10" onClick={handlePasswordlessClick}>
                    <div className="magic login-button">
                      <div>
                        <div className="text">Submit</div>
                      </div>
                    </div>
                  </button>
                </div>
              </main>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}

export default Otp;


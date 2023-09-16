import React from 'react'
import ReactDOM from 'react-dom/client'
import { FusionAuthProvider } from '@fusionauth/react-sdk';
import App from './App.jsx';
import './index.css';
import 'bootstrap/dist/css/bootstrap.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* <FusionAuthProvider
      clientID="674f7454-5a36-440d-9e53-f9a494bbefbe" // React Test App
      // clientID="17490967-83d7-421a-848c-3034df2be984" // Test App
      // clientID="6570c81c-7b3a-43eb-99d1-66cc430e40e6" // Test App 2
      serverUrl="http://localhost:9011"
      redirectUri="http://localhost:5173"
    > */}
    {/* <FusionAuthProvider
      clientID="dd122ca6-7039-4ac8-b464-dc4420eb8a9e" // React Test App
      serverUrl="http://localhost:9012"
      redirectUri="http://localhost:5173"
    > */}
    {/* <FusionAuthProvider
      clientID="dd122ca6-7039-4ac8-b464-dc4420eb8a9e" // Fusionauth Kickstart Test App
      serverUrl="http://localhost:9011"
      redirectUri="http://localhost:5173"
    > */}
    <FusionAuthProvider
      clientID="dd122ca6-7039-4ac8-b464-dc4420eb8a9e" // Fusionauth Kickstart Test App
      serverUrl="https://auth.digico.onebyzero.ai"
      redirectUri="https://test-web.digico.onebyzero.ai"
    // serverUrl="http://localhost:9011"
    // redirectUri="http://localhost:5173"
    >
      <App />
    </FusionAuthProvider>

  </React.StrictMode>
)


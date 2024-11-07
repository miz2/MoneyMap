import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { Auth0Provider } from '@auth0/auth0-react';
import { SnackbarProvider } from 'notistack';
const domain = 'dev-qhu3xskn561ovjha.us.auth0.com';
const clientId = 'DDFxCbMNHmwFvV6VIYmtLcqOn0XZkcyZ';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <SnackbarProvider maxSnack={3}>
      <Auth0Provider
        domain={domain}
        clientId={clientId}
        authorizationParams={{
          redirect_uri: window.location.origin,
        }}
      >
        <App />
      </Auth0Provider>
    </SnackbarProvider>
  </React.StrictMode>
);

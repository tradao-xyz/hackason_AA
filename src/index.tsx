import '@rainbow-me/rainbowkit/styles.css'
import React from 'react';
import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
import { MantineProvider } from '@mantine/core';
import ZeroDevWrapper from './ZeroDevWrapper';
import { NotificationsProvider } from '@mantine/notifications';
import { HashRouter, Route, Routes } from 'react-router-dom';
import { SessionKeyExample } from './SessionKeyPage';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <MantineProvider theme={{ colorScheme: 'dark' }} withGlobalStyles withNormalizeCSS>
      <NotificationsProvider>
        <ZeroDevWrapper>
          <HashRouter>
            <Routes>
              <Route path="/:tgId/:scw/:publicKey/:verificationCode" element={<SessionKeyExample />}></Route>
              <Route path="/" element={<SessionKeyExample />}></Route>
            </Routes>
          </HashRouter>
        </ZeroDevWrapper>
      </NotificationsProvider>
    </MantineProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

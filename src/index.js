import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import LoginProvider from './context/LoginProvider';
import ChatListUserDataProvider  from './context/ChatListUserDataProvider';
import AuthProvider from './context/AuthProvider';
import OnlineProvider from './context/onlineProvider';

ReactDOM.render(
  <React.StrictMode>
   <LoginProvider>
     <AuthProvider>
       <OnlineProvider>
          <App/>
       </OnlineProvider>
      </AuthProvider>
   </LoginProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

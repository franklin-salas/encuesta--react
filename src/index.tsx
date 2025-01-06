import React from 'react';
import ReactDOM from 'react-dom';
import 'react-confirm-alert/src/react-confirm-alert.css';
import './index.scss';
import App from './App';
import axios from "axios"

axios.defaults.headers.common['Accept-Language'] = 'es';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);


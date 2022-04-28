import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';

import './index.css';
import "./assets/css/bootstrap.min.css";
import App from './App';

import reportWebVitals from './reportWebVitals';
import { DAppProvider, ChainId } from '@usedapp/core'
import { Web3Provider } from "@ethersproject/providers";
import {
  Web3ReactProvider
} from "@web3-react/core";

function getLibrary(provider) {
  const library = new Web3Provider(provider);
  library.pollingInterval = 8000;
  return library;
}

ReactDOM.render(
  <Web3ReactProvider getLibrary={getLibrary}>
    <DAppProvider config={{}}>
      <Router>
        <App />
      </Router>
    </DAppProvider>
  </Web3ReactProvider>,
  document.getElementById('root')
);

reportWebVitals();

import React from 'react';
import ReactDOM from 'react-dom/client';
import {RecoilRoot} from 'recoil';
import {BrowserRouter} from 'react-router-dom';
import App from './App.jsx';
import './assets/scss/Global.scss';

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <RecoilRoot>
            <BrowserRouter>
                <App/>
            </BrowserRouter>
        </RecoilRoot>
    </React.StrictMode>,
);
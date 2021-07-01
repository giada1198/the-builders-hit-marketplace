import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import 'semantic-ui-css/semantic.min.css';

import firebase from "firebase/app";
import "firebase/analytics";
import "firebase/auth";
import "firebase/firestore";
import 'firebase/database';

const firebaseConfig = {
	apiKey: "AIzaSyA0C4MHyb4kHKfpSaYFouem-Q7GaDYMGNg",
	authDomain: "i-agree-to-the-terms.firebaseapp.com",
	projectId: "i-agree-to-the-terms",
	storageBucket: "i-agree-to-the-terms.appspot.com",
	messagingSenderId: "799799155443",
	appId: "1:799799155443:web:0c04df0c0ebb0410a63586",
	measurementId: "G-VCQ26SJKJS"
};

// initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

ReactDOM.render(
	<React.StrictMode>
		<App />
	</React.StrictMode>,
	document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
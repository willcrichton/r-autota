import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

const url = new URL(window.location.href);
const socket = decodeURIComponent(url.searchParams.get('socket'));
let props = url.searchParams.get('q');

if (props != null) {
  const props_clean = props.replace(/\./g, '+').replace(/_/g, '/');
  props = JSON.parse(atob(props_clean));
} else {
  props = {};
}

ReactDOM.render(<App socket={socket} {...props} />,
                document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

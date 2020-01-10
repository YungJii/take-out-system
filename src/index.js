import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { HashRouter as Router } from 'react-router-dom';

ReactDOM.render(
    <Router>
      <App></App>
    </Router>
    ,
    document.getElementById('root')
);

React.$utils = {
  deepClone: (obj) => {
    var newObj = obj instanceof Array ? [] : {};
    for (var item in obj) {
      var template = typeof obj[item] == 'object' ? React.$utils.deepClone(obj[item]) : obj[item];
      newObj[item] = template;
    }
    return newObj;
  }
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

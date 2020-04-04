import React from 'react';
import ReactDOM from 'react-dom';
import 'antd/dist/antd.css';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { BrowserRouter as Router } from 'react-router-dom';

// import { createStore } from 'redux'
// import message from './reducers/index'
// const store = createStore(message)

const axios = require('axios')

ReactDOM.render(
    <Router>
      {/* state={store.getState()}
      onFresh={() => store.dispatch({ type: 'FRESHLIST' })}
      onReFreshState={() => store.dispatch({ type: 'REFRESHLIST' })} */}
      <App/>
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
  },
  monitor: () => {
    if (window.localStorage.getItem('order_message') !== null) {
      axios.post('/api/order/getOrderInfoByNum', {
        num: window.localStorage.getItem('order_message')
      })
      .then((res) => {
        console.log(res.data.message)
      })
    }
  }
}



// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

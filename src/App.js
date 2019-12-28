import React, { Component } from 'react';
import NavTabBar  from './components/Main.js';
import 'antd-mobile/dist/antd-mobile.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {  }
  }
  render() { 
    return ( 
      <NavTabBar/>
    );
  }
}
 
export default App;

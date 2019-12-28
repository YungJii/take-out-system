import React, { Component } from 'react';
import TakeOutMain from './Content/takeOut/takeOutMain.js';
import Order from './Content/order/orderMain.js';
import Mine from './Content/mine/mineMain.js';
import Footer from './Content/footer/footer.js';
import {BrowserRouter,Route,Switch} from 'react-router-dom';
import '../scss/NavTabBar.scss';

class NavTabBar extends Component {
    constructor(props) {
      super(props);
      this.state = {
      };
    }

    componentDidMount() {
    }

  
    render() {
      return (
        <BrowserRouter>
          <div>
            <Route exact path='/'  component={TakeOutMain}/>
            <Route  path='/order' component={Order}/>
            <Route  path='/mine' component={Mine}/>
            <Switch>
              <Footer/>
            </Switch>
          </div>
        </BrowserRouter>
      );
    }
  }
 
export default NavTabBar;
import React, { Component } from 'react';
import TakeOutMain from './Content/takeOut/takeOutMain.js';
import Order from './Content/order/orderMain.js';
import Mine from './Content/mine/mineMain.js';
import Footer from './Content/footer/footer.js';
import {BrowserRouter,Route,Switch} from 'react-router-dom';
import ShopDetails from './Content/shop/shop.js'
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
      const Shop=({ match })=>{
        return <ShopDetails id={match.params.id}/>
      }
      return (
        <BrowserRouter>
          <div>
            <Route exact path='/'  component={TakeOutMain}/>
            <Route  path='/order' component={Order}/>
            <Route  path='/mine' component={Mine}/>
            <Switch>
              <Route  path='/shop/:id' component={Shop}/>
              <Footer/>
            </Switch>
          </div>
        </BrowserRouter>
      );
    }
  }
 
export default NavTabBar;
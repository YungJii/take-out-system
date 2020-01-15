import React, { Component } from 'react';
import TakeOutMain from './Content/takeOut/takeOutMain.js';
import Order from './Content/order/orderMain.js';
import Mine from './Content/mine/mineMain.js';
import Footer from './Content/footer/footer.js';
import {BrowserRouter,Route,Switch} from 'react-router-dom';
import ShopDetails from './Content/shop/shop.js'
import Login from './Content/login/login.js'
import Setting from './Content/setting/setting.js'
import SearchResult from './Content/searchResult/searchResult.js'
import ShopOrder from './Content/shop/shopOrder/shopOrder.js'
import InfoTips from './common/infoTips.js'
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
      const Search=({ match })=>{
        return <SearchResult name={match.params.name}/>
      }
      return (
        <BrowserRouter>
          <div>
            <InfoTips/>
            <Route exact path='/'  component={TakeOutMain}/>
            <Route  path='/order' component={Order}/>
            <Route  path='/mine' component={Mine}/>
            <Switch>
              <Route  path='/shop/:id' component={Shop}/>
              <Route  path="/shopOrder" component={ShopOrder} />
              <Route  path='/search/:name' component={Search}/>
              <Route  path='/login' component={Login}/>
              <Route  path='/setting_info' component={Setting}/>
              <Footer/>
            </Switch>
          </div>
        </BrowserRouter>
      );
    }
  }
 
export default NavTabBar;
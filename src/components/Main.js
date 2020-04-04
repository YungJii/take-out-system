import React, { Component } from 'react';
import TakeOutMain from './Content/takeOut/takeOutMain.js';
import Order from './Content/order/orderMain.js';
import Mine from './Content/mine/mineMain.js';
import Footer from './Content/footer/footer.js';
import {BrowserRouter,Route,Switch} from 'react-router-dom';
import ShopDetails from './Content/shop/shop.js'
import Login from './Content/login/login.js'
import Setting from './Content/setting/setting.js'
import LuckDraw from './Content/luckDraw/luckDraw.js'
import LuckDrawRecord from './Content/luckDraw/luckDrawRecord.js'
import Coupon from './Content/luckDraw/coupon.js'
import SearchResult from './Content/searchResult/searchResult.js'
import ShopOrder from './Content/shop/shopOrder/shopOrder.js'
import Activity from './Content/activity/activity.js'
import ActivityDetails from './Content/activity/activityDetails.js'
import Hall from './Content/hall/hall.js'
import InfoTips from './common/infoTips.js'
import '../scss/NavTabBar.scss';
// import { createStore } from 'redux'
// import message from '../reducers/index'
// const store = createStore(message)

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
      const AcDetails =({ match })=>{
        return <ActivityDetails name={match.params.id}/>
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
              <Route  path='/activity' component={Activity}/>
              <Route  path='/activities/:id' component={AcDetails}/>
              <Route  path="/shopOrder" component={ShopOrder}/>
              <Route  path='/search/:name' component={Search}/>
              <Route  path='/login' component={Login}/>
              <Route  path='/setting_info' component={Setting}/>
              <Route  path='/showing_luckDraw' component={LuckDraw}/>
              <Route  path='/showing_luckDrawRecord' component={LuckDrawRecord}/>
              <Route  path='/showing_coupon' component={Coupon}/>
              <Route  path='/hall' component={Hall}/>
              <Footer/>
            </Switch>
          </div>
        </BrowserRouter>
      );
    }
  }
 
export default NavTabBar;
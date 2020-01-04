/* eslint-disable react/jsx-pascal-case */
import React, { Component } from 'react';
import '../../../scss/shop.scss';
import Tabs_li from './tabs.js'
import CommoditySmart from './commoditySmart.js'
const axios = require('axios');

class Shop extends Component {
    constructor(props) {
        super(props);
        this.state = {
            storeId: null,
            message: {}
        }
    }
    componentWillMount() {
        this.setState({
            storeId: this.props.id
        }, () => {
            this.getBusinessData()
        })
    }

    // 获取单个商家
    getBusinessData() {
        axios.get('/api/store/one', {
            params: {
                storeId: this.state.storeId
            }
        })
        .then( (res) => {
            console.log(res.data.message)
            this.setState({
                message: res.data.message
            })
        })
    }

    render() {
        const data=[
			{
				title:'点餐',
				num:0
			},
			{
				title:'评价',
				num:1
			},
			{
				title:'商家',
				num:2
			}
		]
        return (
            <div>
                <div className="shoplist_header">
                    {/* <div className='shoplist_header_bg'>
                        <div className='header_bg' style={{backgroundImage: `url(${window.config_url}${this.state.message.img})`}}>
                        </div>
                        <nav>
                            <a href="javascript:history.back()" className='back'>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 32" version="1.1"><path fill="#fff" d="M16.552 5.633l-2.044-2.044L2.243 15.854l12.265 12.557 2.044-2.044L6.331 15.854z"/></svg>
                            </a>
                        </nav>
                    </div> */}
                    <div className="shoplist_header_main">
                        <div className='shoplist_header_bg'>
                            <div className='header_bg' style={{backgroundImage: `url(${window.config_url}${this.state.message.img})`}}>
                            </div>
                        </div>
                        <div className="header_main_img">
                            <img src={`${window.config_url}${this.state.message.img}`} alt="" />
                        </div>
                        <div className="header_main_details">
                            <div className="details_name">{this.state.message.name}</div>
                            <div className="details_gradenum">
                                <span>评价 {this.state.message.grade}</span>
                                <span>月售 {this.state.message.orderNum}</span>
                            </div>
                        </div>
                    </div>
                </div>
                    <Tabs_li data={data}>
                            <CommoditySmart key={0} storeId={this.state.storeId} arriveMoney={this.state.message.arriveMoney}></CommoditySmart>
                            <div key={1}>321</div>
                            <div key={2}>222</div>
                    </Tabs_li>
            </div>
         );
    }
}
 
export default Shop;
/* eslint-disable react/jsx-pascal-case */
import React, { Component } from 'react';
import '../../../scss/shop.scss';
import Tabs_li from './tabs.js'
import CommoditySmart from './commoditySmart.js'
import ShopInformationSmart from './shopInformationSmart.js'
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
            <div className="scrollBox">
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
                    <nav>
                        <a href="/" className='back'>
                            <svg t="1578651010018" className="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2250" width="200" height="200"><path d="M366.32213 511.145539l377.388162-377.387139c15.865339-15.852036 15.865339-41.571814 0-57.422828-15.864316-15.864316-41.557488-15.864316-57.421804 0l-406.100088 406.099065c-15.864316 15.852036-15.864316 41.570791 0 57.421804l406.100088 406.100088c7.93267 7.93267 18.315134 11.899004 28.711926 11.899005 10.381441 0 20.778232-3.966335 28.710902-11.899005 15.865339-15.851013 15.865339-41.571814 0-57.422827L366.32213 511.145539z" p-id="2251" fill="#2c2c2c"></path></svg>
                        </a>
                    </nav>
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
                            <CommoditySmart key={0} storeId={this.state.storeId} arriveMoney={this.state.message.arriveMoney} fee={this.state.message.fee}></CommoditySmart>
                            <div key={1}>321</div>
                            <ShopInformationSmart key={2} storeId={this.state.storeId}></ShopInformationSmart>
                    </Tabs_li>
            </div>
         );
    }
}
 
export default Shop;
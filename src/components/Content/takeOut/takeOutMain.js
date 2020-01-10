import React, { Component } from 'react';
import { Icon } from 'antd';
import Search from '../../common/Search.js';
import Slick from './Slick.js';
import '../../../scss/headerMain.scss';
import BusinessList from '../../common/businessList.js'
const axios = require('axios');

class TakeOutMain extends Component {
    constructor(props) {
        super(props);
        this.state = {
            store_data: [],
            page: 1,
            noMore: false,
            opa: true
        }
    }
    componentWillMount() {
        if (localStorage.getItem('user') === null) {
            window.location.href=`/login`;
        }

        this.getBusinessList()
    }

    componentDidMount(){
		this.isUnmount = false;
		document.addEventListener('scroll',this._more.bind(this))
    }
    componentWillUnmount(){
		this.isUnmount = true;
		document.removeEventListener('scroll',this._more.bind(this))
	}

    // 请求推荐商家列表
    getBusinessList() {
        axios.get(`/api/store/list?page=${this.state.page}`)
        .then( (res) => {
            console.log(res)
            if (res.data.message.data.length !== 10) {
                this.setState({
                    noMore: true
                })
            }
            this.setState({
                store_data: this.state.store_data.concat(res.data.message.data)
            })
        })
    }

    _more() {
        this._throttle(this.resizeTop, this);
    }
    
    resizeTop() {
        if(document.documentElement.scrollTop === 0) {
            this.setState({
                opa: true
            })
        }
        if(document.documentElement.scrollTop > 1000) {
            this.setState({
                opa: false
            })
        }
        if (this.flag) {return;}
        if (this.state.noMore) {return;}
        if (document.documentElement.scrollTop > window.document.body.offsetHeight && document.documentElement.scrollTop - window.document.body.offsetHeight > 650) {
            this.flag = true
            if(this.isUnmount) {return}
            this.setState({
                page: this.state.page + 1
            })
            this.getBusinessList()
        }
    }
    // 函数节流
    _throttle(method,context){
		clearTimeout(method.tId);
		method.tId=setTimeout(function(){
			method.call(context)
		},100)
    }
    
    // 回到顶部
    handleGoBack(){
        document.documentElement.scrollTop =  0;
    }
    
    

    render() { 
        return ( 
            <div>
                <div className="headerMain">
                    <div className="headerMain-content">
                        <div><Icon type="environment"/><span className="headerMain-address">宇宙中心</span></div>
                        {/* 搜索、滚动 */}
                        <div><Search /></div>
                        <div><Slick /></div>
                    </div>
                </div>
                {/* 商家活动 */}
                <div className="bcw100">
                    <div className="activityMain">
                        <p className="activityMain_title">商家活动</p>
                        <img src={require("../../../assets/images/Advertisement/business_activity.jpg")} alt=""></img>
                    </div>
                </div>
                {/* 推荐商家 */}
                <div className="bcw100">
                    <div className="recommend">
                        <p className="recommend_title">推荐商家</p>
                        {/* <div className="recommend_screen">
                            <span className="recommend_screen_cur">综合排序</span>
                            <span>销量</span>
                            <span>价格升序</span>
                            <span>价格降序</span>
                        </div> */}
                        <div>
                            {this.state.store_data.map((value,index)=>{return <BusinessList data={value} key={index}/>})}
                            {this.state.noMore?<div className='noMore'>没有更多了哦~</div> : 
                            <div className="loadMore"> 
                                <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="16" height="16">
                                <path d="M955.261 575.322h-126.643c-34.955 0-63.322-28.37-63.322-63.322s28.37-63.322 63.322-63.322h126.643c34.955 0 63.322 28.37 63.322 63.322s-28.37 63.322-63.322 63.322v0zM780.616 332.925c-24.696 24.696-64.842 24.696-89.538 0s-24.696-64.842 0-89.538l89.538-89.538c24.696-24.696 64.842-24.696 89.538 0s24.696 64.842 0 89.538l-89.538 89.538zM512 1018.582c-34.955 0-63.322-28.37-63.322-63.322v-126.643c0-34.955 28.37-63.322 63.322-63.322s63.322 28.37 63.322 63.322v126.643c0 34.955-28.37 63.322-63.322 63.322v0zM512 258.707c-34.955 0-63.322-28.37-63.322-63.322v-126.643c0-34.955 28.37-63.322 63.322-63.322s63.322 28.37 63.322 63.322v126.643c0 34.955-28.37 63.322-63.322 63.322v0zM243.384 870.157c-24.696 24.696-64.842 24.696-89.538 0s-24.696-64.842 0-89.538l89.538-89.538c24.696-24.696 64.842-24.696 89.538 0s24.696 64.842 0 89.538l-89.538 89.538zM243.384 332.925l-89.538-89.538c-24.696-24.696-24.696-64.842 0-89.538s64.842-24.696 89.538 0l89.538 89.538c24.696 24.696 24.696 64.842 0 89.538-24.822 24.696-64.842 24.696-89.538 0v0zM258.707 512c0 34.955-28.37 63.322-63.322 63.322h-126.643c-34.955 0-63.322-28.37-63.322-63.322s28.37-63.322 63.322-63.322h126.643c34.955 0 63.322 28.37 63.322 63.322v0zM780.616 691.075l89.538 89.538c24.696 24.696 24.696 64.842 0 89.538s-64.842 24.696-89.538 0l-89.538-89.538c-24.696-24.696-24.696-64.842 0-89.538 24.822-24.696 64.842-24.696 89.538 0v0zM780.616 691.075z" fill="#555555"></path>
                                </svg>
                                <span>正在加载...</span> 
                            </div>}
                        </div>
                    </div>
                </div>
                {/* 回到顶部 */}
                <div className='returnTop' onClick={this.handleGoBack.bind(this)} style={{opacity:`${this.state.opa? 0 : 1}`}}>
                    <svg className="icon" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"><defs></defs><path d="M32 0h960v156.8H32V0z m960 710.4h-240V1024h-480v-313.6H32L512 236.8l480 473.6z"  fill="#999999"></path></svg>
                </div>
            </div>
         );
    }
}
 
export default TakeOutMain;
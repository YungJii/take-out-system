import React, { Component } from 'react';
import { Icon } from 'antd';
import { Toast } from 'antd-mobile';
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
            opa: true,
            message: {}
        }
    }
    componentWillMount() {
        if (localStorage.getItem('user') === null) {
            window.location.href=`/login`;
        }
        if (localStorage.getItem('user_info') === null) {
            this.handleGetInfo()
        } else {
            this.setState({
                message: JSON.parse(localStorage.getItem('user_info'))
            })
        }
        this.getBusinessList()
    }

    // 获取个人信息
    handleGetInfo() {
        axios.get('/api/user/getUserInfo', {})
        .then((res) => {
            console.log(res.data.message)
            if (res.data.status === 200) {
                this.setState({
                    message: res.data.message
                })
                localStorage.setItem('user_info', JSON.stringify(res.data.message))
            } else {
                window.location.href=`/login`;
            }
        })
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

    handleActive() {
        console.log('handleActive')
        Toast.success('敬请期待', 1);
    }
    
    render() { 
        return ( 
            <div>
                <div className="headerMain">
                    <div className="headerMain-content">
                    {/* <div className="title"><Icon type="environment"/><span className="headerMain-address">{''}</span></div> */}
                    <div className="title"><Icon type="environment"/><span className="headerMain-address">{this.state.message.address || ''}</span></div>
                        {/* 搜索、滚动 */}
                        <div><Search /></div>
                        <div><Slick /></div>
                    </div>
                </div>
                {/* 商家活动 */}
                <div className="bcw100">
                    <div className="activityMain">
                        <p className="activityMain_title">商家活动</p>
                        <img src={require("../../../assets/images/Advertisement/business_activity.jpg")} alt="" onClick={this.handleActive.bind(this)}></img>
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
                                <Icon type="loading" size={`xs`} />
                                <span style={{marginLeft: '.3rem'}}>正在加载...</span> 
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
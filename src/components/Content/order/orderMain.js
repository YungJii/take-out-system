import React, { Component } from 'react';
import { Button, Icon } from 'antd-mobile';
import Evaluate from '../../common/evaluate.js'
import '../../../scss/orderMain.scss';

const axios = require('axios');

class Order extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            store_data: [],
            noMore: false,
            page: 1,
            num: ''
         }
    }

    componentWillMount() {
        // console.log(React.$utils.monitor)
		this.isUnmount = false;
		document.addEventListener('scroll',this._more.bind(this))
        this.handleGetOrder()
        this.handleGetInfo()
    }

    componentDidMount() {
    }

    componentWillUnmount(){
		this.isUnmount = true;
		document.removeEventListener('scroll',this._more.bind(this))
    }

    handleGetOrder(page) {
        // console.log(page)
        if (page === undefined) {
            axios.get(`/api/order/myOrder?page=${this.state.page}`, {})
            .then((res) => {
                if (res.data.message.data.length !== 10) {
                    this.setState({
                        noMore: true
                    })
                }
                this.setState({
                    store_data: this.state.store_data.concat(res.data.message.data)
                }, () => {
                    console.log(res.data.message.data)
                })
            })
        } else {
            axios.get(`/api/order/myOrder?page=${page}`, {})
            .then((res) => {
                if (res.data.message.data.length !== 10) {
                    this.setState({
                        noMore: true
                    })
                }
                this.setState({
                    store_data: res.data.message.data
                }, () => {
                    console.log(res.data.message.data)
                })
            })
        }
    }
    
    _more() {
        this._throttle(this.resizeTop, this);
    }

    resizeTop() {
        // if (this.flag) {return;}
        if (this.state.noMore) {return;}
        console.log((document.documentElement.scrollTop) - window.document.body.offsetHeight)
        if (document.documentElement.scrollTop > window.document.body.offsetHeight && (document.documentElement.scrollTop) - window.document.body.offsetHeight > ((450 * this.state.page))) {
            // this.flag = true
            if(this.isUnmount) {return}
            this.setState({
                page: this.state.page + 1
            })
            this.handleGetOrder()
        }
    }

    // 函数节流
    _throttle(method,context){
		clearTimeout(method.tId);
		method.tId=setTimeout(function(){
			method.call(context)
		},500)
    }

    // 个人信息
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

    // 再来一单
    handleAgain(id) {
        console.log('handleAgain')
        window.location.href = `/shop/${id}`
    }

    // 评价订单
    handleEvaluate(num) {
        // console.log(num)
        this.setState({
            num: num
        })
    }


    render() { 
        let orderMain_Content = this.state.store_data.map((value, index) => {
            // console.log(value)
            let data = JSON.parse(value.detail).food
            let food = ''
            let food_storage = ''
            for (let i = 0; i < data.length; i++) {
                if (i === data.length - 1) {
                    food += data[i].foodName
                    food_storage = food
                    food = ''
                } else {
                    food += data[i].foodName + ' + '
                }
            }
            return (
                <div className="orderMain-content" key={index}>
                    <div className="orderMain-content-card">
                        <div className="avatar">
                            <img src={`${window.config_url}${value.store_info.img}`} alt="" width="50px" height="50px"></img>
                        </div>
                        <div className="details">
                            <div className="state-name">
                                <div style={{padding: '1rem 0'}}>
                                    <span className="name">
                                        {value.store_info.name}
                                    </span>
                                    <span className="state">
                                        {value.status === 0 ? '等待接受' : value.status === 1 ? '已接受 ' : value.status === 2 ? '已拒绝' : value.status === 3 ? '已送达' : '订单超时'}
                                    </span>
                                    <div style={{clear: "both"}}></div>
                                    <div className="time">{value.time}</div>
                                </div>
                            </div>
                            <div className="name-price">
                                <div style={{padding: '1rem 0'}}>
                                    <span className="name">
                                        {food_storage}
                                    </span>
                                    <span className="price">
                                        ￥{value.money}
                                    </span>
                                    <div style={{clear: "both"}}></div>
                                </div>
                                {/* <Button>再来一单</Button> */}
                                <div className="again_button">
                                    {value.status === 3 ? <Button type="ghost" size="small" style={{display : 'inline-block', marginRight: '4px'}} onClick={this.handleEvaluate.bind(this, value.num)}>评价订单</Button> : null}
                                    <Button type="ghost" size="small" inline style={{ marginRight: '4px' }} className="am-button-borderfix" onClick={this.handleAgain.bind(this, value.store_info.id)}>再来一单</Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )
        })
        return ( 
            <div style={{backgroundColor: '#f8f8f8'}}>
                {this.state.num !== '' ? <Evaluate num={this.state.num} handleEvaluate={this.handleEvaluate.bind(this)}/> : null}
                <div className="orderMain-title">
                    <h2>我的订单</h2>
                </div>
                {orderMain_Content}
                {this.state.noMore?<div className='noMore'>没有更多了哦~</div> : 
                    <div className="loadMore" id="loadMore"> 
                        <Icon type="loading" size={`xs`} />
                        <span style={{marginLeft: '.3rem'}}>正在加载...</span> 
                    </div>}
            </div>
         );
    }
}
 
export default Order;
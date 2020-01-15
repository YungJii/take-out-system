import React, { Component } from 'react';
import { InputItem, Toast, Modal } from 'antd-mobile';
import './shopOrder.scss'
const axios = require('axios');
const prompt = Modal.prompt;

class shopOrder extends Component {
    constructor(props) {
        super(props);
        this.state = {
            local_order: {},
            local_perinfo: {},
            query_business: {}
        }
    }

    componentWillMount() {
        console.log('shopOrder')
        this.setState({
            local_order: JSON.parse(localStorage.getItem('order_details')),
            local_perinfo: JSON.parse(localStorage.getItem('user_info'))
        }, () => {
            this.getBusinessData()
        })
    }

    componentDidMount() {
        if (document.getElementById('root').offsetHeight > document.getElementById('bcli').offsetHeight) {
            document.getElementById('bcli').setAttribute('style', 'height: 100vh !important')
        }
    }

    // 获取单个商家
    getBusinessData() {
        axios.get('/api/store/one', {
            params: {
                storeId: this.state.local_order.storeId
            }
        })
        .then( (res) => {
            this.setState({
                query_business: res.data.message
            })
        })
    }

    // 确认支付
    handleSubmit() {
        console.log('handleSubmit')
        axios.post('/api/order/preOrder', {
            detail: JSON.stringify(this.state.local_order.detail),
            storeId: this.state.local_order.storeId,
            remark: this.state.local_order.remark,
            money: this.state.local_order.money
        })
        .then( (res) => {
            if (res.data.status === 200) {
                prompt('输入支付密码', '',
                    [
                        {
                            text: '关闭',
                            onPress: value => new Promise((resolve) => {
                                resolve();
                            }),
                        },
                        {
                            text: '完成',
                            onPress: value => new Promise((resolve, reject) => {
                                console.log(parseInt(value))
                                console.log(this.state.local_perinfo)
                                if (parseInt(value) !== this.state.local_perinfo.payPass) {
                                    Toast.fail('与支付密码不匹配', 1)
                                    reject();
                                } else {
                                    let message = res.data.message
                                    axios.post('/api/order/orderPay', {
                                        num: message
                                    })
                                    .then((res) => {
                                        console.log(res)
                                        if (res.data.status === 200) {
                                            Toast.success(res.data.message, 1, () => {
                                                localStorage.setItem('order_message', message)
                                                window.location.href = '/order'
                                            })
                                            reject();
                                        } else {
                                            Toast.fail(res.data.message, 1, () => {
                                                resolve();
                                            })
                                        }
                                    })
                                }
                            }),
                        },
                    ], 'secure-text', null, ['']
                )
            } else {
                Toast.fail(res.data.message, 1);
            }
        })
    }

    // 修改备注
    handleInputChange(e) {
        this._throttle(this.setState_remarks, this, e)
    }

    setState_remarks(value) {
        this.setState({
            local_order: Object.assign({}, this.state.local_order, {'remark': value})
        }, () => {
            console.log(this.state.local_order)
        })
    }
    _throttle(method,context,value){
		clearTimeout(method.tId);
		method.tId=setTimeout(function(){
			method.call(context, value)
		},1000)
    }

    render() { 
        let content_food = this.state.local_order.detail.food.map((value, index) => {
            return (
                <div className="content_food" key={index}>
                    <span>{value.foodName}</span>
                    <span>*{value.foodNum}</span>
                    <span>￥{value.allMoney}</span>
                </div>
            )
        })
        let content_money = () => {
            var totoal_money = parseFloat(this.state.query_business.fee) + parseFloat(this.state.local_order.money)
            return (
                <span>￥{totoal_money}</span>
            )
        }
        return ( 
            <div className="bcli" id="bcli">
                <div className="order_box">
                    {/* 个人信息 */}
                    <div className="box_perinfo">
                        <div className="perinfo_address">
                            {this.state.local_perinfo.address}
                        </div>
                        <p className="perinfo_name_phone">
                            <span>{this.state.local_perinfo.name}</span>
                            <span>{this.state.local_perinfo.phone}</span>
                        </p>
                        <div className="perinfo_balance">
                            <span>所剩余额</span>
                            <span>￥{this.state.local_perinfo.money}</span>
                        </div>
                        <div className="card_sign">
                            <span>个人信息</span>
                        </div>
                    </div>
                    {/* 订单详情 */}
                    <div className="box_orderinfo">
                        <div className="orderinfo_name">
                            {this.state.query_business.name}
                        </div>
                        <div className="orderinfo_content">
                            {content_food}
                            <div className="content_fee">
                                <span>配送费</span>
                                <span>￥{this.state.query_business.fee}</span>
                            </div>
                            <div className="content_money">
                                <span>合计</span>
                                {content_money()}
                            </div>
                        </div>
                        <div className="card_sign">
                            <span>订单信息</span>
                        </div>
                    </div>
                    {/* 备注 */}
                    <div className="box_remark">
                        <div className="remark_input">
                            <InputItem onChange={this.handleInputChange.bind(this)} placeholder="叮嘱店家..."></InputItem>
                        </div>
                        <div className="card_sign">
                            <span>订单备注</span>
                        </div>
                    </div>
                    {/* 底部 */}
                    <div className='box_footer'>
                        {content_money()}
                        <span className='submit_button' onClick={this.handleSubmit.bind(this)}>
                            确认支付
                        </span>
                    </div>
                </div>
            </div>
         );
    }
}
 
export default shopOrder;
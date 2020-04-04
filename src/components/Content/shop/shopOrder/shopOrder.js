import React, { Component } from 'react';
import { InputItem, Toast, Modal } from 'antd-mobile';
import { CSSTransition } from 'react-transition-group'

import { Radio } from 'antd'; 
import './shopOrder.scss'
const axios = require('axios');
const prompt = Modal.prompt;

class shopOrder extends Component {
    constructor(props) {
        super(props);
        this.state = {
            local_order: {},
            local_perinfo: {},
            query_business: {},
            coupon_message: [],
            isShow: false,
            // 优惠券的钱
            Discount: 0,
            // 折扣码的内容 .discount 是折扣码的折扣量
            discount_message: {},
            // 预约时间
            preOrderValue: 0,
            // 折扣id
            couponId: null,
        }

        this.handleCoupon = this.handleCoupon.bind(this)
    }

    componentWillMount() {
        console.log('shopOrder')
        this.setState({
            local_order: JSON.parse(localStorage.getItem('order_details')),
            local_perinfo: JSON.parse(localStorage.getItem('user_info'))
        }, () => {
            this.getBusinessData()
            this.getHandleDiscountCode()
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
        var discount = 1
        if (this.state.discount_message.exist === 1 && this.state.discount_message.canUse === 1 && this.state.discount_message.used === 1) {
            discount = (this.state.discount_message.discount) / 100
        }
        var totoal_money = ((parseFloat(this.state.query_business.fee) + parseFloat(this.state.local_order.money)) * discount - this.state.Discount).toFixed(2)
        if (totoal_money < 0) {
            totoal_money = 0
        }
        if (this.state.query_business.isOpen !== 2) {
            this.setState({
                preOrderValue: 0
            })
        }
        let reqObj = {
            detail: JSON.stringify(this.state.local_order.detail),
            storeId: this.state.local_order.storeId,
            remark: this.state.local_order.remark,
            money: totoal_money,
            preOrder: this.state.preOrderValue
        }
        if (this.state.couponId !== null) {
            reqObj = Object.assign(reqObj, {couponId: this.state.couponId});
        }
        if (this.state.discount_message.exist === 1 && this.state.discount_message.canUse === 1 && this.state.discount_message.used === 1) {
            reqObj = Object.assign(reqObj, {discount: (this.state.discount_message.discount + '%')});
        }
        // couponId: this.state.couponId,
        // discount: 
        console.log(reqObj)
        axios.post('/api/order/preOrder', reqObj)
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
            } else if (res.data.status === 200) {

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

    handleBack() {
        window.history.back();
    }

    // 优惠券界面切换
    handleCoupon() {
        this.setState({
            isShow: !this.state.isShow
        })
    }
    // 获取优惠券
    getCanCoupon() {
        console.log(parseFloat(this.state.local_order.money))
        axios.post('/api/coupon/canCoupon', {
            money:parseFloat(this.state.local_order.money),
            storeId:this.state.local_order.storeId
        })
        .then((res) => {
            console.log(res.data.message)
            this.setState({
                coupon_message: res.data.message
            })
        })
    }

    // 使用折扣码
    getHandleDiscountCode() {
        // console.log('getHandleDiscountCode')
        axios.get(`/api/discount/getDiscount?userId=${this.state.local_perinfo.id}`,{})
        .then((res) => {
            // console.log(res.data.message)
            this.setState({
                discount_message: res.data.message
            })
        })
    }

    // 使用优惠券
    handleUseCoupon(value) {
        console.log(value)
        if (!value.canUse) {
            Toast.fail('不满足使用条件', 2)
            return
        }
        this.setState({
            Discount: value.amount,
            couponId: value.id
        })
        this.handleCoupon()
    }

    // 不使用优惠券
    handleDontUse() {
        this.setState({
            Discount: 0,
            couponId: null
        })
        this.handleCoupon()
    }

    // 选择预约时间
    handleChangeSelect(e) {
        // console.log(v)
        this.setState({
            preOrderValue: e.target.value,
        });
    }

    render() { 
        let content_food = this.state.local_order.detail.food.map((value, index) => {
            return (
                <div className="content_food" key={index}>
                    <span>{value.foodName}</span>
                    <span>*{value.foodNum}</span>
                    <span>￥{Number(value.allMoney).toFixed(2)}</span>
                </div>
            )
        })
        let content_money = () => {
            var discount = 1
            if (this.state.discount_message.exist === 1 && this.state.discount_message.canUse === 1 && this.state.discount_message.used === 1) {
                discount = (this.state.discount_message.discount) / 100
            }
            var totoal_money = ((parseFloat(this.state.query_business.fee) + parseFloat(this.state.local_order.money)) * discount - this.state.Discount).toFixed(2)
            if (totoal_money < 0) {
                totoal_money = 0
            }
            return (
                <span>￥{totoal_money}</span>
            )
        }
        
        
        let luckDraw_Content = this.state.coupon_message.length === 0 ? null : this.state.coupon_message.map((value, index) => {
            return (
                // onClick={this.handleUseCoupon.bind(this, value.)}
                <div key={index} className="luckDraw-item" onClick={this.handleUseCoupon.bind(this, value)}>
                    <div className="luckDraw-img">
                        <img src={`${window.config_url}${value.img}`} alt="" />
                    </div>
                    <div className="luckDraw-details">
                        <p className='coupon_p'>
                            <span className="details-title">金额：</span>
                            <span>{value.amount}元</span>
                        </p>
                        <p className='coupon_p'>
                            <span className="details-title">使用限制：</span>
                            <span>{value.arriveMoneyShow}</span>
                        </p>
                    </div>
                </div>
            )
        })


        return ( 
            <div className="bcli" id="bcli">
                <div className="order-title">
                    <h2>订单详情</h2>
                    <nav onClick={this.handleBack.bind(this)} className="back">
                        <svg t="1578651010018" className="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2250" width="200" height="200"><path d="M366.32213 511.145539l377.388162-377.387139c15.865339-15.852036 15.865339-41.571814 0-57.422828-15.864316-15.864316-41.557488-15.864316-57.421804 0l-406.100088 406.099065c-15.864316 15.852036-15.864316 41.570791 0 57.421804l406.100088 406.100088c7.93267 7.93267 18.315134 11.899004 28.711926 11.899005 10.381441 0 20.778232-3.966335 28.710902-11.899005 15.865339-15.851013 15.865339-41.571814 0-57.422827L366.32213 511.145539z" p-id="2251" fill="#2c2c2c"></path></svg>
                    </nav>
                </div>
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
                            {this.state.Discount !== 0 ? <div className="content_fee">
                                <span>优惠券</span>
                                <span style={{color: 'red'}}>-￥{this.state.Discount.toFixed(2)}</span>
                            </div> : null}
                            {/* && this.state.discount_message.used === 1 && this.state.discount_message.used === 1  */}
                            {this.state.discount_message.exist === 0 ? null : this.state.discount_message.canUse === 0 ? null : this.state.discount_message.used === 1 ? <div className="content_fee">
                                <span>折扣</span>
                                <span style={{color: 'red'}}>{this.state.discount_message.discount}%</span>
                            </div> : null}
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
                    {/* 优惠券 */}
                    <div className="box_coupon">
                        <p className="change_coupon" onClick={this.handleCoupon}>
                            <span className="title">优惠券</span>
                        </p>
                    </div>
                    {this.state.query_business.isOpen === 2 ? <div className="box_preOrder">
                        <div className='preOrder_title'>
                            预约时间
                        </div>
                        <div className="preOrder">
                            {/* <span className="title">优惠券</span> */}
                            <Radio.Group onChange={this.handleChangeSelect.bind(this)} value={this.state.preOrderValue}>
                                <Radio value={1}>早上</Radio>
                                <Radio value={2}>中午</Radio>
                                <Radio value={3}>晚上</Radio>
                            </Radio.Group>
                        </div>
                    </div> : null}
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
                <CSSTransition
                    in={this.state.isShow}
                    timeout={2000}
                    classNames="coupon_box"
                    unmountOnExit
                    appear={true}
                    onEnter={this.getCanCoupon.bind(this)}
                    onEntering={(el) => {}}
                    onEntered={(el) => {}}
                    onExit={(el) => {}}
                    onExiting={(el) => {}}
                    onExited={(el) => {}}
                >
                    <div className="box_dialog">
                        <div className="luckDraw">
                            <div className="luckDraw-title">
                                <h2>我的优惠券</h2>
                                <nav onClick={this.handleCoupon}>
                                    <div className="back">
                                        <svg t="1578651010018" className="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2250" width="200" height="200"><path d="M366.32213 511.145539l377.388162-377.387139c15.865339-15.852036 15.865339-41.571814 0-57.422828-15.864316-15.864316-41.557488-15.864316-57.421804 0l-406.100088 406.099065c-15.864316 15.852036-15.864316 41.570791 0 57.421804l406.100088 406.100088c7.93267 7.93267 18.315134 11.899004 28.711926 11.899005 10.381441 0 20.778232-3.966335 28.710902-11.899005 15.865339-15.851013 15.865339-41.571814 0-57.422827L366.32213 511.145539z" p-id="2251" fill="#2c2c2c"></path></svg>
                                    </div>
                                </nav>
                                <div className="dont_use" onClick={this.handleDontUse.bind(this)}>
                                    <img src={require("../../../../assets/images/dontUse.png")} alt=""></img>
                                </div>
                            </div>
                            {luckDraw_Content}
                            {/* {this.state.noMore? luckDraw_Content : null} */}
                            {/* {this.state.noMore?<div className='noMore'>没有更多了哦~</div> : 
                                <div className="loadMore" id="loadMore"> 
                                    <Icon type="loading" size={`xs`} />
                                    <span style={{marginLeft: '.3rem'}}>正在加载...</span> 
                                </div>} */}
                        </div>
                    </div>
                </CSSTransition>
            </div>
         );
    }
}
 
export default shopOrder;
// import { Icon } from 'antd-mobile';
import React,{Component} from 'react'
import { Toast } from 'antd-mobile';
import { InputNumber } from 'antd';
import './activityDetails.scss';
const axios = require('axios');

class activityDetails extends Component{
    constructor(props) {
        super(props);
        this.state = {
            data: {},
            store_info: {},
            max: 0,
            needPoint: 0
        };
    }
  
    componentWillMount() {
        // console.log()
        this.getActivityDetails()
    }

    getActivityDetails() {
        axios.get(`/api/coupon/couponDetails?couponId=${window.location.pathname.split('/')[2]}`, {})
        .then((res) => {
            if (res.data.status === 200) {
                this.setState({
                    data: res.data.message,
                    store_info: res.data.message.store_info
                }, () => {
                    console.log(this.state.data.fullNum - this.state.data.num)
                    console.log(Math.floor(JSON.parse(window.localStorage.getItem('user_info')).point / this.state.data.point))
                    if ((this.state.data.maxPoint - this.state.data.num) > Math.floor(JSON.parse(window.localStorage.getItem('user_info')).point / this.state.data.point)) {
                        this.setState({
                            max: Math.floor(JSON.parse(window.localStorage.getItem('user_info')).point / this.state.data.point)
                        })
                    } else {
                        this.setState({
                            max: this.state.data.maxPoint - this.state.data.num
                        })
                    }
                })
            } else if (res.data.status === -1) {
                Toast.fail(res.data.message, 2, () => {
                    window.location.href=`/showing_luckDraw`;
                });
            } else {
                Toast.fail(res.data.message, 2, () => {
                    window.location.href=`/login`;
                });
            }
        })
    }

    onChange(value) {
        this.setState({
            needPoint: value*this.state.data.point
        })
    }

    // 确认抽奖
    handleLuckDraw() {
        console.log('handleLuckDraw')
        if (this.state.needPoint === 0) {
            Toast.fail('投注数量不能小于1', 2);
            return;
        }
        axios.post('/api/coupon/raffle',{
            size: this.state.needPoint / this.state.data.point,
            couponId: this.state.data.id
        })
        .then((res) => {
            console.log(res.data)
            if (res.data.status === 200) {
                Toast.success(res.data.message, 2, () => {
                    axios.get('/api/user/getUserInfo', {})
                    .then((res) => {
                        localStorage.setItem('user_info',JSON.stringify(res.data.message))
                    })
                    .then(() => {
                        window.location.href = `/activity`
                    })
                });
            }
        })
    }

    handleBack() {
        window.history.back();
    }

	render(){
		return(
			<div className="details">
                <div className="details-title">
                    <h2>抽奖详情</h2>
                    <nav onClick={this.handleBack.bind(this)} className="back">
                        <svg t="1578651010018" className="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2250" width="200" height="200"><path d="M366.32213 511.145539l377.388162-377.387139c15.865339-15.852036 15.865339-41.571814 0-57.422828-15.864316-15.864316-41.557488-15.864316-57.421804 0l-406.100088 406.099065c-15.864316 15.852036-15.864316 41.570791 0 57.421804l406.100088 406.100088c7.93267 7.93267 18.315134 11.899004 28.711926 11.899005 10.381441 0 20.778232-3.966335 28.710902-11.899005 15.865339-15.851013 15.865339-41.571814 0-57.422827L366.32213 511.145539z" p-id="2251" fill="#2c2c2c"></path></svg>
                    </nav>
                </div>
                <div className="details-img">
                    <img src={`${window.config_url}${this.state.data.img}`} alt="" />
                </div>
                <div className="details-content">
                    <p className="name">
                        {this.state.data.name}
                    </p>
                    <p className="info-flex">
                        <span>商家</span>
                        <span>{this.state.store_info.name}</span>
                    </p>
                    <p className="info-flex">
                        <span className="fwb">单词投注积分</span>
                        <span>{this.state.data.point}</span>
                    </p>
                    <p className="info-flex">
                        <span className="fwb">个人最多投注</span>
                        <span>{this.state.data.maxPoint}</span>
                    </p>
                    <p className="info-flex">
                        <span>优惠券金额</span>
                        <span>{this.state.data.amount}</span>
                    </p>
                    <p className="info-flex">
                        <span>使用限制</span>
                        <span>{this.state.data.arriveMoneyShow}</span>
                    </p>
                    <p className="info-flex">
                        <span>当前已投</span>
                        <span>{this.state.data.currenBets}</span>
                    </p>
                    <p className="info-flex">
                        <span className="fwb">我的投注</span>
                        <span>{this.state.data.num}</span>
                    </p>
                    <p className="info-flex">
                        <span>满多少注开奖</span>
                        <span>{this.state.data.fullNum}</span>
                    </p>
                    <p className="info-flex">
                        <span className="fwb">剩余可投注</span>
                        <span>{(this.state.data.maxPoint - this.state.data.num).toString()}</span>
                    </p>
                    <p className="info-flex" style={{ marginTop: '1rem'}}>
                        <span>个人积分</span>
                        <span>{JSON.parse(window.localStorage.getItem('user_info')).point}</span>
                    </p>
                    <div className="info-flex">
                        <span>投注</span>
                        <InputNumber
                            defaultValue={1}
                            formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            parser={value => value.replace(/\$\s?|(,*)/g, '')}
                            min={0}
                            max={this.state.max}
                            onChange={this.onChange.bind(this)}/>
                    </div>
                    <p className="info-flex">
                        <span>投注积分</span>
                        <span>{this.state.needPoint}</span>
                    </p>
                </div>
                <div className="details-svg">
                    <svg onClick={this.handleLuckDraw.bind(this)} t="1585297560547" className="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3891" width="100" height="100"><path d="M535.845 390.344L512 274.266l-22.045 115.807c-24.025 4.319-47.06 15.746-65.687 34.283-48.41 48.501-48.41 126.965 0 175.375 48.411 48.41 126.965 48.41 175.375 0 48.501-48.501 48.501-126.965 0-175.375-18.086-18.086-40.402-29.513-63.797-34.013m256.178 401.681L615.659 615.659c-18.896 18.896-41.662 31.493-65.687 37.972l64.607 241.062C581.556 903.511 547.092 908.01 512 908.01s-69.466-4.589-102.489-13.317l64.607-241.062c-24.115-6.389-46.791-19.075-65.687-37.972L232.066 792.024c-50.93-50.93-85.123-112.477-102.399-177.534l240.882-64.517a146.534 146.534 0 0 1 0-75.855l-240.882-64.517c17.276-65.057 51.38-126.605 102.31-177.534l176.365 176.365c18.896-18.896 41.572-31.493 65.687-37.972l-64.517-241.062c33.023-8.728 67.396-13.317 102.489-13.317s69.466 4.589 102.579 13.317L549.973 370.46c24.025 6.389 46.791 19.075 65.687 37.972l176.365-176.365c49.941 49.941 84.943 110.948 102.669 177.444l-241.151 64.607a146.534 146.534 0 0 1 0 75.855l241.062 64.607c-17.726 66.496-52.64 127.505-102.579 177.444m38.15-598.11C745.143 108.971 632.215 62.18 512 62.18c-120.127 0-233.143 46.791-318.086 131.734C108.881 278.857 62.09 391.875 62.09 512c0 120.216 46.791 233.143 131.824 318.176C278.857 915.209 391.875 961.91 512 961.91c120.216 0 233.143-46.791 318.176-131.734C915.209 745.233 961.91 632.215 961.91 512c0-120.127-46.791-233.143-131.734-318.086z" fill="#d81e06" p-id="3892"></path></svg>
                </div>
                <p className="details-tro">点击抽奖</p>
            </div>
		)
	}
}

export default activityDetails;
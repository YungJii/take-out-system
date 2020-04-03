import { Icon } from 'antd-mobile';
import React,{Component} from 'react'
import { Toast } from 'antd-mobile';
import './activity.scss';
const axios = require('axios');

class Activity extends Component{
    constructor(props) {
        super(props);
        this.state = {
            page: 1,
            data: [],
            noMore: false
        };
    }

    componentWillMount() {
        // console.log(React.$utils.monitor)
		document.addEventListener('scroll',this._more.bind(this))
    }

    _more() {
        this._throttle(this.resizeTop, this);
    }

    // 函数节流
    _throttle(method,context){
		clearTimeout(method.tId);
		method.tId=setTimeout(function(){
			method.call(context)
		},500)
    }

    resizeTop() {
        if (this.state.noMore) {return;}
        if (document.documentElement.scrollTop > window.document.body.offsetHeight && document.documentElement.scrollTop - window.document.body.offsetHeight > 240) {
            this.setState({
                page: this.state.page + 1
            })
            this.getActivityList()
        }
    }

    componentDidMount() {
        this.getActivityList()
    }
    
    getActivityList() {
        axios.get(`/api/coupon/index?page=${this.state.page}`, {})
        .then((res) => {
            // console.log()
            if (res.data.status === 200) {
                if (res.data.message.data.length !== 10) {
                    this.setState({
                        noMore: true
                    })
                }
                this.setState({
                    data: this.state.data.concat(res.data.message.data)
                })
            } else if (res.data.status === -1) {
                window.location.href=`/activity`;
            } else {
                Toast.fail(res.data.message, 2, () => {
                    window.location.href=`/login`;
                });
            }
                    
            // console.log(res.data.message.data)
        })
    }

    handleShowActivityDetails(id) {
        // console.log(id)
        window.location.href = `/activities/${id}`
    }

    handleBack() {
        window.location.href = '/';
    }

	render(){
        let activity_Content = this.state.data.map((value, index) => {
            return (
                <div key={index} className="activity-item" onClick={this.handleShowActivityDetails.bind(this, value.id)}>
                    <div className="activity-img">
                        <img src={`${window.config_url}${value.img}`} alt="" />
                    </div>
                    <div className="activity-details">
                        <p>
                            <span className="details-title">奖品：</span>
                            <span>{value.name}</span>
                        </p>
                        <p>
                            <span className="details-title">金额：</span>
                            <span>{value.amount}元</span>
                        </p>
                        <p>
                            <span className="details-title">投注：</span>
                            <span>{value.currenBets}/{value.fullNum}</span>
                        </p>
                        <p className="details-shop">
                            {/* <span className="details-title">所属商家：</span> */}
                            <span>{value.store_info.name}</span>
                        </p>
                    </div>
                </div>
            )
        })
		return(
			<div className="activity">
                <div className="activity-title">
                    <h2>抽奖大厅</h2>
                    <nav onClick={this.handleBack.bind(this)} className="back">
                        <svg t="1578651010018" className="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2250" width="200" height="200"><path d="M366.32213 511.145539l377.388162-377.387139c15.865339-15.852036 15.865339-41.571814 0-57.422828-15.864316-15.864316-41.557488-15.864316-57.421804 0l-406.100088 406.099065c-15.864316 15.852036-15.864316 41.570791 0 57.421804l406.100088 406.100088c7.93267 7.93267 18.315134 11.899004 28.711926 11.899005 10.381441 0 20.778232-3.966335 28.710902-11.899005 15.865339-15.851013 15.865339-41.571814 0-57.422827L366.32213 511.145539z" p-id="2251" fill="#2c2c2c"></path></svg>
                    </nav>
                </div>
                {activity_Content}
                {this.state.noMore?<div className='noMore'>没有更多了哦~</div> : 
                    <div className="loadMore" id="loadMore"> 
                        <Icon type="loading" size={`xs`} />
                        <span style={{marginLeft: '.3rem'}}>正在加载...</span> 
                    </div>}
            </div>
		)
	}
}

export default Activity;
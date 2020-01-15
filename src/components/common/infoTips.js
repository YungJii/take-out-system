import React,{Component} from 'react';
import '../../scss/infoTips.scss';
const axios = require('axios');

class InfoTips extends Component{
	constructor(){
		super();
		this.state={
			clear_status: false,
			status: 0,
			active: false
		}
    }
	
	componentWillMount() {
		console.log(localStorage.getItem('order_message'))
		if (localStorage.getItem('order_message') !== null) {
			var status
			var tid = setInterval(() => {
				axios.post('/api/order/getOrderInfoByNum', {
					num: localStorage.getItem('order_message')
				})
				.then((res) => {
					status = res.data.message.status
					// console.log(res)
					console.log(status)
					if (status !== 0) {
						clearInterval(tid)
						this.setState({
							clear_status: true,
							status: status,
							active: true
						}, () => {
							setTimeout(() => {
								this.setState({
									active: false
								})
								localStorage.removeItem('order_message')
							}, 5000)
						})
					}
				})
			}, 1000)
			setTimeout(() => {
				if (this.state.clear_status === false) {
					console.log(tid)
					if (status === 0) {
						axios.post('/api/order/setOrderStatus', {
							num: localStorage.getItem('order_message')
						})
						.then((res) => {
							if (res.data.status === 200) {
								console.log('订单超时')
								this.setState({
									clear_status: true,
									status: 4,
									active: true
								}, () => {
									setTimeout(() => {
										this.setState({
											active: false
										})
									}, 5000)
								})
							}
						})
					}
					localStorage.removeItem('order_message')
					clearInterval(tid)
				}
			}, 5000)
		}
	}


	render(){
		console.log(this.state.clear_status)
		console.log(this.state.status)
		return(
			<div className="tips_box">
				<div className={`${this.state.active ? 'active' : 'hidden'} ${this.state.status === 1 ? 'success' : 'fail'}`}>
					<span>
						{this.state.status === 1 ? '订单被接受' : this.state.status === 2 ? '订单被拒绝' : this.state.status === 4 ? '订单超时' : ''}
					</span>
				</div>
			</div>
		)
	}
}



export default InfoTips;
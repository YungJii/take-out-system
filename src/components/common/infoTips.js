import React,{Component} from 'react';
import '../../scss/infoTips.scss';
// const $ = require('jquery');
import $ from 'jquery';

class InfoTips extends Component{
	constructor(){
		super();
		this.state={
			clear_status: false,
			status: 0,
			active: false,
			message: ''
		}
    }
	
	componentWillMount() {
		if (window.localStorage.getItem('user_info') !== null) {
			this.setWebSocket()
		}
		// console.log(localStorage.getItem('order_message'))
		// console.log($)
		// if (localStorage.getItem('order_message') !== null) {
		// 	var status
		// 	var tid = setInterval(() => {
		// 		axios.post('/api/order/getOrderInfoByNum', {
		// 			num: localStorage.getItem('order_message')
		// 		})
		// 		.then((res) => {
		// 			status = res.data.message.status
		// 			// console.log(res)
		// 			console.log(status)
		// 			if (status !== 0) {
		// 				clearInterval(tid)
		// 				this.setState({
		// 					clear_status: true,
		// 					status: status,
		// 					active: true
		// 				}, () => {
		// 					setTimeout(() => {
		// 						this.setState({
		// 							active: false
		// 						})
		// 						localStorage.removeItem('order_message')
		// 					}, 5000)
		// 				})
		// 			}
		// 		})
		// 	}, 1000)
		// 	setTimeout(() => {
		// 		if (this.state.clear_status === false) {
		// 			console.log(tid)
		// 			if (status === 0) {
		// 				axios.post('/api/order/setOrderStatus', {
		// 					num: localStorage.getItem('order_message')
		// 				})
		// 				.then((res) => {
		// 					if (res.data.status === 200) {
		// 						console.log('订单超时')
		// 						this.setState({
		// 							clear_status: true,
		// 							status: 4,
		// 							active: true
		// 						}, () => {
		// 							setTimeout(() => {
		// 								this.setState({
		// 									active: false
		// 								})
		// 							}, 5000)
		// 						})
		// 					}
		// 				})
		// 			}
		// 			localStorage.removeItem('order_message')
		// 			clearInterval(tid)
		// 		}
		// 	}, 30000)
		// }
	}

	setWebSocket() {
		var ws = new WebSocket("ws://47.106.164.93:8282");
            // 服务端主动推送消息时会触发这里的onmessage
            ws.onmessage = (e) => {
				var data = JSON.parse(e.data)
                var type = data.type || '';
                switch(type){
                    case 'init':
						$.post('http://47.106.164.93/systemPush/bind.php', {client_id: data.client_id,prefix: 'user',uid: JSON.parse(window.localStorage.getItem('user_info')).id}, function(data){
                            console.log(data)
                        }, 'json');
                        break;
                    default :
						this.setState({
							message: data.message,
							active: true
						},() => {
							setTimeout(() => {
								this.setState({
									active: false
								})
							}, 5000)
						})

                }
            };
            ws.onclose = () => {
                console.log("连接关闭，定时重连");
					this.setWebSocket() //手动关的不重连
            };
            ws.onerror = () => {
                console.log("出现错误");
            };
	}


	render(){
		console.log(this.state.clear_status)
		console.log(this.state.status)
		return(
			<div className="tips_box">
				<div className={`${this.state.message && this.state.active ? 'active' : 'hidden'} ${'success'}`}>
					<span>
						{/* {this.state.status === 1 ? '订单被接受' : this.state.status === 2 ? '订单被拒绝' : this.state.status === 4 ? '订单超时' : ''} */}
						{this.state.message}
					</span>
				</div>
			</div>
		)
	}
}



export default InfoTips;
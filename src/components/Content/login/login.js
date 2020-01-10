import React,{Component} from 'react';
import { Toast } from 'antd-mobile';
import './login.scss';
const axios = require('axios');

class Login extends Component{
	constructor(){
		super();
		this.state={
			sno:'',
			password:''
		}
	}
	/*本地存储*/
	_saveLocal(obj){
		try {
			localStorage.setItem('islogin',JSON.stringify(obj))
		} catch (e){
			console.log(e)
		}
	}

	handleLogin() {
		console.log('没有该学生账号信息')
		axios.post('/api/user/login', {
            sno: this.state.sno,
            password: this.state.password 
        })
        .then((res) => {
			let status = res.data.status
			if (status === 200) {
				Toast.success(res.data.message, 2, () => {
					localStorage.setItem('user', this.state.sno);
					window.location.href=`/`;
				});
			} else {
				Toast.fail(res.data.message, 2);
			}
			// console.log()
        })
	}
	
	handleChangeSno(event) {
		console.log(event.target.value)
		this.setState({
			sno:event.target.value
		})
	}
	handleChangePsw(event) {
		console.log(event.target.value)
		this.setState({
			password:event.target.value
		})
	}

	render(){
		return(
			<div className="login">
				<div className='login_box'>
					<div className="vapor">
						<span></span>
						<span></span>
						<span></span>
						<span></span>
						<span></span>
					</div>
					<div className="logo_box">
						<embed src={require("../../../assets/images/logo.svg")} type="image/svg+xml"/>
					</div>
					<input type="text" maxLength='13' placeholder='请输入学号' onChange={this.handleChangeSno.bind(this)}/>
					<div className="underline"></div>
					<input type="password" maxLength='13' placeholder='请输入密码' onChange={this.handleChangePsw.bind(this)}/>
					<div className="underline"></div>
					<button className='login_now' onClick={this.handleLogin.bind(this)}>
						登录
					</button>
				</div>
			</div>
		)
	}
}



export default Login;
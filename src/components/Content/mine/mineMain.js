import React, { Component } from 'react';
import '../../../scss/mineMain.scss';
import { Modal, Toast } from 'antd-mobile';
const axios = require('axios');
const md5 = require('md5');
const prompt = Modal.prompt;

class mineMain extends Component {
    constructor(props) {
        super(props);
        this.state = {
            message: {}
        }
    }
    
    componentWillMount() {
        if (localStorage.getItem('user_info') === null) {
            this.handleGetInfo()
        } else {
            // localStorage.setItem('user_info', {'payPass': 666666})
            this.setState({
                message: JSON.parse(localStorage.getItem('user_info'))
            })
        }
    }

    // 拿到个人信息
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

    // 登出
    handleSignOut() {
        axios.get('/api/user/logout', {})
        .then((res) => {
            console.log(res.data.message)
            if (res.data.status === 200) {
                Toast.success(res.data.message, 2, () => {
					localStorage.removeItem('user');
					localStorage.removeItem('user_info');
                    window.location.href=`/login`;
				});
            } else {
				Toast.fail(res.data.message, 2);
			}
        })
    }

    // 修改支付密码
    handleSettingPayPsw() {
        console.log(this.state.message)
        // 重新输入新密码
        let innovate_repeat = (innovate_value) => {
            prompt('修改支付密码', '',
                [
                    {
                        text: '关闭',
                        onPress: value => new Promise((resolve) => {
                            resolve();
                        }),
                    },
                    {
                        text: '确认',
                        onPress: value => new Promise((resolve, reject) => {
                            if (value === '' || value.length !== 6) {
                                Toast.fail('密码规定6位数', 1)
                                reject();
                            }
                            if (innovate_value === parseInt(value)) {
                                // 到这里才成功
                                axios.post('/api/user/setPayPass', {
                                    payPass: parseInt(value)
                                })
                                .then((res) => {
                                    if (res.data.status === 200) {
                                        this.handleGetInfo()
                                    }
                                })
                                Toast.success('修改成功', 1)
                                resolve();
                            } else {
                                Toast.fail('与上次输入密码不一致', 1)
                                reject();
                            }
                        }),
                    },
                ], 'secure-text', null, ['请重新确认新密码']
            )
        }
        // 输入新密码
        let innovate = () => {
            prompt('修改支付密码', '',
                [
                    {
                        text: '关闭',
                        onPress: value => new Promise((resolve) => {
                            resolve();
                        })
                    },
                    {
                        text: '下一步',
                        onPress: value => new Promise((resolve, reject) => {
                            if (parseInt(value) === this.state.message.payPass) {
                                Toast.fail('与原支付密码相同', 1)
                            } else {
                                innovate_repeat(parseInt(value))
                                resolve();
                            }
                        }),
                    },
                ], 'secure-text', null, ['请输入新密码']
            )
        }
        let original = () => {
            prompt('修改支付密码', '',
                [
                    {
                        text: '关闭',
                        onPress: value => new Promise((resolve) => {
                            resolve();
                        }),
                    },
                    {
                        text: '下一步',
                        onPress: value => new Promise((resolve, reject) => {
                            console.log(value)
                            console.log(parseInt(value))
                            if (parseInt(value) !== this.state.message.payPass) {
                                Toast.fail('与原支付密码不匹配', 1)
                                reject();
                            } else {
                                innovate()
                                resolve();
                            }
                        }),
                    },
                ], 'secure-text', null, ['请输入原密码']
            )
        }
        
        if (this.state.message.payPass !== null) {
            original()
        } else {
            innovate()
        }
    }

    // 修改登录密码
    handleSettingPerPsw() {
        console.log(this.state.message)
        // 重新输入新密码
        let innovate_repeat = (original_value, innovate_value) => {
            prompt('修改登录密码', '',
                [
                    {
                        text: '关闭',
                        onPress: value => new Promise((resolve) => {
                            resolve();
                        }),
                    },
                    {
                        text: '确认',
                        onPress: value => new Promise((resolve, reject) => {
                            if (md5(innovate_value) === md5(value)) {
                                // 到这里才成功
                                Toast.success('修改成功', 1)
                                axios.post('/api/user/setPassword', {
                                    oldPass: original_value,
                                    newPass: innovate_value,
                                    repeatPass: value
                                })
                                .then((res) => {
                                    if (res.data.status === 200) {
                                        this.handleGetInfo()
                                    } else {
                                        window.location.href=`/login`;
                                    }
                                })
                                resolve();
                            } else {
                                Toast.fail('与上次输入密码不一致', 1)
                                reject();
                            }
                        }),
                    },
                ], 'secure-text', null, ['请重新确认新密码']
            )
        }
        // 输入新密码
        let innovate = (original_value) => {
            prompt('修改登录密码', '',
                [
                    {
                        text: '关闭',
                        onPress: value => new Promise((resolve) => {
                            resolve();
                        })
                    },
                    {
                        text: '下一步',
                        onPress: value => new Promise((resolve, reject) => {
                            if (md5(value) === this.state.message.password) {
                                Toast.fail('与原登录密码相同', 1)
                            } else {
                                innovate_repeat(original_value, value)
                                resolve();
                            }
                        }),
                    },
                ], 'secure-text', null, ['请输入新密码']
            )
        }
        let original = () => {
            prompt('修改登录密码', '',
                [
                    {
                        text: '关闭',
                        onPress: value => new Promise((resolve) => {
                            resolve();
                        }),
                    },
                    {
                        text: '下一步',
                        onPress: value => new Promise((resolve, reject) => {
                            if (md5(value) !== this.state.message.password) {
                                Toast.fail('与原登录密码不匹配', 1)
                                reject();
                            } else {
                                innovate(value)
                                resolve();
                            }
                        }),
                    },
                ], 'secure-text', null, ['请输入原密码']
            )
        }
        
        original()
    }

    //修改个人资料
    handleSetting() {
        console.log('handleSetting')
        window.location.href=`/setting_info`;
    }
    handleSetSafe() {
        console.log('handleSetSafe')
        window.location.href=`/setting_safe`;
    }

    render() { 
        return ( 
            <div className="mine_box">
                <div className="mineMain_title">
                    <h2>
                        个人信息
                        <span className="content_setting" onClick={this.handleSetting.bind(this)}></span>
                        {/* <span className="content_safe" onClick={this.handleSetSafe.bind(this)}></span> */}
                    </h2>
                </div>
                <div className="personal_information">
                    <div className="content">
                        <div style={{padding: '2rem'}}>
                            <p className="sno_phon">
                                <span className="title">学号</span>
                                <span>{this.state.message.sno}</span>
                            </p>
                            <p className="sno_phon">
                                <span className="title">手机</span>
                                <span>{this.state.message.phone || '--'}</span>
                            </p>
                            <p className="tip">Tip: 再忙，也要记得吃饭哟</p>
                        </div>
                    </div>
                    <div className="avatar">
                        <img src={this.state.message.pic} alt=""></img>
                        <h3>{this.state.message.name}</h3>
                    </div>
                    <div id="map" className="map"></div>
                </div>
                <div className="personal_paynecessity">
                    <p>
                        <span className="title">余额</span>
                        <span className="content">{this.state.message.money}</span>
                    </p>
                    <p>
                        <span className="title">积分</span>
                        <span className="content">{this.state.message.point === null ? '0' : this.state.message.point}</span>
                    </p>
                    <p>
                        <span className="title">收货地址</span>
                        <span className="content">{this.state.message.address || '--'}</span>
                    </p>
                </div>
                <div className="personal_paypsw_perpsw">
                    <p className="change_psw" onClick={this.handleSettingPayPsw.bind(this)}>
                        <span className="title">支付密码</span>
                        <span className="content">{this.state.message.payPass === null ? '--' : '******'}</span>
                    </p>
                </div>
                <div className="personal_paypsw_perpsw">
                    <p className="change_psw" onClick={this.handleSettingPerPsw.bind(this)}>
                        <span className="title">登录密码</span>
                        <span className="content">{'******'}</span>
                    </p>
                </div>
                <div className="login_out">
                    <button className='login_out_button' onClick={this.handleSignOut.bind(this)}>
                        退出当前账号
                    </button>
                </div>
            </div>
        );
    }
}
 
export default mineMain;
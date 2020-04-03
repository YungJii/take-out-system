import React, { Component } from 'react';
import '../../../scss/mineMain.scss';
import { Modal, Toast } from 'antd-mobile';
import { Icon, Button, Input } from 'antd';
import { CSSTransition } from 'react-transition-group';
const axios = require('axios');
const md5 = require('md5');
const { TextArea } = Input;
const prompt = Modal.prompt;

class mineMain extends Component {
    constructor(props) {
        super(props);
        this.state = {
            message: {},
            isShow: false,
            complaint_page: 1,
            // 投诉列表的内容
            list_message:[],
            noMore: false,
            // 弹窗
            publishExist: false,
            // 投诉内容
            id: '',
            contents: ''
        }

        this.handleChangeInput = this.handleChangeInput.bind(this)
    }
    
    componentWillMount() {
        document.addEventListener('scroll',this._more.bind(this))
        if (localStorage.getItem('user_info') === null) {
            this.handleGetInfo()
        } else {
            // localStorage.setItem('user_info', {'payPass': 666666})
            this.setState({
                message: JSON.parse(localStorage.getItem('user_info'))
            })
        }
    }

    loading() {
        if (this.state.noMore) {return;}
        if (document.documentElement.scrollTop > window.document.body.offsetHeight && document.documentElement.scrollTop - window.document.body.offsetHeight > 240) {
            this.setState({
                page: this.state.page + 1
            })
            this.getActivityList()
        }
    }

    _more() {
        this._throttle(this.loading, this);
    }

    // 函数节流
    _throttle(method,context){
		clearTimeout(method.tId);
		method.tId=setTimeout(function(){
			method.call(context)
		},500)
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
				Toast.fail(res.data.message, 2, () => {
                    window.location.href=`/login`;
                });
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
    // 进入抽奖活动界面
    handleLuckDraw() {
        console.log('handleLuckDraw')
        window.location.href=`/showing_luckDraw`;
    }
    // 进入个人抽奖记录
    handleLuckDrawRecord() {
        console.log('handleLuckDrawRecord')
        window.location.href=`/showing_luckDrawRecord`;
    }
    // 进入我的优惠券
    handCoupon() {
        console.log('handCoupon')
        window.location.href=`/showing_coupon`;
    }

    // 进入投诉
    handleComplaint() {
        console.log('handleComplaint')
        this.setState({
            isShow: true
        })
    }
    // 关闭投诉列表
    handleCloseList() {
        this.setState({
            isShow: false
        })
    }
    // 拉取投诉列表内容
    getComplaintList(page) {
        // console.log(this.state.complaint_page)
        // var npage = this.state.complaint_page
        // if (npage !== undefined) {
        //     npage = page
        // }
        axios.get(`/api/complaint/index?page=${page === 1 ? 1 : this.state.complaint_page}`, {})
        .then((res) => {
            console.log()
            if (res.data.status === 200) {
                if (res.data.message.data.length !== 10) {
                    this.setState({
                        noMore: true
                    })
                }
                this.setState({
                    list_message: res.data.message.data
                })
            } else {
                Toast.fail(res.data.message, 2)
            }
        })
    }
    // 发布投诉弹窗
    handlePublishDialog() {
        console.log('handlePublishDialog')
        this.setState({
            publishExist: true
        })
    }
    // 关闭投诉弹窗
    handleClosePublishDialog(index) {
        this.setState({
            publishExist: false,
            contents: ''
        }, () => {
            if(index !== undefined) {
                this.getComplaintList(1)
            }
        })
    }
    // handleChangeInput
    handleChangeInput(v) {
        // console.log(v.target.value)
        this.setState({
            [v.target.id]: v.target.value
        })
    }
    // 提交投诉内容
    handleSubmitComplaint() {
        console.log('handleSubmitComplaint')
        axios.post('api/complaint/publish' , {
            sno: this.state.id,
            contents: this.state.contents
        })
        .then((res) => {
            if (res.data.status === 200) {
                Toast.success(res.data.message, 2, () => {
                    this.handleClosePublishDialog(1)
                })
            } else {
                Toast.fail(res.data.message, 2)
            }
        })
    }

    render() { 
        let list_Content = this.state.list_message.map((value, index) => {
            return (
                <div key={index} className="hall-item">
                    <div className="hall-details" style={{margin: '1rem'}}>
                        <p>
                            <span className="details-title">学号信息：</span>
                            <span>{value.sno}</span>
                        </p>
                        <div style={{marginTop: '2rem'}}>
                            <span className="details-title">投诉内容：</span>
                            <p>{value.contents}</p>
                        </div>
                        <p style={{marginTop: '2rem'}}>
                            <span className="details-title">处理结果：</span>
                            <span>{value.result !== '' ? value.result : '未处理'}</span>
                        </p>
                        <p style={{marginTop: '2rem'}}>
                            <span className="details-title">发布时间：</span>
                            <span>{value.time}</span>
                        </p>
                        <p style={{marginTop: '2rem'}}>
                            <span style={{color: '#999999'}}>{value.statusName}</span>
                        </p>
                    </div>
                </div>
            )
        })
        return ( 
            <div className="mine_box">
                <div className="mineMain_title">
                    <h2>
                        个人信息
                        <span className="content_setting" onClick={this.handleSetting.bind(this)}></span>
                        <span className="content_complaint" onClick={this.handleComplaint.bind(this)}></span>
                        {/* <span className="content_luckDraw" onClick={this.handleLuckDraw.bind(this)}></span> */}
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
                    {/* <div id="map" className="map"></div> */}
                </div>
                <div className="personal_luckDraw">
                    <p className="p1">
                        <span onClick={this.handleLuckDraw.bind(this)}><img src={require("../../../assets/images/luckDraw.png")} alt=""></img></span>
                        <span onClick={this.handCoupon.bind(this)}><img src={require("../../../assets/images/Coupon.png")} alt=""></img></span>
                        <span onClick={this.handleLuckDrawRecord.bind(this)}><img src={require("../../../assets/images/luckDraw_record.png")} alt=""></img></span>
                    </p>
                    <p className="luckDraw_font p2">
                        <span>参与抽奖</span>
                        <span>我的优惠券</span>
                        <span>中奖记录</span>
                    </p>
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
                <CSSTransition
                    in={this.state.isShow}
                    timeout={2000}
                    classNames="coupon_box"
                    unmountOnExit
                    appear={true}
                    onEnter={this.getComplaintList.bind(this)}
                    onEntering={(el) => {}}
                    onEntered={(el) => {}}
                    onExit={(el) => {}}
                    onExiting={(el) => {}}
                    onExited={(el) => {}}
                >
                    <div className="box_dialog">
                        <div className="luckDraw">
                            <div className="luckDraw-title">
                            <h2>投诉列表</h2>
                            <span className="complaint_publish" onClick={this.handlePublishDialog.bind(this)}></span>
                                <nav onClick={this.handleCloseList.bind(this)}>
                                    <div className="back">
                                        <svg t="1578651010018" className="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2250" width="200" height="200"><path d="M366.32213 511.145539l377.388162-377.387139c15.865339-15.852036 15.865339-41.571814 0-57.422828-15.864316-15.864316-41.557488-15.864316-57.421804 0l-406.100088 406.099065c-15.864316 15.852036-15.864316 41.570791 0 57.421804l406.100088 406.100088c7.93267 7.93267 18.315134 11.899004 28.711926 11.899005 10.381441 0 20.778232-3.966335 28.710902-11.899005 15.865339-15.851013 15.865339-41.571814 0-57.422827L366.32213 511.145539z" p-id="2251" fill="#2c2c2c"></path></svg>
                                    </div>
                                </nav>
                            </div>
                            {list_Content}
                            {this.state.publishExist ? <div className="evaluate_box">
                                <div className="box-wrap">
                                    <div className="box_dialog release_box" style={{top: '20vh', left: '10vw', height: '20rem'}}>
                                        <div className="dialog_title">
                                            <span>发布投诉</span>
                                            <span className="title_close" onClick={this.handleClosePublishDialog.bind(this)}><Icon type='cross' /></span>
                                        </div>
                                        {/* 表单 */}
                                        <div className="release_form">
                                            <div className="form_box">
                                                <span>投诉学号</span>
                                                <div style={{width: '13rem'}}><Input id="id" onChange={this.handleChangeInput} placeholder={'请输入要投诉的学号'} value={this.state.id}/></div>
                                            </div>
                                            <div className="form_box">
                                                <span>投诉内容</span>
                                                {/* <div><Input id="contents" placeholder="投诉内容" onChange={this.handleChangeInput}  value={this.state.contents}/></div> */}
                                                <div style={{width: '13rem'}}>
                                                <TextArea
                                                    style={{width: '13rem'}}
                                                    placeholder="请输入您的投诉内容"
                                                    autoSize={{ minRows: 1, maxRows: 4 }}
                                                    onChange={this.handleChangeInput}
                                                    id="contents"
                                                    value={this.state.contents}/>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="dialog_submit">
                                            <Button type="primary" onClick={this.handleSubmitComplaint.bind(this)}>提交</Button>
                                        </div>
                                    </div>
                                </div>
                                <div className="box_mask"></div>
                            </div> : null}
                            {/* {this.state.noMore? luckDraw_Content : null} */}
                            {this.state.noMore?<div className='noMore'>没有更多了哦~</div> : 
                                <div className="loadMore" id="loadMore"> 
                                    <Icon type="loading" size={`xs`} />
                                    <span style={{marginLeft: '.3rem'}}>正在加载...</span> 
                                </div>}
                        </div>
                    </div>
                </CSSTransition>
            </div>
        );
    }
}
 
export default mineMain;
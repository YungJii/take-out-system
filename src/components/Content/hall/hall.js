import React, { Component } from 'react';
import { Popover, NavBar, Icon, Button, Toast } from 'antd-mobile';
import { Input, Radio } from 'antd';
import { CSSTransition } from 'react-transition-group'
import './hall.scss';
const axios = require('axios');
const Item = Popover.Item;

class Hall extends Component {
    constructor(props) {
        super(props);
        this.state = {
            page: 1,
            visible: false,
            noMore: false,
            data:[],
            // 列表index
            list_vallue: '',
            // 弹窗
            releaseExist: false,
            // 我的发布列表 /api/dining/myList
            isShow: false,
            // 我的接收列表 /api/dining/acceptList
            // isShowMyAcceptList: false,
            // 发布内容
            name: '',
            storeName: '',
            price: 0,
            pretime: 0,
            // 列表数据
            list_message: [],
            releasePage: 1,
            acceptPage: 1
        };

        this.handleChangeSelect = this.handleChangeSelect.bind(this)
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
  
    // /api/dining/index
    componentWillMount() {
        this.getDiningIndex(0)
        document.addEventListener('scroll',this._more.bind(this))
    }

    // 大厅列表
    getDiningIndex(index) {
        axios.get(`/api/dining/index?page=${this.state.page}`, {})
        .then((res) => {
            if (res.data.status === 200) {
                if (res.data.message.data.length !== 10) {
                    this.setState({
                        noMore: true
                    })
                }
                this.setState({
                    data: index === 0 ? this.state.data.concat(res.data.message.data) : res.data.message.data
                })
                // console.log(res.data.message.data)
            } else {
                window.location.href = '/login'
            }
        })
    }

    handleBack() {
        window.history.back();
    }

    // 选择框
    onSelect = (opt) => {
        console.log(opt.props.value);
        if (opt.props.value === '0') {
            this.setState({
                releaseExist: true
            })
        } else {
            this.setState({
                isShow: true,
                list_vallue: opt.props.value
            })
        }
        this.setState({
          visible: false
        });
    };

    // ... 按钮
    handleVisibleChange(visible) {
        this.setState({
          visible,
        });
    };

    // 接收餐饮
    handleAccept(id) {
        console.log(id)
        axios.post('/api/dining/accept', {id: id})
        .then((res) => {
            console.log()
            if (res.data.status === 200) {
                Toast.success(res.data.message, 2, () => {
                    this.getDiningIndex(1)
                });
            }
        })
    }

    // 删除
    handleDelete(id, index) {
        console.log(id)
        // /api/dining/del
        axios.post('/api/dining/del', {id: id})
        .then((res) => {
            if (res.data.status === 200) {
                if (index !== undefined) {
                    Toast.success(res.data.message, 2, () => {
                        axios.get(`/api/dining/myList`,{})
                        .then((res) => {
                            this.setState({
                                list_message: res.data.message
                            })
                        })
                        .then(() => {
                            this.getDiningIndex(1)
                        })
                    });
                } else {
                    Toast.success(res.data.message, 2, () => {
                        this.getDiningIndex(1)
                    });
                }
            }
        })
    }
    // 关闭弹窗
    handleRelease(index) {
        console.log('handleRelease')
        this.setState({
            releaseExist: false,
            name: '',
            storeName: '',
            price: 0,
            pretime: ''
        }, ()=> {
            if (index !== undefined) {
                this.getDiningIndex(1)
            }
        })
    }

    // 提交
    handleSubmit() {
        console.log('handleSubmit')
        axios.post('/api/dining/publish', {
            name: this.state.name,		
            storeName: this.state.storeName,		
            price: this.state.price,		
            pretime: this.state.pretime
        })
        .then((res) => {
            console.log(res)
            if(res.data.status === 200) {
                Toast.success(res.data.message, 2, () => {
                    this.handleRelease(1)
                })
            } else {
                Toast.fail(res.data.message, 2)
            }
        })
    }

    // 发布
    handleChangeSelect(e) {
        console.log(e.target.value)
        console.log(e.target.id)
        var storage = e.target.id
        if (e.target.id === undefined) storage = 'pretime'
        this.setState({
            [storage]: e.target.value
        })
        // console.log('handleChangeSelect')
    }

    // 列表
    getReleaseList() {
        console.log('getReleaseList')
        if (this.state.list_vallue === '1') {
            axios.get(`/api/dining/myList`,{})
            .then((res) => {
                this.setState({
                    list_message: res.data.message
                })
            })
        } else {
            axios.get(`/api/dining/acceptList`,{})
            .then((res) => {
                this.setState({
                    list_message: res.data.message
                })
            })
        }
    }
    // 关闭列表
    handleCloseList() {
        this.setState({
            isShow: false
        })
    }

    render() {
        let hall_Content = this.state.data.map((value, index) => {
            let button = value.acceptId !== 0 ? <Button type="link"  disabled={true} className="details-btn">已成交</Button> 
            : value.user_info.id === JSON.parse(window.localStorage.getItem('user_info')).id 
            ? <Button type="default" className="details-btn" onClick={this.handleDelete.bind(this, value.id)}>删除</Button> : <Button type="link" className="details-btn" onClick={this.handleAccept.bind(this, value.id)}>接餐</Button> 
            return (
                <div key={index} className="hall-item">
                    <div className="hall-img">
                        <img src={`${value.user_info.pic}`} alt="" />
                    </div>
                    <div className="hall-details">
                        {button}
                        <span className='username'>{value.user_info.name}</span>
                        <p>
                            <span className="details-title">餐饮信息：</span>
                            <span>{value.name}</span>
                        </p>
                        <p>
                            <span className="details-title">商家名称：</span>
                            <span>{value.storeName}</span>
                        </p>
                        <p>
                            <span className="details-title">餐饮价格：</span>
                            <span>{value.price}元</span>
                        </p>
                        <p>
                            <span className="details-title">餐饮时间段：</span>
                            <span>{value.pretime}</span>
                        </p>
                        <p>
                            <span className="details-title">发布时间：</span>
                            <span>{value.time}</span>
                        </p>
                    </div>
                </div>
            )
        })

        let list_Content = this.state.list_message.map((value, index) => {
            let accept_userinfo = value.acceptId !== 0 && value.accept_info ? 
            <p className="mt2">
                <p className="mt2">
                    <span className="details-title">接收人：</span>
                    <span>{value.accept_info.name}</span>
                </p>
                <p className="mt2">
                    <span className="details-title">手机：</span>
                    <span>{value.accept_info.phone}</span>
                </p>
            </p> : null
            // 发布列表删除按钮
            let delete_button = value.acceptId === 0 ? <Button type="default" className="details-btn" onClick={this.handleDelete.bind(this, value.id, 1)}>删除</Button> : null;
            return (
                <div key={index} className="hall-item">
                    <div className="hall-details" style={{margin: '2rem 1rem'}}>
                        {delete_button}
                        <p className="mt2">
                            <span className="details-title">餐饮信息：</span>
                            <span>{value.name}</span>
                        </p>
                        <p className="mt2">
                            <span className="details-title">商家名称：</span>
                            <span>{value.storeName}</span>
                        </p>
                        <p className="mt2">
                            <span className="details-title">餐饮价格：</span>
                            <span>{value.price}元</span>
                        </p>
                        <p className="mt2">
                            <span className="details-title">餐饮时间段：</span>
                            <span>{value.pretime}</span>
                        </p>
                        <p className="mt2">
                            <span className="details-title">发布时间：</span>
                            <span>{value.time}</span>
                        </p>
                        <p>
                            <span className="details-title">发布人：</span>
                            <span>{value.user_info.name}</span>
                        </p>
                        <p>
                            <span className="details-title">手机号码：</span>
                            <span>{value.user_info.phone}</span>
                        </p>
                        {accept_userinfo}
                    </div>
                </div>
            )
        })
        return (
            <div className="hall">
                <div className="hall-title">
                    {/* <h2>交餐大厅</h2> */}
                    <NavBar
                        style={{height: '8vh'}}
                        mode="light"
                        rightContent={
                            <Popover mask
                                    overlayClassName="fortest"
                                    overlayStyle={{ color: 'currentColor' }}
                                    visible={this.state.visible}
                                    overlay={[
                                    (<Item key="0" value="0">
                                        <span style={{ marginLeft: '4vw' }}>发布</span>
                                    </Item>),
                                    (<Item key="1" value="1" data-seed="logId">发布列表</Item>),
                                    (<Item key="2" value="2" style={{ whiteSpace: 'nowrap' }}>收餐列表</Item>),
                                    ]}
                                    align={{
                                    overflow: { adjustY: 0, adjustX: 0 },
                                    offset: [-10, 0],
                                    }}
                                    onVisibleChange={this.handleVisibleChange.bind(this)}
                                    onSelect={this.onSelect}
                                >
                                    <div style={{
                                    height: '100%',
                                    padding: '0 15px',
                                    marginRight: '-15px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    }}
                                    >
                                    <Icon type="ellipsis" />
                                    </div>
                                </Popover>
                                }>
                        交餐大厅
                    </NavBar>
                    <nav onClick={this.handleBack.bind(this)}className="back">
                        <svg t="1578651010018" className="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2250" width="200" height="200"><path d="M366.32213 511.145539l377.388162-377.387139c15.865339-15.852036 15.865339-41.571814 0-57.422828-15.864316-15.864316-41.557488-15.864316-57.421804 0l-406.100088 406.099065c-15.864316 15.852036-15.864316 41.570791 0 57.421804l406.100088 406.100088c7.93267 7.93267 18.315134 11.899004 28.711926 11.899005 10.381441 0 20.778232-3.966335 28.710902-11.899005 15.865339-15.851013 15.865339-41.571814 0-57.422827L366.32213 511.145539z" p-id="2251" fill="#2c2c2c"></path></svg>
                    </nav>
                </div>
                {hall_Content}
                {/* 发布 */}
                {this.state.releaseExist ? <div className="evaluate_box">
                    <div className="box-wrap">
                        <div className="box_dialog release_box">
                            <div className="dialog_title">
                                <span>发布</span>
                                <span className="title_close" onClick={this.handleRelease.bind(this)}><Icon type='cross' /></span>
                            </div>
                            {/* 表单 */}
                            <div className="release_form">
                                <div className="form_box">
                                    <span> &nbsp; &nbsp; 价格 &nbsp; &nbsp; </span>
                                    <div><Input id="price" placeholder="价格" onChange={this.handleChangeSelect}  value={this.state.price}/></div>
                                </div>
                                <div className="form_box">
                                    <span>餐饮名称</span>
                                    <div><Input id="name" placeholder="餐饮名称" onChange={this.handleChangeSelect}  value={this.state.name}/></div>
                                </div>
                                <div className="form_box">
                                    <span>商家信息</span>
                                    <div><Input id="storeName" placeholder="商家信息" onChange={this.handleChangeSelect}  value={this.state.storeName}/></div>
                                </div>
                                <div className="form_box">
                                    <span> &nbsp; &nbsp; 时间 &nbsp; &nbsp; </span>
                                    <div>
                                        <Radio.Group value={this.state.pretime}  onChange={this.handleChangeSelect}>
                                            <Radio value={0}>早上</Radio>
                                            <Radio value={1}>中午</Radio>
                                            <Radio value={2}>晚上</Radio>
                                        </Radio.Group>
                                    </div>
                                </div>
                                
                            </div>
                            <div className="dialog_submit">
                                <Button type="primary" onClick={this.handleSubmit.bind(this)}>提交</Button>
                            </div>
                        </div>
                    </div>
                    <div className="box_mask"></div>
                </div> : null}
                <CSSTransition
                    in={this.state.isShow}
                    timeout={2000}
                    classNames="coupon_box"
                    unmountOnExit
                    appear={true}
                    onEnter={this.getReleaseList.bind(this)}
                    onEntering={(el) => {}}
                    onEntered={(el) => {}}
                    onExit={(el) => {}}
                    onExiting={(el) => {}}
                    onExited={(el) => {}}
                >
                    <div className="box_dialog">
                        <div className="luckDraw">
                            <div className="luckDraw-title">
                            <h2>{this.state.list_vallue === '1' ? '发布列表' : '收餐列表'}</h2>
                                <nav onClick={this.handleCloseList.bind(this)}>
                                    <div className="back">
                                        <svg t="1578651010018" className="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2250" width="200" height="200"><path d="M366.32213 511.145539l377.388162-377.387139c15.865339-15.852036 15.865339-41.571814 0-57.422828-15.864316-15.864316-41.557488-15.864316-57.421804 0l-406.100088 406.099065c-15.864316 15.852036-15.864316 41.570791 0 57.421804l406.100088 406.100088c7.93267 7.93267 18.315134 11.899004 28.711926 11.899005 10.381441 0 20.778232-3.966335 28.710902-11.899005 15.865339-15.851013 15.865339-41.571814 0-57.422827L366.32213 511.145539z" p-id="2251" fill="#2c2c2c"></path></svg>
                                    </div>
                                </nav>
                            </div>
                            {list_Content}
                            {/* {this.state.noMore? luckDraw_Content : null} */}
                            {/* {this.state.noMore?<div className='noMore'>没有更多了哦~</div> : 
                                <div className="loadMore" id="loadMore"> 
                                    <Icon type="loading" size={`xs`} />
                                    <span style={{marginLeft: '.3rem'}}>正在加载...</span> 
                                </div>} */}
                        </div>
                    </div>
                </CSSTransition>
                {this.state.noMore?<div className='noMore'>没有更多了哦~</div> : 
                    <div className="loadMore" id="loadMore"> 
                        <Icon type="loading" size={`xs`} />
                        <span style={{marginLeft: '.3rem'}}>正在加载...</span> 
                    </div>}
            </div>
        );
    }
}
 
export default Hall;
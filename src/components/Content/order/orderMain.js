import React, { Component } from 'react';
import { Button } from 'antd-mobile';
import '../../../scss/orderMain.scss';

class Order extends Component {
    constructor(props) {
        super(props);
        this.state = {  }
    }
    render() { 
        return ( 
            <div style={{height: '100%', backgroundColor: '#f8f8f8'}}>
                <div className="orderMain-title">
                    <h2>我的订单</h2>
                </div>
                <div className="orderMain-content">
                    <h1>我的订单</h1>
                    <div className="orderMain-content-card">
                        <div className="avatar">
                            <img src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1572341919177&di=80314679352eaca073f87132e348b634&imgtype=0&src=http%3A%2F%2Fimg.zcool.cn%2Fcommunity%2F0313a9356208f1c0000014dd0cb38af.jpg" alt="" width="50px" height="50px"/>
                        </div>
                        <div className="details">
                            <div className="state-name">
                                <div style={{padding: '1rem 0'}}>
                                    <span className="name">
                                        渔小吉·无骨烤鱼饭
                                    </span>
                                    <span className="state">
                                        已送达
                                    </span>
                                    <div style={{clear: "both"}}></div>
                                    <div className="time">2019-10-27 21:39</div>
                                </div>
                            </div>
                            <div className="name-price">
                                <div style={{padding: '1.5rem 0'}}>
                                    <span className="name">
                                        招牌无骨浓汤酸菜鱼 + 可口可乐
                                    </span>
                                    <span className="price">
                                        ￥18.3
                                    </span>
                                    <div style={{clear: "both"}}></div>
                                </div>
                                {/* <Button>再来一单</Button> */}
                                <div style={{textAlign: 'right'}}>
                                    <Button type="ghost" size="small" inline style={{ marginRight: '4px' }} className="am-button-borderfix">再来一单</Button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="orderMain-content-card">
                        <div className="avatar">
                            <img src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1572341919177&di=80314679352eaca073f87132e348b634&imgtype=0&src=http%3A%2F%2Fimg.zcool.cn%2Fcommunity%2F0313a9356208f1c0000014dd0cb38af.jpg" alt="" width="50px" height="50px"/>
                        </div>
                        <div className="details">
                            <div className="state-name">
                                <div style={{padding: '1rem 0'}}>
                                    <span className="name">
                                        渔小吉·无骨烤鱼饭
                                    </span>
                                    <span className="state">
                                        已送达
                                    </span>
                                    <div style={{clear: "both"}}></div>
                                    <div className="time">2019-10-27 21:39</div>
                                </div>
                            </div>
                            <div className="name-price">
                                <div style={{padding: '1.5rem 0'}}>
                                    <span className="name">
                                        招牌无骨浓汤酸菜鱼 + 可口可乐
                                    </span>
                                    <span className="price">
                                        ￥18.3
                                    </span>
                                    <div style={{clear: "both"}}></div>
                                </div>
                                {/* <Button>再来一单</Button> */}
                                <div style={{textAlign: 'right'}}>
                                    <Button type="ghost" size="small" inline style={{ marginRight: '4px' }} className="am-button-borderfix">再来一单</Button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="orderMain-content-card">
                        <div className="avatar">
                            <img src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1572341919177&di=80314679352eaca073f87132e348b634&imgtype=0&src=http%3A%2F%2Fimg.zcool.cn%2Fcommunity%2F0313a9356208f1c0000014dd0cb38af.jpg" alt="" width="50px" height="50px"/>
                        </div>
                        <div className="details">
                            <div className="state-name">
                                <div style={{padding: '1rem 0'}}>
                                    <span className="name">
                                        渔小吉·无骨烤鱼饭
                                    </span>
                                    <span className="state">
                                        已送达
                                    </span>
                                    <div style={{clear: "both"}}></div>
                                    <div className="time">2019-10-27 21:39</div>
                                </div>
                            </div>
                            <div className="name-price">
                                <div style={{padding: '1.5rem 0'}}>
                                    <span className="name">
                                        招牌无骨浓汤酸菜鱼 + 可口可乐
                                    </span>
                                    <span className="price">
                                        ￥18.3
                                    </span>
                                    <div style={{clear: "both"}}></div>
                                </div>
                                {/* <Button>再来一单</Button> */}
                                <div style={{textAlign: 'right'}}>
                                    <Button type="ghost" size="small" inline style={{ marginRight: '4px' }} className="am-button-borderfix">再来一单</Button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="orderMain-content-card">
                        <div className="avatar">
                            <img src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1572341919177&di=80314679352eaca073f87132e348b634&imgtype=0&src=http%3A%2F%2Fimg.zcool.cn%2Fcommunity%2F0313a9356208f1c0000014dd0cb38af.jpg" alt="" width="50px" height="50px"/>
                        </div>
                        <div className="details">
                            <div className="state-name">
                                <div style={{padding: '1rem 0'}}>
                                    <span className="name">
                                        渔小吉·无骨烤鱼饭
                                    </span>
                                    <span className="state">
                                        已送达
                                    </span>
                                    <div style={{clear: "both"}}></div>
                                    <div className="time">2019-10-27 21:39</div>
                                </div>
                            </div>
                            <div className="name-price">
                                <div style={{padding: '1.5rem 0'}}>
                                    <span className="name">
                                        招牌无骨浓汤酸菜鱼 + 可口可乐
                                    </span>
                                    <span className="price">
                                        ￥18.3
                                    </span>
                                    <div style={{clear: "both"}}></div>
                                </div>
                                {/* <Button>再来一单</Button> */}
                                <div style={{textAlign: 'right'}}>
                                    <Button type="ghost" size="small" inline style={{ marginRight: '4px' }} className="am-button-borderfix">再来一单</Button>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* <div className="orderMain-content-card">
                            
                    </div> */}
                </div>
            </div>
         );
    }
}
 
export default Order;
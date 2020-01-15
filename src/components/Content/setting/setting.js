import React, { Component } from 'react';
import { Toast } from 'antd-mobile';
import './setting.scss';
import imgUpload from '../../../assets/script/img_opera.js'
const axios = require('axios');

class Setting extends Component {
    constructor(props) {
        super(props);
        this.state = {
            message: {},
            phone: '',
            address: '',
            lng: '',
            lat: '',
            pic: ''
        }
    }
    
    componentWillMount() {
        if (localStorage.getItem('user_info') === null) {
            window.location.href=`/login`;
        } else {
            this.setState({
                message: JSON.parse(localStorage.getItem('user_info')),
                pic: JSON.parse(localStorage.getItem('user_info')).pic
            }, () => {
                console.log(this.state.message)
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
            } 
        })
    }

    // 设置图片
    handleSetPic() {
        let _this = this
        let getCompressiveFileList = (fileList) => {
            fileList.forEach(function(blob) {
                var reader = new FileReader();
                reader.onload = function() {
                    document.getElementById('img').src = this.result
                    _this.setState({
                        pic: this.result
                    })
                }
                reader.readAsDataURL(blob);
            })
        }
        
        imgUpload().then((v) => {
            v.click()
            v.onchange = function () {
                var fileList = this.files;
                var process = window.lzImgProcess();
                process(fileList, getCompressiveFileList);
            }
        })
    }

    componentDidMount() {
        // 惠院： [114.418327, 23.037116], zoom: 15
        // 新华： [113.580764, 23.062536], zoom: 15
        console.log(this.state.message.school)
        let marker_storage = {}
        let lng, lat
        if (this.state.message.school === 1) {
            lng = this.state.message.lng === null ? 114.418327 : parseFloat(this.state.message.lng);
            lat = this.state.message.lat === null ? 23.037116 : parseFloat(this.state.message.lat);
        } else {
            lng = this.state.message.lng === null ? 113.580764 : parseFloat(this.state.message.lng);
            lat = this.state.message.lat === null ? 23.062536 : parseFloat(this.state.message.lat);
        }
        let AMap = window.AMap
        // console.log([parseFloat(this.state.message.lng), parseFloat(this.state.message.lat)])
        var map = new AMap.Map('map', {
            zoom:15,
            center: [lng, lat]
            // center: [114.417467, 23.039116]
        });
        
        AMap.plugin(['AMap.ToolBar','AMap.DistrictLayer','AMap.Geolocation', 'AMap.Geocoder'],function(){//异步加载插件
        });

        let school_1 = [
            [114.415361, 23.039949],
            [114.418345, 23.040675],
            [114.42022, 23.042105],
            [114.422736, 23.040539],
            [114.42207, 23.039926],
            [114.424339, 23.035228],
            [114.42244, 23.034207],
            [114.420812, 23.036068],
            [114.418493, 23.035364],
            [114.418173, 23.032459],
            [114.416348, 23.033185],
            [114.416742, 23.030961],
            [114.415731, 23.030371],
            [114.414695, 23.032459],
            [114.413659, 23.032073],
            [114.41361, 23.033594],
            [114.414843, 23.035954]
        ]

        let school_2 = [
            [113.582262, 23.066503],
            [113.583471, 23.065958],
            [113.584556, 23.06521],
            [113.585814, 23.06437],
            [113.586332, 23.063372],
            [113.586529, 23.06226],
            [113.585937, 23.060875],
            [113.584753, 23.060104],
            [113.583224, 23.059219],
            [113.58204, 23.058243],
            [113.58024, 23.057131],
            [113.575356, 23.058447],
            [113.576096, 23.062055],
            [113.57585, 23.064688],
            [113.578119, 23.066208],
            [113.580807, 23.065709]
        ]
        let path = this.state.message.school === 1 ? school_1 : school_2;
        map.on('click', (e) => {
            const {lng, lat} = e.lnglat
            console.log(lng)
            console.log(lat)
            var marker = new AMap.Marker({
                position: new AMap.LngLat(lng, lat),
                offset: new AMap.Pixel(-10, -35),
                icon: new AMap.Icon({
                    size: new AMap.Size(20, 30),    // 图标尺寸
                    image: '//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-default.png',  // Icon的图像
                    imageSize: new AMap.Size(20, 30)   // 根据所设置的大小拉伸或压缩图片
                }),
                zoom: 13
            });
            if (marker_storage.CLASS_NAME !== undefined && AMap.GeometryUtil.isPointInRing(marker.getPosition(),path) === true) {
                map.remove(marker_storage)
            }
            if (AMap.GeometryUtil.isPointInRing(marker.getPosition(),path) === false) {
                Toast.fail('地址只能选定在学校的范围内', 1, () => {
                    map.remove(marker)
                });
            } else {
                // 赋值
                marker_storage = marker
                map.add(marker);
                // input 详情
                var geocoder = new AMap.Geocoder({
                    city : '全国', //城市，默认：“全国”
                    radius : 500 //范围，默认：500
                });
                geocoder.getAddress([lng, lat], (status, result) => {
                    // console.log(result.regeocode.formattedAddress)
                    let address = result.regeocode.formattedAddress.replace('广东省东莞市麻涌镇', '');
                    address = address.replace('中山大学新华学院东莞校区', '');
                    this.setState({
                        lng: lng,
                        lat: lat,
                        address: address
                    }, () => {
                        console.log(this.state)
                    })
                });
            }
        });
    }

    // 修改手机_函数节流
    handleChangePhone(event) {
        // console.log(event.target.value)
        this._throttle(this.setState_phone, this, event.target.value)
    }

    // 修改手机
    setState_phone(value) {
        console.log(value)
        this.setState({
            phone: value
        })
    }

    // 节流
    _throttle(method,context,value){
		clearTimeout(method.tId);
		method.tId=setTimeout(function(){
			method.call(context, value)
		},500)
    }

    // 修改地址
    handleChangeAddress() {
        console.log('handleChangeAddress')
    }

    // 保存设置
    handleSaveSetting() {
        axios.post('/api/user/makeUserInfo', {
            phone: this.state.phone || this.state.message.phone,
            address: this.state.address || this.state.message.address,
            lng: this.state.lng || this.state.message.lng,
            lat: this.state.lat || this.state.message.lat,
            pic: this.state.pic || this.state.message.pic
        })
        .then((res) => {
            console.log(res)
            if (res.data.status === 200) {
                Toast.success(res.data.message, 1, () => {
                    this.handleGetInfo()
                });
            } else {
                Toast.fail(res.data.message, 1, () => {
                    window.location.href=`/login`;
                });
            }
        })
    }

    render() { 
        return ( 
            <div className="setting_box">
                <div className="setting_title">
                    <nav>
                        <a href="/mine" className='back'>
                            <svg t="1578651010018" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2250" width="200" height="200"><path d="M366.32213 511.145539l377.388162-377.387139c15.865339-15.852036 15.865339-41.571814 0-57.422828-15.864316-15.864316-41.557488-15.864316-57.421804 0l-406.100088 406.099065c-15.864316 15.852036-15.864316 41.570791 0 57.421804l406.100088 406.100088c7.93267 7.93267 18.315134 11.899004 28.711926 11.899005 10.381441 0 20.778232-3.966335 28.710902-11.899005 15.865339-15.851013 15.865339-41.571814 0-57.422827L366.32213 511.145539z" p-id="2251" fill="#2c2c2c"></path></svg>
                        </a>
                    </nav>
                    <h2>
                        修改个人信息
                    </h2>
                </div>
                <div className="setting_content">
                    <div className="avatar">
                        <input type="file" id="choose" accept="image/*" multiple="multiple" style={{display: 'none'}}/>
                        <img src={this.state.message.pic} alt="" onClick={this.handleSetPic.bind(this)} id="img"></img>
                    </div>
                    <div className="content_line">
                        <span className="title">姓名</span>
                        <span className="content">{this.state.message.name}</span>
                    </div>
                    <div className="content_line">
                        <span className="title">学号</span>
                        <span className="content">{this.state.message.sno}</span>
                    </div>
                    <div style={{display: 'flex'}} className="content_line"> 
                        <span className="title" style={{lineHeight: '2rem'}}>手机号码</span>
                        <div style={{paddingLeft: '3rem'}}>
                            <input type="number" maxLength='11' placeholder={this.state.message.phone} onChange={this.handleChangePhone.bind(this)}/>
                            <div className="underline"></div>
                        </div>
                    </div>
                    <div style={{display: 'flex'}} className="content_line"> 
                        <span className="title" style={{lineHeight: '2rem'}}>地址</span>
                        <div style={{paddingLeft: '3rem'}}>
                            <input type="text" maxLength='11' placeholder={this.state.message.address || (this.state.message.school === 1 ? '惠州学院' : '中山大学新华学院')} onChange={this.handleChangeAddress.bind(this)} value={this.state.address}/>
                            <div className="underline"></div>
                        </div>
                    </div>
                    <div className="map_div">
                        <div className="map" id="map"></div>
                    </div>
                </div>
                <div className="save_setting">
                    <button className='save_setting_button' onClick={this.handleSaveSetting.bind(this)}>
                        保存设置
                    </button>
                </div>
            </div>
        );
    }
}
 
export default Setting;
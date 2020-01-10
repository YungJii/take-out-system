import React,{Component} from 'react'
import '../../../scss/shopInformation.scss';
const axios = require('axios');

class ShopInformationSmart extends Component{
	constructor(props){
		super(props);
		this.state={
			message: {}
		}
	}

	componentWillMount() {
		axios.get('/api/store/one', {
            params: {
                storeId: this.props.storeId
            }
        })
        .then( (res) => {
            console.log(res.data.message)
            this.setState({
                message: res.data.message
            })
        })
	}
	
	render(){
		let data = this.state.message
		return(
			<div ref={(body) => { this.body = body; }}className='shop_info'>
				<section className='section'>
					<h3 className="section-title">活动与服务</h3>
				</section>

				<section className="section">
					<h3 className="section-title">商家信息</h3>
					<ul className="section_information_list">
						<li>{data.introduce||'暂无简介'}</li>
						<li>
							<span>商家电话</span>
							<span>
								<span><a href={`tel:${data.phone}`}>{data.phone}</a></span>
								<svg className="arrow-right" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 547 987" width="100%" height="100%"><path d="M0 931.973l51.2 54.613 494.933-494.933L51.2.133 0 51.333l440.32 440.32L0 931.973z"/></svg>
							</span>
						</li>
						<li>
							<span>地址</span>
							<span>{data.address||''}</span>
						</li>
						<li>
							<span>营业时间</span>
							<span>{data.startTime}-{data.endTime}</span>
						</li>
					</ul>
				</section>
			</div>
		)
	}
}
export default ShopInformationSmart;
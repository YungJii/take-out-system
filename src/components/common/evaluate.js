import React,{Component} from 'react';
import '../../scss/evaluate.scss';
import { Icon, TextareaItem, Button, Toast } from 'antd-mobile';
const axios = require('axios');

class Evaluate extends Component{
	constructor(){
		super();
		this.state={
            grade: 5,
            evaluate: ''
		}
    }
	
	componentWillMount() {
        console.log(this.props.num)
    }
    
    // 关闭评价
    handleEvaluate() {
        this.props.handleEvaluate('')
    }

    // 点星星
    handleStar(v) {
        console.log(v)
        this.setState({
            grade: v
        })
    }

    // 提交评价
    handleSubmit() {
        console.log('handleSubmit')
        axios.post('/api/order/evaluate', {
            num: this.props.num,
            grade: this.state.grade,
            evaluate: this.state.evaluate
        })
        .then((res) => {
            console.log(res)
            if (res.data.status === 200) {
                Toast.success(res.data.message, 1, () => {
                    this.handleEvaluate('')
                });
            } else {
                Toast.fail(res.data.message, 1, () => {
                    this.handleEvaluate('')
                });
            }
        })
    }

    // 修改评语_函数节流
    handleChangeText(value) {
        this._throttle(this.setState_text, this, value)
    }

    // 修改评语
    setState_text(value) {
        this.setState({
            evaluate: value
        }, () => {
            console.log(this.state)
        })
    }

    // 节流
    _throttle(method,context,value){
		clearTimeout(method.tId);
		method.tId=setTimeout(function(){
			method.call(context, value)
		},500)
    }

	render(){
        let stars_yellow = new Array(this.state.grade).fill(1).map((v, i) => {
            return (
                <span className="stars_yellow" key={i} onClick={this.handleStar.bind(this, i+1)}></span>
            )
        })

        let stars_grey = [1,2,3,4,5].map((v, i) => {
            return (
                <span className="stars_grey" key={i} onClick={this.handleStar.bind(this, v)}></span>
            )
        })
		return(
			<div className="evaluate_box">
                <div className="box-wrap">
                    <div className="box_dialog">
                        <div className="dialog_title">
                            <span>评价订单</span>
                            <span className="title_close" onClick={this.handleEvaluate.bind(this)}><Icon type='cross' /></span>
                        </div>
                        <div style={{display: 'flex', justifyContent: 'center', margin: '1rem'}}>
                            <div className="activityPage_star">
                                    <div className='star_gery_box'>
                                        {stars_grey}
                                    </div>
                                    <div className='star_yellow_box'>
                                        {stars_yellow}
                                    </div>
                            </div>
                        </div>
                        <p className={`${this.state.grade === 5 ? 'good' : this.state.grade > 2 && this.state.grade < 5 ? 'commonly' : 'bad'} expression`}>{this.state.grade === 5 ? '超赞' : this.state.grade === 4 ? '满意' : this.state.grade === 3 ? '一般' : this.state.grade === 2 ? '差' : '非常差'}</p>
                        <div className="dialog_textarea">
                            <TextareaItem
                                rows={3}
                                placeholder="您的鼓励是我们最大的动力"
                                onChange={this.handleChangeText.bind(this)}
                            />
                        </div>
                        <div className="dialog_submit">
                            <Button type="primary" onClick={this.handleSubmit.bind(this)}>提交</Button>
                        </div>
                    </div>
                </div>
                <div className="box_mask"></div>
			</div>
		)
	}
}



export default Evaluate;
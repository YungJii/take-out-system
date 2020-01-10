import React, { Component } from 'react';
import '../../../scss/tabs.scss';

class Tabs extends Component {
    constructor(){
		super()
		this.state = {
			current: 0
		}
    }
    
	handClick(index) {
		this.setState({
			current:index
		})
	}
    render() { 
        return ( 
            <div>
                {/* shop页面的商品、评价、店铺 */}
				<div className='tabs_border_box'>
					{this.props.data.map((value,index)=>
						<div className={`tabs_border ${this.state.current===index?'tabs_border_active':' '}`} key={index} onClick={this.handClick.bind(this,index)}>
							<span className='tabs_border_tag'>{value.title}</span>
						</div>
					)}
				</div>
				{/*注意这个api ysq遍历这个组件下包含的子组件，然后通过上边的box点击切换current来改变子组件的显示跟隐藏*/}
				<div className='tabs_body'>
					{React.Children.map(this.props.children,(child)=>{
					    return <div className='scrollBoxL' style={{display:`${Number(child.key)===Number(this.state.current)?'block ':'none'}`}}>{child}</div>
					})}
				</div>
            </div>
         );
    }
}
 
export default Tabs;
import React, { Component } from 'react';
import '../../../scss/commoditySmart.scss';
const axios = require('axios');

class CommoditySmart extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            message: {},
            food_stroage: {},
            menu_storage: {},
            commodities_quantity: 0
        }
    }

    componentWillMount() {
        axios.get('/api/store/getTypeAndFood', {
            params: {
                storeId: this.props.storeId
            }
        })
        .then( (res) => {
            let data = res.data.message
            // 商品购买的数量
            let food_stroage = {}
            // 左侧菜单的标点数量
            let menu_storage = {}
            console.log(res.data.message)
            for (let i = 0; i < data.length; i++) {
                menu_storage[data[i].id] = 0
                for (let j = 0; j < data[i].food_info.length; j++) {
                    food_stroage[data[i].food_info[j].id] = 0
                }
            }
            this.setState({
                message: data,
                food_stroage: food_stroage,
                menu_storage: menu_storage
            })
        })
    }


    componentDidMount() {
        let headerHeight=document.querySelector('.shoplist_header').offsetHeight;
		for(let i=0;i<document.querySelectorAll('.scrollBoxL').length;i++){
			document.querySelectorAll('.scrollBoxL')[i].style.height=document.body.clientHeight-this.body.offsetTop+headerHeight+30+'px';
		}
    }

    // 添加(减少)按钮 ==== opera 1增加 -1 减少
    handleSubmit(vc, opera, e) {
        
        console.log(vc)
        let will_change_food = {}
        let will_change_menu = {}
        if (opera > 0) {
            // 加号键的动画
            let div=document.createElement('div');
            div.className='ballFather';
            document.body.appendChild(div);
            let sonDiv=document.createElement('div');
            sonDiv.className='ballSon'
            div.appendChild(sonDiv);
            let top = e.target.getBoundingClientRect().top
            let left = e.target.getBoundingClientRect().left
            div.style.left=left+'px';
            div.style.top=top+'px';
            let y = (window.innerHeight - top);
            div.style.display ='';
            div.style.webkitTransform = `translate3d(0,${y}px,0)`;
            div.style.transform = `translate3d(0,${y}px,)0`;
            sonDiv.style.webkitTransform = `translate3d(-${left-10}px,0,0)`;
            sonDiv.style.transform = `translate3d(-${left-10}px,0,0)`;
            setTimeout(()=>{
                document.body.removeChild(div);
                document.querySelector('.shopping_footer').classList.add("animation");
                setTimeout(()=>{
                    document.querySelector('.shopping_footer').classList.remove("animation");
                },400)
            },620)

            will_change_food[vc.id] = this.state.food_stroage[vc.id] + 1
            will_change_menu[vc.typeId] = this.state.menu_storage[vc.typeId] + 1
        } else if (this.state.food_stroage[vc.id] === 0 && opera < 0) {
            // 如果数量等于0的时候则不执行
            return
        } else {
            will_change_food[vc.id] = this.state.food_stroage[vc.id] - 1
            will_change_menu[vc.typeId] = this.state.menu_storage[vc.typeId] - 1
        }
        this.setState({
            food_stroage: Object.assign({}, this.state.food_stroage, will_change_food),
            menu_storage: Object.assign({}, this.state.menu_storage, will_change_menu)
        }, () => {
            let commodities_quantity = 0
            for (let i in this.state.menu_storage) {
                commodities_quantity += this.state.menu_storage[i]
            }
            // console.log(commodities_quantity)
            this.setState({
                commodities_quantity: commodities_quantity
            })
        })
    }

    cartDetails() {
        console.log('cartDetails')
    }

    render() { 
        let data = this.state.message.length > 0 ? this.state.message : []
        // 左侧菜单
        let listDomTab = data.map((v, index) => {
            // console.log(v)
            return(
                <li key={index}>
                    { this.state.menu_storage[v.id] !== 0 ? <span className="category_tip"> {this.state.menu_storage[v.id]} </span> : null}
                    <span className="">
                        {v.name}
                    </span>
                </li>
            )
        })

        // 右侧内容
        let listDomMain = data.map((v, index) => {
            let listDomDes = v.food_info.map((vc, indec) => {
                return (
                    <dd className='commodity_main_list' key={indec}>
                        <div className='commodity_main_list_c'>
                            <span className='commodity_main_list_img'>
                                <img src={`${window.config_url}${vc.img}`} alt=""/>
                            </span>
                            <section className='commodity_main_list_des'>
                                <header className='commodity_main_list_des_title'>
                                    <span>{vc.name}</span>
                                </header>
                                <p className='commodity_main_list_des_ev'>
                                    {vc.description}
                                </p>
                                <p className='food_buy'>
                                    <span>月售{vc.sales}份</span>
                                </p>
                                <strong className='food_money'>
                                    <span>{vc.money}</span>
                                </strong>
                                <div className='food_add'>
                                    <span className='food_add_box'>
                                        {this.state.food_stroage[vc.id] !== 0? <span className='food_add_add' onClick={this.handleSubmit.bind(this, vc , -1)}>
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 44 44" version="1.1"><path fillRule="evenodd" d="M22 0C9.8 0 0 9.8 0 22s9.8 22 22 22 22-9.8 22-22S34.2 0 22 0zm0 42C11 42 2 33 2 22S11 2 22 2s20 9 20 20-9 20-20 20z" clipRule="evenodd"></path><path fillRule="evenodd" d="M32 20c1.1 0 2 .9 2 2s-.9 2-2 2H12c-1.1 0-2-.9-2-2s.9-2 2-2h20z" clipRule="evenodd"></path></svg>
                                        </span> : null }
                                        {this.state.food_stroage[vc.id] !== 0? <span role="button" className="food_add_box_s">{this.state.food_stroage[vc.id]}</span> : null}
                                        <span className='food_add_add' onClick={this.handleSubmit.bind(this, vc , 1)} ref={(add)=>{this.add = add}}>
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 44 44" version="1.1"><path fill="none" d="M0 0h44v44H0z"/><path fillRule="evenodd" d="M22 0C9.8 0 0 9.8 0 22s9.8 22 22 22 22-9.8 22-22S34.2 0 22 0zm10 24h-8v8c0 1.1-.9 2-2 2s-2-.9-2-2v-8h-8c-1.1 0-2-.9-2-2s.9-2 2-2h8v-8c0-1.1.9-2 2-2s2 .9 2 2v8h8c1.1 0 2 .9 2 2s-.9 2-2 2z" clipRule="evenodd"/></svg>
                                        </span>
                                    </span>
                                </div>
                            </section>
                        </div>
                    </dd>
                )
            })
            return (
                <dl key={index}>
					<dt>
						<div className='commodity_main_menu_title'>
							<strong>{v.name}</strong>
						</div>
					</dt>
					{listDomDes}
				</dl>
            )
        })

        // 购物车内容
        // let list=this.props.mainFoods.map((value,index)=>{
		// 	return(
		// 		<li className='footer_all_tip_main_list' key={index}>
		// 			<span className="entityList-entityname_1">
		// 				<em className="entityList-entityname_1_1">{value.name}</em>
		// 			</span>
		// 			<span className="entityList-entityname_2">
		// 				<span className="entityList-entityname_2_1">{value.price*value.quantity}</span>
		// 			</span>
		// 			<span className="entityList-entityname_3 food_add">
		// 				<Selected  
		// 				quantity={value.quantity} 
		// 				handleSubmit={this.handleFooterAdd.bind(this,index)}
		// 				handleSubmitCut={this.handleFooterCut.bind(this,index)}
		// 				/>
		// 			</span>
		// 		</li>
		// 	)
        // })
        

        return ( 
            <div className="commodity" ref={(body) => { this.body = body; }}>
                <div className='commodity_box'>
					<ul className='list_cont' ref={(category)=>{this.category=category}}>
						{listDomTab}
					</ul>
					<div className='commodity_main' ref={(main)=>{this.main=main}}>
						<div className='commodity_main_menu'>
							{listDomMain}
						</div>
					</div>
				</div>

                <footer className='shop_footer'>
                    {/* <div onClick={this.handleClick.bind(this)} ref={(cover)=>{this.cover=cover}} style={{'display':'none'}} className={`footer_all_list_cover ${this.state.showList?'footer_all_list_cover_enter':'footer_all_list_cover_leave'}`} ></div> */}
                    {/* <div className={`footer_all_tip_list ${this.state.showList?'footer_all_tip_list_on':''}`}> */}
                    <div className="footer_all_tip_list">
                        <div ref={(main)=>{this.main=main}} style={{opacity:0}}>
                            <div className='footer_all_tip_title'>
                                <div className='aleady_foods'>
                                    <span className='aleady_foods_title'>已选商品</span>
                                </div>
                                <span className='aleady_click'>
                                    <svg viewBox="0 0 24 32" version="1.1"><path fill="#bbb" fillRule="evenodd" d="M21.5 10h-19c-1.1 0-1.918.896-1.819 1.992l1.638 18.016C2.419 31.104 3.4 32 4.5 32h15c1.1 0 2.081-.896 2.182-1.992l1.637-18.016A1.798 1.798 0 0 0 21.5 10zM8 28H5L4 14h4v14zm6 0h-4V14h4v14zm5 0h-3V14h4l-1 14zm2-24h-2.941l-.353-2.514C17.592.669 16.823 0 15.998 0H8c-.825 0-1.593.668-1.708 1.486L5.94 4H3a3 3 0 0 0-3 3v1h24V7a3 3 0 0 0-3-3zM8.24 2h7.52l.279 2H7.96l.28-2z"/></svg>
                                    {/* <span onClick={this.emptyAllFodds.bind(this)}>清空</span> */}
                                    <span>清空</span>
                                </span>
                            </div>
                            {/* <div className='footer_all_tip_main'>
                                <ul>
                                    {list}
                                </ul>
                            </div> */}
                        </div>
                    </div>
                    <div className='shop_footer_box'>
                        {/* 购物车图标 */}
                        <span className={`${this.state.commodities_quantity === 0 ? 'isNumNone' : ''} shopping_footer`} data-quantity={this.state.commodities_quantity} onClick={this.cartDetails.bind(this)}></span>
                        <div className='shopping_footer_middle'>
                            <p className='shop_price'>
                                {/* <span>¥{this.props.arriveMoney}</span> */}
                                <span>¥0</span>
                            </p>
                            {/* <p className='kd_price'>{this.props.data.piecewise_agent_fee}</p> */}
                        </div>
                        {/* <span className={`shoping_submit ${this.props.arriveMoney >= this.props.data.float_minimum_order_amount ? '' : 'isdisable'}`}> */}
                        <span className="isdisable shoping_submit">
                            <span>去结算</span>
                            {/* {this.props.arriveMoney >= this.props.data.float_minimum_order_amount ? <span>去结算</span> : <span>还差¥{this.props.data.float_minimum_order_amount-this.props.arriveMoney}起送</span>} */}
                        </span>
                    </div>
                </footer>
            </div>
         );
    }
}
 
export default CommoditySmart;
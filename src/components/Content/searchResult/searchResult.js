import React, { Component } from 'react';
import { SearchBar } from 'antd-mobile';
import BusinessList from '../../common/businessList.js'
import './searchResult.scss';
const axios = require('axios');

class searchResult extends Component {
    constructor(props) {
      super(props);
      this.state = {
          name: '',
          search_none: false,
          message: [],
          // 1 是按商家名 0 是按食品名
          condition: 1
      };
    }

    componentDidMount() {
        console.log(this.props)
        
    }
    

    componentWillMount() {
      this.setState({
        name: this.props.name
      }, () => {
        this.onSubmit(this.state.name)   
      })
    }

    
    onSubmit(value) {
      let url = ''
      if (value === undefined && this.state.name !== '') {
        value = this.state.name
      }
      this.setState({
        name: value,
        message: []
      })
      if (this.state.condition === 1) {
        url = '/api/store/getStoreByName'
      } else {
        url = '/api/store/getFoodByName'
      }
      axios.get(url, {
          params: {
            name: value
          }
      })
      .then( (res) => {
          console.log(res)
          this.setState({
            search_none: res.data.message.length === 0,
          }, () => {
            this.setState({
              message: res.data.message
            })
          })
      })
    }


    searchHandle(condition) {
      console.log(condition)
      if (this.state.condition === condition) {
        return;
      }
      this.setState({
        condition: condition
      }, () => {
        this.onSubmit()
      })
    }

    render() {
      let placeholder = this.state.name ? this.state.name : 'Search'
      return (
          <div className="search_result_box">
              <div className="search_bar">
                  <span className="search_bar_span">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 32" version="1.1"><path fill="#fff" d="M16.552 5.633l-2.044-2.044L2.243 15.854l12.265 12.557 2.044-2.044L6.331 15.854z"/></svg>
                  </span>
                <SearchBar maxLength={8} onSubmit={this.onSubmit.bind(this)} placeholder={placeholder} />
              </div>
              <div className="search_result_contant">
                <p className="search_condition">
                  <span className={`${this.state.condition === 1? 'selected' : ''}`} onClick={this.searchHandle.bind(this, 1)}>按商家名</span>  
                  <span className={`${this.state.condition === 1? '' : 'selected'}`} onClick={this.searchHandle.bind(this, 0)}>按食品名</span>  
                </p>
                <p className={`recommend_title ${this.state.search_none ? 'hidden' : ''}`}>商家</p>
                {this.state.message.map((value,index)=>{return <BusinessList data={value} key={index}/>})}
              </div>
              <div className={`no_result ${this.state.search_none ? '' : 'hidden'}`}>
                <img src={require("../../../assets/images/search_none.png")} alt=""></img>
                <div>
                  <p className="no_result_p1">附近没有搜索结果</p>
                  <p className="no_result_p2">换个关键词试试吧</p>
                </div>
              </div>
          </div>
      );
    }
  }
 
export default searchResult;
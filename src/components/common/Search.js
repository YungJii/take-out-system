import React, { Component } from 'react';
import { SearchBar } from 'antd-mobile';
import '../../scss/Search.scss';

class Search extends Component {
  onSubmit = (v) => {
    console.log('onSubmit')
    console.log(v)
    window.location.href=`/search/${v}`;
  }
  render() {
    return (
        <div>
            {/* <WingBlank><div className="sub-title">Normal</div></WingBlank> */}
            <SearchBar placeholder="Search" maxLength={8} onSubmit={this.onSubmit.bind(this)}/>
        </div>
    );
  }
}

 
export default Search;
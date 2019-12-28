import React, { Component } from 'react';

import { SearchBar } from 'antd-mobile';
import '../../scss/Search.scss';

class Search extends Component {
  onChange= (value) => {
    this.setState({ value });
  };
  clear = () => {
    this.setState({ value: '' });
  };
  handleClick = () => {
    this.manualFocusInst.focus();
  }
  render() {
    return (
        <div>
            {/* <WingBlank><div className="sub-title">Normal</div></WingBlank> */}
            <SearchBar placeholder="Search" maxLength={8} />
        </div>
    );
  }
}

 
export default Search;
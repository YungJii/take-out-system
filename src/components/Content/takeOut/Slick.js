import React, { Component } from 'react';
import { Carousel, WingBlank, Toast } from 'antd-mobile';

class Slick extends Component {
  state = {
    data: ['2'],
    imgHeight: 176,
  }
  
  componentDidMount() {
    // simulate img loading
    // setTimeout(() => {
    //   this.setState({
    //     data: ['AiyWuByWklrrUDlFignR', 'TekJlZRVCjLFexlOCuWn', 'IJOtIlfsYdTyaDTRVrLI'],
    //   });
    // }, 100);
  }

  handleGoHall(index) {
    if (index === 0) {
      if (JSON.parse(window.localStorage.getItem('user_info')).status === 0) {
        Toast.fail('你的账号违规，不可进入交餐大厅', 2)
        return
      }
      window.location.href = '/hall'
    }
  }

  render() {
    return (
      <WingBlank>
        <Carousel
          autoplay
          cellSpacing={16}
          infinite
        >
          {this.state.data.map((val, index) => (
                <img
                    key={index}
                    src={require(`../../../assets/images/slick/pic${val}.jpg`)}
                    // src={'../../assets/images/6.jpg'}
                    alt=""
                    style={{ width: '100%', verticalAlign: 'top' }}
                    onLoad={() => {
                      window.dispatchEvent(new Event('resize'));
                      this.setState({ imgHeight: 'auto' });
                    }}
                    onClick={this.handleGoHall.bind(this, index)}
                />
          ))}
        </Carousel>
      </WingBlank>
    );
  }
}
 
export default Slick;
import React, { Component } from 'react';
import { Carousel, WingBlank } from 'antd-mobile';

class Slick extends Component {
  state = {
    data: ['1', '2', '3'],
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
                />
          ))}
        </Carousel>
      </WingBlank>
    );
  }
}
 
export default Slick;
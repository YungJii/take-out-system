import React, { Component } from 'react';
import '../../../scss/mineMain.scss';
class mineMain extends Component {
    constructor(props) {
        super(props);
        this.state = {  }
    }
    render() { 
        return ( 
            <div style={{height: '100%', backgroundColor: '#f8f8f8'}}>
                <div className="mineMain-title">
                    <h2>个人信息</h2>
                </div>
                <div className="personal-information">
                    <div className="content">
                        <div style={{padding: '1rem'}}>
                            <h2>杨季</h2>
                            <p>Tip: 再忙，也要记得吃饭哟~</p>
                        </div>
                    </div>
                    <div className="avatar">
                        <img src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1572349718179&di=443062dddb6ff6aa4269dfbc0212608a&imgtype=0&src=http%3A%2F%2Fhbimg.b0.upaiyun.com%2Fef9978f541e23dca04f5658150ac06e79877fc709b33-NlsaW7_fw658" alt=""></img>
                    </div>
                </div>
            </div>
        );
    }
}
 
export default mineMain;
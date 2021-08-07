import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import App from './App';
import * as serviceWorker from './serviceWorker';
import Axios from "axios";
import {message} from 'antd'
import 'lib-flexible'
import FirstComponent from 'FirstComponent';
// if(process.env.NODE_ENV ==="production") console.log=()=>{}
Axios.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
Axios.defaults.timeout = 5000;
Axios.interceptors.response.use(response =>{
    return response
})
message.config({
    top: 10,
    maxCount:3
})
function listen () {
    if (document.readyState === 'complete') { // 资源加载完成
        ReactDOM.render(<App />, document.getElementById('root'));
    } else { // 资源加载中
        ReactDOM.render(<FirstComponent/>, document.getElementById('root'));
    }
}
document.onreadystatechange = listen

serviceWorker.unregister();

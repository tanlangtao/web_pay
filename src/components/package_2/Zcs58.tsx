/*活动组件*/
import React from 'react'
import {gHandler} from '../../lib/gHandler'
import { Api } from '../../lib/Api';
import Axios from 'axios';
import {message, Button} from 'antd';
import "./Zcs58.scss";
import {ConfigItem} from '../../interface/activity_interface';
interface Props {
    curData:ConfigItem
}
interface State {
}
export default class Zcs58 extends React.Component<Props,State>{
    state = {
    }
    render (){
        return (
            <div className ="Zcs58" >
            </div>
        )
    }
}
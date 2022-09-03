/*活动组件*/
import React from 'react'
import {gHandler} from '../../lib/gHandler'
import { Api } from '../../lib/Api';
import Axios from 'axios';
import {message, Button} from 'antd';
import "./Wrnn.scss";
import {ConfigItem} from '../../interface/activity_interface';
interface Props {
    curData:ConfigItem
}
interface State {
    info:any,
    pay_amount_byday:number,
    is_received:number,
    btnActive :boolean,
    applyBtnInteractable : boolean,
    is_apply : boolean
}
export default class Wrnn extends React.Component<Props,State>{
    componentDidMount(){
        // console.log("123")
    }
    render (){
        return (
            <div className ={`${!gHandler.getDeviceisIphone() && gHandler.UrlData.client == "h5"?"Wrnnh5":"Wrnn"}`} >
            </div>
        )
    }
}
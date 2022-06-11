/*活动组件*/
import React from 'react'
import {gHandler} from '../../lib/gHandler'
import { Api } from '../../lib/Api';
import Axios from 'axios';
import {message, Button} from 'antd';
import "./DailySign.scss";
import {ConfigItem} from '../../interface/activity_interface';
interface Props {
    curData:ConfigItem
}
interface State {
    info:any,
    showGuize:Boolean,
    flagData:any
}
export default class DailySign19 extends React.Component<Props,State>{
    state = {
        info:{
            flow_rate:0,
            range:[
                {
                    bonus:0, //每日免费礼金  第1次可领取金额
                    bet:0, //每日免费礼金   第1次 有效投注门槛  以此类推
                }
            ]
        },
        flagData:{
            check_receive:false,
            day:0,
            is_received:0
        },
        showGuize:false,
    }
    componentDidMount(){
        this.setState({
            info:this.props.curData.info
        })
        console.log(this.state.info,this.props.curData)
        this.Axios_getFreeGoldFlag()
    }
    componentWillUnmount(){
        this.setState = (state,callback)=>{
            return
        }
    }
    onClick =(e:any)=>{
        this.Axios_receiveFreeGoldByDay()
        //阻止冒泡
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();
    }
    tipClick =(e:any)=>{
        message.info("您不符合领取资格!")
    }
    guizeClick = ()=>{
        this.setState({
            showGuize:!this.state.showGuize
        })
    }
    private async  Axios_getFreeGoldFlag(){
        let url = `${gHandler.UrlData.host}${Api.getFreeGoldFlag}?user_id=${gHandler.UrlData.user_id}&activity_id=${this.props.curData.id}&package_id=${gHandler.UrlData.package_id}&token=${gHandler.token}&center_auth=${gHandler.UrlData.center_auth}`;
        let response = await Axios.get(url).then(response=>{
            return response.data
        }).catch(err=>{
            return message.error("failed to load response data")
        })
        if(response.status === 0){
            this.setState({
                flagData:response.data
            })
        }else{
            message.error(response.msg)
        }
    }
    //领取
    private async Axios_receiveFreeGoldByDay(){
        let url = `${gHandler.UrlData.host}${Api.receiveFreeGoldByDay}`;
        let data = new FormData();
        data.append('user_id',gHandler.UrlData.user_id);
        data.append('user_name',decodeURI(gHandler.UrlData.user_name));
        data.append('package_id',gHandler.UrlData.package_id);
        data.append('activity_id',this.props.curData.id);
        data.append('login_ip',gHandler.UrlData.login_ip?gHandler.UrlData.login_ip:gHandler.UrlData.regin_ip);
        data.append('regin_ip',gHandler.UrlData.regin_ip);
        data.append('device_id',gHandler.UrlData.device_id);
        data.append('center_auth',gHandler.UrlData.center_auth);
        data.append('token',gHandler.token);
        let response = await Axios.post(url,data).then(response=>{
            return response.data;
        }).catch(err=>{
            return message.error("failed to load response data")
        })
        if(response.status === 0){
            message.success('领取成功！');
            this.Axios_getFreeGoldFlag()
        }else{
            message.error(response.msg)
        }
    }
    render (){
        let flagData = this.state.flagData
        let rangeLine = ()=>{
            return  this.state.info.range.map((e:any,index:number) => {
                if(index<7){
                    return <div className ={`li1 flexBox `}  key={index} onClick={this.tipClick}>
                        <div className={`icon icon${index+1}`}>
                            {
                                flagData.check_receive && flagData.day===index ?
                                    (flagData.is_received === 0 ?<div className ="lingqu" onClick={this.onClick}><div className="waitToCheck"></div></div>:
                                        <div className="yilingqu"><div className="checkMask"></div></div>):
                                    (index < flagData.day?<div className="yilingqu"><div className="checkMask"></div></div>:null)
                            }
                        </div>
                        
                    </div>
                }else{
                    return null
                }
            })
        }
        return (
            <div className ="DailySign19" >
                <div className = "group">
                    {
                        rangeLine()
                        
                    }
                </div>
                <div className="guizeBtn" onClick={this.guizeClick}>
                    {
                        this.state.showGuize ?<div className="guizeMask">
                            
                        </div>:null
                    }
                </div>
            </div>
        )
    }
}
/*活动组件*/
import React from 'react'
import {gHandler} from '../../lib/gHandler'
import { Api } from '../../lib/Api';
import Axios from 'axios';
import {message, Button} from 'antd';
import "./DailyActivity.scss";
import {ConfigItem} from '../../interface/activity_interface';
interface Props {
    curData:ConfigItem
}
interface State {
    info:any,
    received_index:Array<number>,
}
export default class DailyActivity extends React.Component<Props,State>{
    state = {
        info:{
            flow_rate:0,
            game:{
                "5b1f3a3cb76a591e7f25170":{
                    "101":{
                        rounds:0,
                        integral:0
                    }
                }
            }
        },
        received_index:[0],
    }
    btnIndex= 0 
    
    componentDidMount(){
        this.setState({
            info:this.props.curData.info
        })
        console.log(this.state.info,this.props.curData)
        this.Axios_getSignWeekInfo()
    }
    componentWillUnmount(){
        this.setState = (state,callback)=>{
            return
        }
    }
    onClick =(e:any)=>{
        this.Axios_signInByWeek()
    }
    private async  Axios_getSignWeekInfo(){
        let url = `${gHandler.UrlData.host}${Api.getSignWeekInfo}?user_id=${gHandler.UrlData.user_id}&activity_id=${this.props.curData.id}&package_id=${gHandler.UrlData.package_id}&token=${gHandler.token}&center_auth=${gHandler.UrlData.center_auth}`;
        let response = await Axios.get(url).then(response=>{
            return response.data
        }).catch(err=>{
            return message.error("failed to load response data")
        })
        if(response.status === 0){
            
        }else{
            message.error(response.msg)
        }
    }
    //领取
    private async Axios_signInByWeek(){
        let url = `${gHandler.UrlData.host}${Api.signInByWeek}`;
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
            this.Axios_getSignWeekInfo()
        }else{
            message.error(response.msg)
        }
    }
    render (){
        
        let rangeLine = ()=>{
            // this.state.info.sign_conf.map((e:any,index:number) => {
            //     if(index<6){
            //         return <div className ="li1 flexBox" key={index} onClick={this.onClick}>
            //             <div className="font flexBox">第{e.sign_in}天</div>
            //             <div className={`icon icon${index+1} `}>
            //                 {
            //                     this.state.received_index.indexOf(index+1)>-1?<div className="icon yilingqu"></div> :null
            //                 }
            //             </div>
            //             <div className="jifen flexBox">{e.integral}积分</div>
                        
            //         </div>
            //     }else{
            //         return null
            //     }
            // })
        }
        return (
            <div className ="DailyActivity" style={{
                transform:`scale(${gHandler.getNodeScale()},${gHandler.getNodeScale()})`,
                marginLeft:gHandler.getLeftOff(),
                marginTop:gHandler.getTopOff()
            }}>
                <div className = "group">
                    
                </div>
            </div>
        )
    }
}
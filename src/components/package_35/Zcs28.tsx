/*活动组件*/
import React from 'react'
import {gHandler} from '../../lib/gHandler'
import { Api } from '../../lib/Api';
import Axios from 'axios';
import {message, Button} from 'antd';
import "./Zcs28.scss";
import {ConfigItem} from '../../interface/activity_interface';
interface Props {
    curData:ConfigItem
}
interface State {
    is_apply:boolean,
    can_receive:boolean,
}
export default class Zcs28 extends React.Component<Props,State>{
    state = {
        is_apply:false,
        can_receive:false,
    }
    btnIndex= 0 
    componentDidMount(){
        this.Axios_reqlist28Gold()
        
        this.setState({
            can_receive:this.getLocal()
        })
    }
    componentWillUnmount(){
        this.setState = (state,callback)=>{
            return
        }
    }
    onClick =(e:any)=>{
        this.Axios_reqreceive28Gold()
    }
    private async Axios_reqreceive28Gold(){
        let url = `${gHandler.UrlData.host}${Api.reqreceive28Gold}`;
        let data = new FormData();
        data.append('user_id',gHandler.UrlData.user_id);
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
            this.setLocal()
            this.setState({
                can_receive:false
            })
        }else{
            message.error(response.msg)
        }
    }
   
    private async  Axios_reqlist28Gold(){
        let url = `${gHandler.UrlData.host}${Api.reqlist28Gold}`;
        let data = new FormData();
        data.append('user_id',gHandler.UrlData.user_id);
        data.append('package_id',gHandler.UrlData.package_id);
        data.append('activity_id',this.props.curData.id);
        data.append('center_auth',gHandler.UrlData.center_auth);
        data.append('token',gHandler.token);
        let response = await Axios.post(url,data).then(response=>{
            return response.data;
        }).catch(err=>{
            return message.error("failed to load response data")
        })
        if(response.status === 0){
            response.data.forEach((e:any)=>{
                for (var k in e){
                    if(e.activity_id == this.props.curData.id){
                        this.setState({
                            is_apply:true
                        })
                        console.log("is_apply",true)
                    }
                }
            })
        }else{
            message.error(response.msg)
        }
    }
    render (){
        return (
            <div className ="Zcs28" >
                {
                    this.state.is_apply && this.state.can_receive? 
                        <div 
                            onClick={this.onClick}
                            className= "Btn linqu">
                        </div> :
                        <div 
                            className ="Btn Ylinqu"
                            // onClick={()=>{
                            //     if(!this.state.is_apply){
                            //         return message.info("未申请无法领取")
                            //     }else if(!this.state.can_receive){
                            //         return message.info("已领取过不能重复领取")
                            //     }
                            // }}
                        >
                        </div>
                }
            </div>
        )
    }
    getLocal(){
        let local = localStorage.getItem(`Zcs28_${gHandler.UrlData.user_id}`)
        if(local){
            return false
        }else{
            return true
        }
    }
    setLocal(){
        localStorage.setItem(`Zcs28_${gHandler.UrlData.user_id}`,JSON.stringify(true))
    }
}
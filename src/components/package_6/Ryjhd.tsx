/*活动组件*/
import React from 'react'
import {gHandler} from '../../lib/gHandler'
import { Api } from '../../lib/Api';
import Axios from 'axios';
import {message, Button} from 'antd';
import "./Ryjhd.scss";
import {ConfigItem} from '../../interface/activity_interface';
interface Props {
    curData:ConfigItem
}
interface State {
    info:any,
    PerformanceInfo:any,
    is_received:boolean,
    btnActive :boolean,
}
export default class Ryjhd6 extends React.Component<Props,State>{
    state = {
        info:{
            range:[{
                performance:0,
                gold:0,
                grant:0
            }]
        },
        PerformanceInfo:{
            amount:0,
            monday:0,
            grant:0,
            received_info:[{
                receive_amount:0
            }]
        },
        is_received:false,
        btnActive :false,
    }
    btnIndex= 0 
    componentDidMount(){
        this.setState({
            info:this.props.curData.info
        })
        this.Axios_getReceivePerformanceInfo()
    }
    renderBtn(){
        if(this.state.info.range[0].performance !==0 ){
            this.state.info.range.forEach((item,index)=>{
                if(index < 6 &&  this.state.PerformanceInfo.amount >=item.performance && this.state.PerformanceInfo.grant >=item.grant) {
                    this.btnIndex = index
                    this.setState({
                        btnActive:true
                    })
                }
            })
        }
        if(this.state.PerformanceInfo.received_info && this.state.PerformanceInfo.received_info[0].receive_amount> 0){
            this.state.PerformanceInfo.received_info.forEach((e)=>{
                this.state.info.range.forEach((item,index)=>{
                    if(e.receive_amount === item.gold){
                        this.setState({
                            is_received:true
                        })
                    }
                })
            })
        }
    }
    componentWillUnmount(){
        this.setState = (state,callback)=>{
            return
        }
    }
    onClick =(e:any)=>{
        this.Axios_receivePerformanceGold()
    }
    private async Axios_receivePerformanceGold(){
        let url = `${gHandler.UrlData.host}${Api.receivePerformanceGold}`;
        let data = new FormData();
        data.append('user_id',gHandler.UrlData.user_id);
        data.append('index',`${this.btnIndex}`);
        data.append('source',"1");
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
            message.success('申请成功！');
            this.Axios_getReceivePerformanceInfo();
        }else{
            message.error(response.msg)
        }
    }
    private async  Axios_getReceivePerformanceInfo(){
        let url = `${gHandler.UrlData.host}${Api.getReceivePerformanceInfo}?user_id=${gHandler.UrlData.user_id}&activity_id=${this.props.curData.id}&source=1&token=${gHandler.token}&center_auth=${gHandler.UrlData.center_auth}`;
        let response = await Axios.get(url).then(response=>{
            return response.data
        }).catch(err=>{
            return message.error("failed to load response data")
        })
        if(response.status === 0){
            this.setState({
                PerformanceInfo:response.data
            },()=>{
                this.renderBtn()
            })
        }else{
            message.error(response.msg)
        }
    }
    render (){
        let rangeLine = ()=>{
            return  this.state.info.range.map((e:any,index:number) => {
                return <div className ="line" key={index}>
                    <div className ="li1 flexBox">{e.performance}</div>
                    <div className ="li2 flexBox">{e.grant}</div>
                    <div className ="li3 flexBox">{e.gold}</div>
                    <div className ="li4 flexBox"> 
                        {
                            this.state.btnActive && this.btnIndex === index ?<div className = { this.state.is_received ? `btn_Ylinqu`:"btn_linqu" } data-index={index} 
                                onClick={this.onClick}
                            ></div> :null
                        }
                    </div>
                </div>
            })
        }
        return (
            <div className ="Ryjhd6" >
                <div className = "group">
                    <div className ="line">
                        <div className ="li1 flexBox" style={{color:"#E8B56F"}}>团队周业绩</div>
                        <div className ="li2 flexBox" style={{color:"#E8B56F"}}>我的返佣</div>
                        <div className ="li3 flexBox" style={{color:"#E8B56F"}}>扶持彩金</div>
                    </div>
                    {
                        rangeLine()
                    }
                </div>
                <div className = "rule">
                    <p>1. 玩家需要绑定手机号和银行卡才能参与。</p>
                    <p>2. 统计规则：只统计棋牌类游戏+第三方电子类游戏的有效投注。</p>
                    <p>3. 玩家昨日团队业绩和我的返佣均达标可前往活动界面进行领取彩金。</p>
                    <p>4. 领取时间： 每天12:00:00-23:59:59， 逾期未领取视为自动放弃。</p>
                    <p>5. 同一用户（同IP同设备视为同一用户）仅限参加一次活动，活动彩金可直接申请兑换。</p>
                    <p>6. 平台拥有最终解释权，严禁一切恶意行为，出现违规情况，一律封号处理；同时平台有权根据实际情况，随时调整活动内容。</p>
                </div>
            </div>
        )
    }
}
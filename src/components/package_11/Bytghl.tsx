/*活动组件*/
import React from 'react'
import {gHandler} from '../../lib/gHandler'
import { Api } from '../../lib/Api';
import Axios from 'axios';
import {message, Button} from 'antd';
import "./Bytghl.scss";
import {ConfigItem} from '../../interface/activity_interface';
interface Props {
    curData:ConfigItem
}
interface State {
    info:any,
    pay_amount_byday:number,
    is_received:number,
    btnActive :boolean,
    ReceiveFishInfo:any
}
export default class Bytghl extends React.Component<Props,State>{
    state = {
        info:{
            start:0,
            end:0,
            range:[
                {
                    bet:0,
                    gold:0
                }
            ],
            flow_rate:0
        },
        is_received:0,
        pay_amount_byday:0,
        btnActive :false,
        ReceiveFishInfo:{
            bet_amount:0,
            received_info:[{
                receive_amount:0
            }]
        }
    }
    btnIndex= 0 
    guanka =[
        "一",
        "二",
        "三",
        "四",
        "五",
        "六",
        "七",
        "八",
        "九",
    ]
    componentDidMount(){
        this.setState({
            info:this.props.curData.info
        },()=>{
            console.log(this.state.info)
        })
        this.Axios_getReceiveFishInfo()
    }
    renderBtn(){
        console.log(this.state.ReceiveFishInfo.bet_amount)
        if(this.state.ReceiveFishInfo.bet_amount>=0){
            this.state.info.range.forEach((item,index)=>{
                if(this.state.ReceiveFishInfo.bet_amount >= item.bet) {
                    this.btnIndex = index
                    this.setState({
                        btnActive : true
                    })
                }
            })
        }
        if(this.state.ReceiveFishInfo["received_info"]){
            this.state.ReceiveFishInfo.received_info.forEach((e)=>{
                this.state.info.range.forEach((item,index)=>{
                    if(e.receive_amount === item.gold){
                        this.setState({
                            is_received:1
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
        this.Axios_receiveFishPassGold()
    }
    private async Axios_receiveFishPassGold(){
        let url = `${gHandler.UrlData.host}${Api.receiveFishPassGold}`;
        let data = new FormData();
        data.append('user_id',gHandler.UrlData.user_id);
        data.append('user_name',decodeURI(gHandler.UrlData.user_name));
        data.append('index',`${this.btnIndex}`);
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
            this.Axios_getReceiveFishInfo();
        }else{
            message.error(response.msg)
        }
    }
    private async  Axios_getReceiveFishInfo(){
        let url = `${gHandler.UrlData.host}${Api.getReceiveFishInfo}?user_id=${gHandler.UrlData.user_id}&activity_id=${this.props.curData.id}&package_id=${gHandler.UrlData.package_id}&lottery=PTXFFC&token=${gHandler.token}&center_auth=${gHandler.UrlData.center_auth}`;
        let response = await Axios.get(url).then(response=>{
            return response.data
        }).catch(err=>{
            return message.error("failed to load response data")
        })
        if(response.status === 0){
            this.setState({
                ReceiveFishInfo:response.data
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
                    <div className ="li1 flexBox"></div>
                    <div className ="li2 flexBox">关卡{this.guanka[index]}</div>
                    <div className ="li3 flexBox">{e.bet}</div>
                    <div className ="li4 flexBox">{e.gold}</div>
                    <div className ="li5 flexBox"></div>
                    <div className ="li6 flexBox"> 
                        {
                            this.state.btnActive && this.btnIndex === index ?<div className = { this.state.is_received===1 ? `btn_Ylinqu`:"btn_linqu" } data-index={index} 
                                onClick={this.onClick}
                            ></div> :null
                        }
                    </div>
                </div>
            })
        }
        return (
            <div className ="Bytghl" >
                <div className = "group">
                    <div className="line">
                        <div className ="li1 flexBox" style={{color:"#E8B56F"}}>活动对象</div>
                        <div className ="li2 flexBox" style={{color:"#E8B56F"}}>关卡</div>
                        <div className ="li3 flexBox" style={{color:"#E8B56F"}}>有效投注</div>
                        <div className ="li4 flexBox" style={{color:"#E8B56F"}}>活动彩金</div>
                        <div className ="li5 flexBox" style={{color:"#E8B56F"}}>流水要求</div>
                    </div>
                    {
                        rangeLine()
                    }
                    <div className ="label1 ">全体玩家</div>
                    <div className ="label2 ">一倍流水</div>
                </div>
                <div className = "rule">
                    <p>1.玩家需要绑定手机号码和银行卡才能参与此活动。</p>
                    <p>2.游戏限制：仅限《疯狂漩涡》捕鱼游戏，玩家昨日游戏有效投注达标即可前往活动界面领取奖励。</p>
                    <p>3.领取时间：每天{gHandler.transitionTime(this.state.info.start)}-{gHandler.transitionTime(this.state.info.end)}，逾期未领取视为自动放弃。</p>
                    <p>4.同一用户（同IP同设备视为同一用户）仅限参加一次活动，活动彩金需要1倍流水方可申请兑换。</p>
                    <p>5. 平台拥有最终解释权，严禁一切恶意行为，出现违规情况，一律封号处理；同时平台有权根据实际情况，随时调整活动内容。</p>
                </div>
            </div>
        )
    }
    getLocal(){
        let local = localStorage.getItem(`ApplyLyhsc_${gHandler.UrlData.user_id}`)
        if(local){
            return false
        }else{
            return true
        }
    }
    setLocal(){
        localStorage.setItem(`ApplyLyhsc_${gHandler.UrlData.user_id}`,JSON.stringify(true))
    }
}
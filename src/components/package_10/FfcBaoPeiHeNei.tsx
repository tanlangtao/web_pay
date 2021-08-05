/*活动组件*/
import React from 'react'
import {gHandler} from '../../lib/gHandler'
import { Api } from '../../lib/Api';
import Axios from 'axios';
import {message, Button} from 'antd';
import "./FfcBaoPeiHeNei.scss";
import {ConfigItem} from '../../interface/activity_interface';
interface Props {
    curData:ConfigItem
}
interface State {
    info:any,
    lose_amount:number,
    is_received:number,
    btnActive :boolean,
    applyBtnInteractable : boolean,
    is_apply : boolean
}
export default class FfcBaoPeiHeNei extends React.Component<Props,State>{
    state = {
        info:{
            flow_rate:0,
            start:0,
            end:0,
            bet_max:0,
            bet_min:0,
            lose_range:[
                {
                    gold:0,
                    first_pay_max:0,
                    first_pay_min:0
                }
            ]
        },
        lose_amount:0,
        is_received:0,
        btnActive :false,
        applyBtnInteractable : true,
        is_apply : false
    }
    btnIndex= 0 
    
    componentDidMount(){
        this.setState({
            info:this.props.curData.info
        },()=>{
            this.ApplyBtnInit()
        })
        this.getLocal()
    }
    renderBtn(){
        if(this.state.is_received === 0 && this.state.lose_amount !==0){
            this.state.info.lose_range.forEach((item,index)=>{
                if(this.state.lose_amount >= item.first_pay_min) {
                    this.btnIndex = index
                    this.setState({
                        btnActive :true
                    })
                }
            })
        }
        // console.log("componentWillUpdate 结束 this.btnIndex",this.btnIndex,"this.btnActive",this.btnActive,"this.is_received",this.is_received)
    }
    componentWillUnmount(){
        this.setState = (state,callback)=>{
            return
        }
    }
    onClick =(e:any)=>{
        this.Axios_receiveRewardHeNei()
    }
    applyBtnonClick =()=>{
        if(this.state.applyBtnInteractable){
            this.Axios_applyHandleFFC()
        }else{
            message.info('未到开放时间！')
        }
    }
    
    private async  Axios_getRewardFFCFlag(){
        let url = `${gHandler.UrlData.host}${Api.getRewardFFCFlag}?user_id=${gHandler.UrlData.user_id}&activity_id=${this.props.curData.id}&package_id=${gHandler.UrlData.package_id}&lottery=HNFFC&token=${gHandler.token}&center_auth=${gHandler.UrlData.center_auth}`;
        let response = await Axios.get(url).then(response=>{
            return response.data
        }).catch(err=>{
            return message.error("failed to load response data")
        })
        if(response.status === 0){
            this.setState({
                is_received:response.data.is_received,
                lose_amount:response.data.lose_amount
            },()=>{
                this.renderBtn()
            })
            this.setLocal()
        }else{
            message.error(response.msg)
        }
    }
    //领取
    private async Axios_receiveRewardHeNei(){
        let url = `${gHandler.UrlData.host}${Api.receiveRewardHeNei}`;
        let data = new FormData();
        data.append('user_id',gHandler.UrlData.user_id);
        data.append('user_name',decodeURI(gHandler.UrlData.user_name));
        data.append('package_id',gHandler.UrlData.package_id);
        data.append('activity_id',this.props.curData.id);
        data.append('lottery',`HNFFC`);
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
            //手动将领取结果赋值为1
            this.setState({
                is_received :1
            },()=>{
                //缓存领取结果
                this.setLocal()
            })
        }else{
            message.error(response.msg)
        }
    }
    //确认申请
    private async Axios_applyHandleFFC(){
        let url = `${gHandler.UrlData.host}${Api.applyHandleFFC}`;
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
            message.success('申请成功！');
            this.setLocalApply()
            this.ApplyBtnInit()
        }else{
            message.error(response.msg)
        }
    }
    
    render (){
        console.log(this.state.info)
        let rangeLine = ()=>{
            return  this.state.info.lose_range.map((e:any,index:number) => {
                return <div className ="line" key={index}>
                    <div className ="li1 flexBox"></div>
                    <div className ="li2 flexBox"></div>
                    <div className ="li3 flexBox">{e.lose_min}-{e.lose_max}</div>
                    <div className ="li4 flexBox">{e.percent*100}%</div>
                    <div className ="li5 flexBox"></div>
                    <div className ="li6 flexBox"> 
                        {
                            this.state.btnActive && this.btnIndex === index ?<div className = { this.state.is_received=== 1 ? `btn_Ylinqu`:"btn_linqu" } data-index={index} 
                                onClick={this.onClick}
                            ></div> :null
                        }
                    </div>
                </div>
            })
        }
        return (
            <div className ="FfcBaoPeiHeNei" >
                <div className = "group">
                    <div className ="line">
                        <div className ="li1 flexBox" style={{color:"#4D5F95"}}>游戏局数</div>
                        <div className ="li2 flexBox" style={{color:"#4D5F95"}}>单局下注金额</div>
                        <div className ="li3 flexBox" style={{color:"#4D5F95"}}>净亏损区间</div>
                        <div className ="li4 flexBox" style={{color:"#4D5F95"}}>对应比例</div>
                        <div className ="li5 flexBox" style={{color:"#4D5F95"}}>流水要求</div>
                    </div>
                    {
                        rangeLine()
                    }
                    <div className ={ `applyBtn ${this.state.applyBtnInteractable ?"":"applyFilter"} ${this.state.is_apply?"applyFilter":''}`} onClick={()=>{
                        console.log("申请")
                        this.applyBtnonClick()
                    }}></div>
                    <div className ="applyBtnLabel">
                        <div className="flexBox">开放时间</div>
                        <div className="flexBox">{gHandler.transitionTime(this.state.info.start)}-{gHandler.transitionTime(this.state.info.end)}</div>
                    </div>
                </div>
                <div className = "rule">
                    <p>1. 新会员注册好账号，需先绑定好手机号码与银行卡后联系上级或进线客服进行申请，申请完毕后前往当前活动界面进行确认申请，确认申请开放时间： 每天{gHandler.transitionTime(this.state.info.start)}-{gHandler.transitionTime(this.state.info.end)}。<span style={{color:"#ff0000"}}>所有未进行确认申请的玩家无法领取活动彩金。</span></p>
                    <p>2. 平台中的新玩家活动只能参加其中一个。</p>
                    <p>3. <span style={{color:"#F3DC5B"}}>活动限制：仅限分分彩猜大小-奇趣分分彩房间，单局下注仅限一个区域（大或小），不能投注豹子，进行其他游戏视为放弃此活动。</span></p>
                    <p>4. <span style={{color:"#F3DC5B"}}>在规定游戏中连续下注10局且单局下注金额为{this.state.info.bet_min}~{this.state.info.bet_max}金币，依照累计产生的净亏损前往本活动界面领取活动彩金。</span></p>
                    <p>5. 同一用户（同IP同设备视为同一用户）仅限参加一次活动，活动彩金需1倍流水方可申请兑换。</p>
                    <p>6. 平台拥有最终解释权，严禁一切恶意行为，出现违规情况，一律封号处理；同时平台有权根据实际情况，随时调整活动内容。</p>
                </div>
            </div>
        )
    }
    ApplyBtnInit(){
        let h = new Date().getHours()
        if(this.getLocalApply()){
            if(h < this.state.info.start || h >= this.state.info.end){
                this.setState({
                    applyBtnInteractable:false
                })
            }else{
                this.setState({
                    applyBtnInteractable:true
                })
            }
            this.setState({
                is_apply:false
            })
        }else{
            this.setState({
                is_apply:true
            })
        }
    }
    getLocalApply(){
        let local = localStorage.getItem(`ApplyFfcBaoPeiHeNei_${gHandler.UrlData.user_id}`)
        if(local){
            return false
        }else{
            return true
        }
    }
    setLocalApply(){
        localStorage.setItem(`ApplyFfcBaoPeiHeNei_${gHandler.UrlData.user_id}`,`${true}`)            
    }
    setLocal(){
        let time = new Date().getTime()/1000
        let RewardFFCFlag = {
            time:time,
            lose_amount:this.state.lose_amount,
            is_received:this.state.is_received
        }
        localStorage.setItem(`RewardFFCFlag_${gHandler.UrlData.user_id}`,JSON.stringify(RewardFFCFlag))
    }
    getLocal(){
        let newTime = new Date().getTime()/1000
        let localFristPayAmount :any= localStorage.getItem(`RewardFFCFlag_${gHandler.UrlData.user_id}`)
        if (localFristPayAmount && JSON.parse(localFristPayAmount).frist_pay_amount >0 && (newTime-JSON.parse(localFristPayAmount).time ) < 3600){
            this.setState({
                is_received:JSON.parse(localFristPayAmount).is_received,
                lose_amount:JSON.parse(localFristPayAmount).lose_amount
            },()=>{
                this.renderBtn()
            })
        }else{
            this.Axios_getRewardFFCFlag()
        }
    }
}
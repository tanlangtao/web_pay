/*活动组件*/
import React from 'react'
import {gHandler} from '../../lib/gHandler'
import { Api } from '../../lib/Api';
import Axios from 'axios';
import {message, Button} from 'antd';
import "./FfcBpQiQu.scss";
import {ConfigItem} from '../../interface/activity_interface';
interface Props {
    curData:ConfigItem
}
interface State {
    info:any,
    is_received:string,
    lose_amount:Number,
    btnActive :boolean,
    applyBtnInteractable : boolean,
    is_apply :boolean,
}
export default class FfcBpQiQu extends React.Component<Props,State>{
    state = {
        info:{
            bet_max:0,
            bet_min:0,
            start:0,
            end:0,
            round:0,
            flow_rate:0,
            lose_range:[{
                lose_max:0,
                lose_min:0,
                percent:0
            }]
        },
        lose_amount:0,
        is_received:"0",
        btnActive :false,
        applyBtnInteractable : true,
        is_apply :false,
    }
    btnIndex= 0 
    
    componentDidMount(){
        this.setState({
            info:this.props.curData.info
        },()=>{
            this.ApplyBtnInit()
        })
        this.Axios_getRewardFFCFlag()
    }
    renderBtn(){
        if(this.state.lose_amount!==0){
            this.state.info.lose_range.forEach((item,index)=>{
                if(this.state.lose_amount >= item.lose_min && this.state.lose_amount < item.lose_max) {
                    this.btnIndex = index
                    this.setState({
                        btnActive:true
                    })
                }
            })
        }
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
            this.Axios_onapplyHandleFFC()
        }else{
            message.info('未到开放时间！')
        }
    }
    private async Axios_receiveRewardHeNei(){
        let url = `${gHandler.UrlData.host}${Api.receiveRewardHeNei}`;
        let data = new FormData();
        data.append('user_id',gHandler.UrlData.user_id);
        data.append('user_name',decodeURI(gHandler.UrlData.user_name));
        data.append('lottery',"PTXFFC");
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
            this.Axios_getRewardFFCFlag();
        }else{
            message.error(response.msg)
        }
    }
    //确认申请
    private async Axios_onapplyHandleFFC(){
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
            //缓存申请结果
            this.setLocal()
            this.ApplyBtnInit()
        }else{
            message.error(response.msg)
        }
    }
    private async  Axios_getRewardFFCFlag(){
        let url = `${gHandler.UrlData.host}${Api.getRewardFFCFlag}?user_id=${gHandler.UrlData.user_id}&activity_id=${this.props.curData.id}&package_id=${gHandler.UrlData.package_id}&lottery=PTXFFC&token=${gHandler.token}&center_auth=${gHandler.UrlData.center_auth}`;
        let response = await Axios.get(url).then(response=>{
            return response.data
        }).catch(err=>{
            return message.error("failed to load response data")
        })
        if(response.status === 0){
            this.setState({
                lose_amount:response.data.amount,
                is_received:response.data.is_received
            },()=>{
                this.renderBtn()
            })
        }else{
            message.error(response.msg)
        }
    }
    render (){
        let rangeLine = ()=>{
            return  this.state.info.lose_range.map((e:any,index:number) => {
                return <div className ="line" key={index}>
                    <div className ="li1 flexBox"></div>
                    <div className ="li2 flexBox"></div>
                    <div className ="li3 flexBox"></div>
                    <div className ="li4 flexBox">{e.lose_min}~{e.lose_max}</div>
                    <div className ="li5 flexBox">{parseInt(`${e.percent*100}`)}%</div>
                    <div className ="li6 flexBox"></div>
                    <div className ="li7 flexBox"> 
                        {
                            this.state.btnActive && this.btnIndex === index ?<div className = { this.state.is_received==="1" ? `btn_Ylinqu`:"btn_linqu" } data-index={index} 
                                onClick={this.onClick}
                            ></div> :null
                        }
                    </div>
                </div>
            })
        }
        return (
            <div className ="FfcBaopei_QiQu" >
                <div className = "group">
                    <div className ="line">
                        <div className ="li1 flexBox" style={{color:"#E8B56F"}}>游戏房间</div>
                        <div className ="li2 flexBox" style={{color:"#E8B56F"}}>游戏局数</div>
                        <div className ="li3 flexBox" style={{color:"#E8B56F"}}>单局可下注金额</div>
                        <div className ="li4 flexBox" style={{color:"#E8B56F"}}>净亏损区间</div>
                        <div className ="li5 flexBox" style={{color:"#E8B56F"}}>对应比例</div>
                        <div className ="li6 flexBox" style={{color:"#E8B56F"}}>流水要求</div>
                    </div>
                    {
                        rangeLine()
                    }
                    <div className ="label1">分分彩猜大小奇趣分分彩</div>
                    <div className ="label2">连续{this.state.info.round}局</div>
                    <div className ="label3">{this.state.info.bet_min}-{this.state.info.bet_max}</div>
                    <div className ="label4">彩金{this.state.info.flow_rate}倍流水</div>
                    <div className ={ `applyBtn ${this.state.applyBtnInteractable ?"":"applyFilter"} ${this.state.is_apply?"applyYlingqu":''}`} onClick={()=>{
                        console.log("申请")
                        this.applyBtnonClick()
                    }}></div>
                    <div className ="applyBtnLabel">
                        <div className="flexBox">开放时间</div>
                        <div className="flexBox">{gHandler.transitionTime(this.state.info.start)}-{gHandler.transitionTime(this.state.info.end)}</div>
                    </div>
                </div>
                <div className = "rule">
                    <p>1. 新注册玩家完成手机以及银行卡绑定后前往当前活动进行申请， 申请开放时间为每天{gHandler.transitionTime(this.state.info.start)}-{gHandler.transitionTime(this.state.info.end)}。</p>
                    <p>所有未进行申请的玩家无法领取活动彩金。</p>
                    <p>2. 平台中的新玩家活动只能参加其中一个，申请后即视为参加此活动。</p>
                    <p>3. 活动限制：仅限分分彩猜大小-奇趣分分彩房间，单局下注仅限一个区域（大或小），不能投注豹子，进行其他游戏视为放弃此活动。</p>
                    <p>4. 在规定游戏中连续下注{this.state.info.round}局且单局下注金额为{this.state.info.bet_min}~{this.state.info.bet_max}金币，依照累计产生的净亏损前往本活动界面领取活动彩金。</p>
                    <p>5. 同一用户（同IP同设备视为同一用户）仅限参加一次活动，活动彩金需{this.state.info.flow_rate}倍流水方可申请兑换。</p>
                    <p>6. 平台拥有最终解释权，严禁一切恶意行为，出现违规情况，一律封号处理；同时平台有权根据实际情况，随时调整活动内容。</p>
                </div>
            </div>
        )
    }
    ApplyBtnInit(){
        let h = new Date().getHours()
        if(this.getLocal()){
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
    getLocal(){
        let local = localStorage.getItem(`ApplyFfcBaoPei_QiQu_${gHandler.UrlData.user_id}`)
        if(local){
            return false
        }else{
            return true
        }
    }
    setLocal(){
        localStorage.setItem(`ApplyFfcBaoPei_QiQu_${gHandler.UrlData.user_id}`,JSON.stringify(true))
    }
}
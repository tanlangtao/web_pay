/*活动组件*/
import React from 'react'
import {gHandler} from '../../lib/gHandler'
import { Api } from '../../lib/Api';
import Axios from 'axios';
import {message, Button} from 'antd';
import "./Xyhschd.scss";
import {ConfigItem} from '../../interface/activity_interface';
interface Props {
    curData:ConfigItem
}
interface State {
    info:any,
    frist_pay_amount:number,
    is_received:number,
    btnActive :boolean,
    applyBtnInteractable : boolean,
    is_apply : boolean,
    showGuize:Boolean
}
export default class Xyhschd19 extends React.Component<Props,State>{
    state = {
        info:{
            flow_rate:0,
            start:0,
            end:0,
            range:[
                {
                    bonus:0,
                    flow_rate:0,
                    recharge_amount:0
                }
            ]
        },
        is_received:0,
        btnActive :false,
        frist_pay_amount:0,
        applyBtnInteractable : true,
        is_apply : false,
        showGuize:false
    }
    btnIndex= 0 
    componentDidMount(){
        this.setState({
            info:this.props.curData.info
        },()=>{
            this.ApplyBtnInit()
        })
        this.Axios_getFristPayAmount()
    }
    renderBtn(){
        if(this.state.frist_pay_amount !==0){
            this.state.info.range.forEach((item,index)=>{
                if(this.state.frist_pay_amount >= item.recharge_amount) {
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
        this.Axios_receiveFristPayGold()
    }
    guizeClick = ()=>{
        this.setState({
            showGuize:!this.state.showGuize
        })
    }
    applyBtnonClick =()=>{
        if(this.state.applyBtnInteractable){
            this.Axios_applyFristPay()
        }else{
            message.info('未到开放时间！')
        }
    }
    private async Axios_receiveFristPayGold(){
        let url = `${gHandler.UrlData.host}${Api.receiveFristPayGold}`;
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
            this.Axios_getFristPayAmount();
        }else{
            message.error(response.msg)
        }
    }
    //确认申请
    private async Axios_applyFristPay(){
        let url = `${gHandler.UrlData.host}${Api.applyFristPay}`;
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
    private async  Axios_getFristPayAmount(){
        let url = `${gHandler.UrlData.host}${Api.getFristPayAmount}?user_id=${gHandler.UrlData.user_id}&activity_id=${this.props.curData.id}&package_id=${gHandler.UrlData.package_id}&lottery=PTXFFC&token=${gHandler.token}&center_auth=${gHandler.UrlData.center_auth}`;
        let response = await Axios.get(url).then(response=>{
            return response.data
        }).catch(err=>{
            return message.error("failed to load response data")
        })
        if(response.status === 0){
            this.setState({
                frist_pay_amount:response.data.frist_pay_amount,
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
            
            return  this.state.info.range.map((e:any,index:number) => {
                return <div className ="line" key={index}>
                    <div className ="li1 flexBox">{e.recharge_amount}</div>
                    <div className ="li2 flexBox">{e.bonus}</div>
                    <div className ="li3 flexBox"></div>
                    <div className ="li4 flexBox"> 
                        {
                            this.state.btnActive && this.btnIndex === index ?<div className = { this.state.is_received === 1 ? `btn_Ylinqu`:"btn_linqu" } data-index={index} 
                                onClick={this.onClick}
                            ></div> :null
                        }
                    </div>
                </div>
            })
        }
        return (
            <div className ="Xyhschd19" >
                <div className = "group">
                    <div className="line"> 
                       
                    </div>
                    {
                        rangeLine()
                    }
                    <div className ="label1 ">
                        <div className="flexBox">本金一倍+</div>
                        <div className="flexBox">彩金{this.state.info.flow_rate}倍流水</div>
                    </div>
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
                    
                </div>
                <div className="guizeBtn" onClick={this.guizeClick}>
                    {
                        this.state.showGuize ?<div className="guizeMask">
                            <p>1. 新注册玩家完成手机以及银行卡绑定后前往当前活动进行申请， 申请开放时间为每天{gHandler.transitionTime(this.state.info.start)}-{gHandler.transitionTime(this.state.info.end)}。所有未进行申请的玩家无法领取活动彩金。</p>
                            <p>2. 平台中的新用户活动只能参加一个。</p>
                            <p>3. 玩家必须充值成功未下注时进行领取，需满足首存金额一倍流水+赠送彩金的{this.state.info.flow_rate}倍流水才能申请兑换。</p>
                            <p>4. 游戏规则：仅参加以下游戏《财神到》《水果机》《捕鱼·海王》《捕鱼·聚宝盆》《多福多财》《疯狂旋涡》《PG电子游戏》《PG2电子游戏》《CQ9电子游戏》《JDB电子游戏》《AG电子游戏》《PT电子游戏》《PP电子游戏》。</p>
                            <p>5. 同一用户仅限领取一次，恶意套利者将封号处理。</p>
                            <p>6. 平台拥有最终解释权。</p>
                        </div>:null
                    }
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
            },()=>{
                console.log("is_apply",this.state.is_apply)
            })
        }else{
            this.setState({
                is_apply:true
            })
        }
    }
    getLocal(){
        let local = localStorage.getItem(`ApplyXyhschd_${gHandler.UrlData.user_id}`)
        if(local){
            return false
        }else{
            return true
        }
    }
    setLocal(){
        localStorage.setItem(`ApplyXyhschd_${gHandler.UrlData.user_id}`,JSON.stringify(true))
    }
}
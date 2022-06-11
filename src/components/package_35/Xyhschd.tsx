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
    first_pay_amount:number,
    is_received:number,
    receive:string,
    btnActive :boolean,
    applyBtnInteractable : boolean,
    is_apply : boolean,
    showGuize:Boolean
}
export default class Xyhschd35 extends React.Component<Props,State>{
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
        receive:"0",
        btnActive :false,
        first_pay_amount:0,
        applyBtnInteractable : true,
        is_apply : false,
        showGuize:false
    }
    btnIndex= 0 
    componentDidMount(){
        this.setState({
            info:this.props.curData.info
        })
        this.Axios_reqfristPaylist()
        this.Axios_reqfristPaystatus()
    }
    renderBtn(){
        if(this.state.first_pay_amount !==0){
            this.state.info.range.forEach((item,index)=>{
                if(this.state.first_pay_amount >= item.recharge_amount) {
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
        this.Axios_reqfristPayreceive()
    }
    guizeClick = ()=>{
        this.setState({
            showGuize:!this.state.showGuize
        })
    }
    applyBtnonClick =()=>{
        this.Axios_reqfristPayapply()
    }
    private async Axios_reqfristPayreceive(){
        let url = `${gHandler.UrlData.host}${Api.reqfristPayreceive}`;
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
            this.Axios_reqfristPaystatus();
        }else{
            message.error(response.msg)
        }
    }
    //确认申请
    private async Axios_reqfristPayapply(){
        let url = `${gHandler.UrlData.host}${Api.reqfristPayapply}`;
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
            message.success('申请成功！');
            //缓存申请结果
        }else{
            message.error(response.msg)
        }
    }
    
    private async  Axios_reqfristPaylist(){
        let url = `${gHandler.UrlData.host}${Api.reqfristPaylist}?user_id=${gHandler.UrlData.user_id}&activity_id=${this.props.curData.id}&package_id=${gHandler.UrlData.package_id}&token=${gHandler.token}&center_auth=${gHandler.UrlData.center_auth}`;
        let response = await Axios.get(url).then(response=>{
            return response.data
        }).catch(err=>{
            return message.error("failed to load response data")
        })
        if(response.status === 0){
            this.setState({
                is_apply:response.data.length > 0 ? true :false,
            })
        }else{
            message.error(response.msg)
        }
    }
    private async  Axios_reqfristPaystatus(){
        let url = `${gHandler.UrlData.host}${Api.reqfristPaystatus}?user_id=${gHandler.UrlData.user_id}&activity_id=${this.props.curData.id}&token=${gHandler.token}&center_auth=${gHandler.UrlData.center_auth}`;
        let response = await Axios.get(url).then(response=>{
            return response.data
        }).catch(err=>{
            return message.error("failed to load response data")
        })
        if(response.status === 0){
            this.setState({
                first_pay_amount:response.data.first_pay_amount,
                receive:response.data.receive,
            },()=>{
                this.renderBtn()
            })
        }else{
            message.error(response.msg)
        }
    }
    render (){
        let rangeLine = ()=>{
            
            return  this.state.info.range && this.state.info.range.map((e:any,index:number) => {
                return <div className ="line" key={index}>
                    <div className ="li1 flexBox">{e.recharge_amount}</div>
                    <div className ="li2 flexBox">{e.bonus}</div>
                    <div className ="li3 flexBox"></div>
                    <div className ="li4 flexBox"> 
                        {
                            this.state.btnActive && this.btnIndex === index ?<div className = { this.state.receive != "0" ? `btn_Ylinqu`:"btn_linqu" } data-index={index} 
                                onClick={this.onClick}
                            ></div> :null
                        }
                    </div>
                </div>
            })
        }
        return (
            <div className ="Xyhschd35" >
                <div className = "group">
                    {
                        rangeLine()
                    }
                    <div className ="label1"  >
                        <div className="flexBox">本金一倍+</div>
                        <div className="flexBox">彩金{this.state.info.flow_rate}倍流水</div>
                    </div>
                    <div className ={ `applyBtn ${this.state.is_apply?"applyYlingqu":''}`} onClick={()=>{
                        console.log("申请")
                        this.applyBtnonClick()
                    }}></div>
                </div>
                <div className = "rule">
                    
                </div>
                <div className="guizeBtn" onClick={this.guizeClick}>
                    {
                        this.state.showGuize ?<div className="guizeMask">
                            {/* <p>1. 新注册玩家完成手机以及银行卡绑定后前往当前活动进行申请， 申请开放时间为每天{gHandler.transitionTime(this.state.info.start)}-{gHandler.transitionTime(this.state.info.end)}。所有未进行申请的玩家无法领取活动彩金。</p>
                            <p>2. 平台中的新用户活动只能参加一个。</p>
                            <p>3. 玩家必须充值成功未下注时进行领取，需满足首充金额一倍流水+赠送彩金的{this.state.info.flow_rate}倍流水才能申请兑换。</p>
                            <p>4. 游戏规则：仅参加以下游戏《财神到》《水果机》《捕鱼·海王》《捕鱼·聚宝盆》《多福多财》《疯狂旋涡》《CQ9电子游戏》《PT电子游戏》《JDB电子游戏》《PG电子游戏》《PG2电子游戏》《AG电子游戏》《PP电子游戏》《MG电子游戏》。</p>
                            <p>5. 同一用户仅限领取一次，恶意套利者将封号处理。</p>
                            <p>6. 平台拥有最终解释权，严禁一切恶意行为，出现违规情况，一律封号处理；同时平台有权根据实际情况，随时调整活动内容。</p> */}
                        </div>:null
                    }
                </div>
            </div>
        )
    }
    setLocal(){
        localStorage.setItem(`ApplyXyhschd_${gHandler.UrlData.user_id}`,JSON.stringify(true))
    }
}
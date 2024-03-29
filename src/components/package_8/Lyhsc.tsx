/*活动组件*/
import React from 'react'
import {gHandler} from '../../lib/gHandler'
import { Api } from '../../lib/Api';
import Axios from 'axios';
import {message, Button} from 'antd';
import "./Lyhsc.scss";
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
    is_apply : boolean,
    showGuize: boolean
}
export default class Lyhsc8 extends React.Component<Props,State>{
    state = {
        info:{
            range:[
                {
                    bonus:0,
                    recharge_amount:0,
                    flow_rate:0
                }
            ],
            flow_rate:0
        },
        is_received:0,
        pay_amount_byday:0,
        btnActive :false,
        applyBtnInteractable : true,
        is_apply : false,
        showGuize:false,
    }
    btnIndex= 0 
    componentDidMount(){
        console.log(this.props.curData.info)
        this.setState({
            info:this.props.curData.info
        },()=>{
            console.log(this.state.info)
        })
        this.Axios_getPayBonusByDay()
    }
    renderBtn(){
        if( this.state.pay_amount_byday!==0){
            this.state.info.range.forEach((item,index)=>{
                if(this.state.pay_amount_byday >= item.recharge_amount) {
                    this.btnIndex = index
                    this.setState({
                        btnActive : true
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
        this.Axios_receivePayBonusGold()
    }
    applyBtnonClick =()=>{
        if(this.state.applyBtnInteractable){
        }else{
            message.info('未到开放时间！')
        }
    }
    guizeClick =()=>{
        this.setState({
            showGuize :!this.state.showGuize
        })
    }
    private async Axios_receivePayBonusGold(){
        let url = `${gHandler.UrlData.host}${Api.receivePayBonusGold}`;
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
            this.Axios_getPayBonusByDay();
        }else{
            message.error(response.msg)
        }
    }
    private async  Axios_getPayBonusByDay(){
        let url = `${gHandler.UrlData.host}${Api.getPayBonusByDay}?user_id=${gHandler.UrlData.user_id}&activity_id=${this.props.curData.id}&package_id=${gHandler.UrlData.package_id}&lottery=PTXFFC&token=${gHandler.token}&center_auth=${gHandler.UrlData.center_auth}`;
        let response = await Axios.get(url).then(response=>{
            return response.data
        }).catch(err=>{
            return message.error("failed to load response data")
        })
        if(response.status === 0){
            this.setState({
                pay_amount_byday:response.data.first_pay_amount_today,
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
                            this.state.btnActive && this.btnIndex === index ?<div className = { this.state.is_received===1 ? `btn_Ylinqu`:"btn_linqu" } data-index={index} 
                                onClick={this.onClick}
                            ></div> :null
                        }
                    </div>
                </div>
            })
        }
        return (
            <div className ="Lyhsc8" >
                <div className = "group">
                    <div className="line">
                        <div className ="li1 flexBox" style={{color:"rgb(209,182,144)"}}>充值金额</div>
                        <div className ="li2 flexBox" style={{color:"rgb(209,182,144)"}}>赠送金额</div>
                        <div className ="li3 flexBox" style={{color:"rgb(209,182,144)"}}>流水要求</div>
                    </div>
                    {
                        rangeLine()
                    }
                    <div className ="label1 ">
                        <div className="flexBox">本金1倍</div>
                        <div className="flexBox">彩金{this.state.info.flow_rate}倍流水</div>
                    </div>
                </div>
                <div className="guizeBtn" onClick={this.guizeClick}>
                    {
                        this.state.showGuize ?<div className="guizeMask">
                            <p>1. 本活动需要完成手机和银行卡绑定后才能参与。</p>
                            <p>2. 每日首笔充值金额达到对应档位，即可前往活动界面领取活动规定的相应金币。</p>
                            <p>3. 每日23:59:59，活动计算的当日充值金额累加归零。</p>
                            <p>4. 每一个账号（同一ip，同一设备，同一姓名视为一个账号）每天只能领取一次。</p>
                            <p>5. 平台拥有最终解释权，严禁一切恶意行为，出现违规情况，一律封号处理；同时平台有权根据实际情况，随时调整活动内容。</p>
                        </div>:null
                    }
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
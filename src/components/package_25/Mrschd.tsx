/*活动组件*/
import React from 'react'
import {gHandler} from '../../lib/gHandler'
import { Api } from '../../lib/Api';
import Axios from 'axios';
import {message, Button} from 'antd';
import "./Mrschd.scss";
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
    showGuize:Boolean,
}
export default class Mrschd25 extends React.Component<Props,State>{
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
        showGuize:false,
    }
    btnIndex= 0 
    componentDidMount(){
        this.setState({
            info:this.props.curData.info
        },()=>{
            this.ApplyBtnInit()
        })
        this.Axios_getDailyFirstPay()
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
        this.Axios_receiveDailyFirstPay()
    }
    guizeClick = ()=>{
        this.setState({
            showGuize:!this.state.showGuize
        })
    }
    private async Axios_receiveDailyFirstPay(){
        let url = `${gHandler.UrlData.host}${Api.receiveDailyFirstPay}`;
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
            this.Axios_getDailyFirstPay();
        }else{
            message.error(response.msg)
        }
    }
    private async  Axios_getDailyFirstPay(){
        let url = `${gHandler.UrlData.host}${Api.getDailyFirstPay}?user_id=${gHandler.UrlData.user_id}&activity_id=${this.props.curData.id}&token=${gHandler.token}&center_auth=${gHandler.UrlData.center_auth}`;
        let response = await Axios.get(url).then(response=>{
            return response.data
        }).catch(err=>{
            return message.error("failed to load response data")
        })
        if(response.status === 0){
            this.setState({
                frist_pay_amount:response.data.first_pay_amount_today,
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
            <div className ="Mrschd25" >
                <div className ="bg"></div>
                <div className = "group">
                    <div className ="line title" >
                        <div className ="li1 flexBox">充值金额</div>
                        <div className ="li2 flexBox">赠送彩金</div>
                        <div className ="li3 flexBox">流水要求</div>
                    </div>
                    {
                        rangeLine()
                    }
                    <div className ="label1 ">
                        <div className="flexBox">本金一倍+</div>
                        <div className="flexBox">彩金{this.state.info.flow_rate}倍流水</div>
                    </div>
                </div>
                <div className = "rule">
                    <p>1. 本活动需要完成手机和银行卡绑定后才能参与。</p>
                    <p>2. 游戏规则：仅参加以下游戏 《财神到》《水果机》《捕鱼 ‧ 海王》《捕鱼 ‧ 聚宝盆》《多福多财》《疯狂漩涡》《CQ9电子游戏》《PT电子游戏》《JDB电子游戏》《PG电子游戏》《PG2电子游戏》《AG电子游戏》《PP电子游戏》《MG电子游戏》《QT电子游戏》。</p>
                    <p>3. 单日首次充值金额(不累加计算充值金额)，达到指定档位，即可前往活动界面领取活动规定的相应金币。</p>
                    <p>4. 每日23:59:59，活动的当日充值金额重新计算。</p>
                    <p>5. 领取彩金后，进行规定外游戏，后续提交兑换订单时，系统将会自动扣除彩金部份。</p>
                    <p>6. 若当日23:59:59前没有领取礼金，则视同放弃领取资格。</p>
                    <p>7. 每一个账号（同一ip，同一设备，同一姓名视为一个账号）每天只能领取一次。</p>
                    <p>8. 平台拥有最终解释权，严禁一切恶意行为，出现违规情况，一律封号处理；同时平台有权根据实际情况，随时调整活动内容。</p>
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
        let local :any = localStorage.getItem(`ApplyXyhschd_${gHandler.UrlData.user_id}`) 
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
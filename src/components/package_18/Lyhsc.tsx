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
    is_apply : boolean
}
export default class Lyhsc18 extends React.Component<Props,State>{
    state = {
        info:{
            range:[
                {
                    bonus:0,
                    recharge_amount:0
                }
            ],
            flow_rate:0
        },
        is_received:0,
        pay_amount_byday:0,
        btnActive :false,
        applyBtnInteractable : true,
        is_apply : false
    }
    btnIndex= 0 
    componentDidMount(){
        this.setState({
            info:this.props.curData.info
        },()=>{
            console.log(this.state.info)
        })
        this.Axios_getPayAmountByDay()
    }
    renderBtn(){
        if(this.state.pay_amount_byday!==0){
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
        this.Axios_receivePaymentGold()
    }
    applyBtnonClick =()=>{
        if(this.state.applyBtnInteractable){
            this.Axios_applyFristPay()
        }else{
            message.info('未到开放时间！')
        }
    }
    private async Axios_receivePaymentGold(){
        let url = `${gHandler.UrlData.host}${Api.receivePaymentGold}`;
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
            this.Axios_getPayAmountByDay();
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
        }else{
            message.error(response.msg)
        }
    }
    private async  Axios_getPayAmountByDay(){
        let url = `${gHandler.UrlData.host}${Api.getPayAmountByDay}?user_id=${gHandler.UrlData.user_id}&activity_id=${this.props.curData.id}&package_id=${gHandler.UrlData.package_id}&lottery=PTXFFC&token=${gHandler.token}&center_auth=${gHandler.UrlData.center_auth}`;
        let response = await Axios.get(url).then(response=>{
            return response.data
        }).catch(err=>{
            return message.error("failed to load response data")
        })
        if(response.status === 0){
            this.setState({
                pay_amount_byday:response.data.pay_amount_byday,
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
            <div className ="Lyhsc18" >
                <div className = "group">
                    <div className="line">
                        <div className ="li1 flexBox" >充值金额</div>
                        <div className ="li2 flexBox" >赠送金额</div>
                        <div className ="li3 flexBox" >流水要求</div>
                    </div>
                    {
                        rangeLine()
                    }
                    <div className ="label1 ">
                        <div className="flexBox">本金1倍</div>
                        <div className="flexBox">彩金{this.state.info.flow_rate}倍流水</div>
                    </div>
                    {/* <div className ={ `applyBtn ${this.applyBtnInteractable ?"":"applyFilter"} ${this.is_apply?"applyYlingqu":''}`} onClick={()=>{
                        console.log("申请")
                        this.applyBtnonClick()
                    }}></div>
                    <div className ="applyBtnLabel">
                        <div className="flexBox">开放时间</div>
                        <div className="flexBox">{gHandler.transitionTime(this.state.info.start)}-{gHandler.transitionTime(this.state.info.end)}</div>
                    </div> */}
                </div>
                <div className = "rule">
                    <p>1.本活动需要完成手机和银行卡绑定后才能参与。</p>
                    <p>2.游戏规则：仅参加以下游戏《财神到》《水果机》《捕鱼·海王》《捕鱼·聚宝盆》《多福多财》《疯狂旋涡》《CQ9电子游戏》《AG电子游戏》《PT电子游戏》《JDB电子游戏》《PG电子游戏》</p>
                    <p>3.单日充值金额累加统计，单日累计充值金额达到指定档位，即可领取活动规定的相应金币。</p>
                    <p>4.每日23:59:59，活动计算的当日充值金额累加归零。</p>
                    <p>5.每一个账号（同一ip，同一设备，同一姓名视为一个账号）每天只能领取一次。</p>
                    <p>6.平台拥有最终解释权，严禁一切恶意行为，出现违规情况，一律封号处理；同时平台有权根据实际情况，随时调整活动内容。</p>
                </div>
            </div>
        )
    }
    // ApplyBtnInit(){
    //     let h = new Date().getHours()
    //     if(this.getLocal()){
    //         if(h < this.state.info.start || h >= this.state.info.end){
    //             this.setState({
    //                 applyBtnInteractable:false
    //             })
    //         }else{
    //             this.setState({
    //                 applyBtnInteractable:true
    //             })
    //         }
    //         this.setState({
    //             is_apply:false
    //         })
    //     }else{
    //         this.setState({
    //             is_apply:true
    //         })
    //     }
    // }
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
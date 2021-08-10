/*活动组件*/
import React from 'react'
import {gHandler} from '../../lib/gHandler'
import { Api } from '../../lib/Api';
import Axios from 'axios';
import {message, Button} from 'antd';
import "./Lyhbp.scss";
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
    is_apply : boolean
}
export default class Lyhbp extends React.Component<Props,State>{
    state = {
        info:{
            flow_rate:0,
            start:0,
            end:0,
            balance:0,
            conf:[
                {
                    gold:0,
                    first_pay_max:0,
                    first_pay_min:0
                }
            ]
        },
        frist_pay_amount:0,
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
        if(this.state.is_received === 0 && this.state.frist_pay_amount !==0){
            this.state.info.conf.forEach((item,index)=>{
                if(this.state.frist_pay_amount >= item.first_pay_min) {
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
        this.Axios_oldReimburse()
    }
    applyBtnonClick =()=>{
        if(this.state.applyBtnInteractable){
            this.Axios_oldUserApplyReimbursee()
        }else{
            message.info('未到开放时间！')
        }
    }
    
    private async  Axios_GetFristPayAmountByWeek(){
        let url = `${gHandler.UrlData.host}${Api.GetFristPayAmountByWeek}?user_id=${gHandler.UrlData.user_id}&activity_id=${this.props.curData.id}&package_id=${gHandler.UrlData.package_id}&token=${gHandler.token}&center_auth=${gHandler.UrlData.center_auth}`;
        let response = await Axios.get(url).then(response=>{
            return response.data
        }).catch(err=>{
            return message.error("failed to load response data")
        })
        if(response.status === 0){
            this.setState({
                is_received:response.data.is_received,
                frist_pay_amount:response.data.frist_pay_amount
            },()=>{
                this.renderBtn()
            })
            this.setLocal()
        }else{
            message.error(response.msg)
        }
    }
    //领取
    private async Axios_oldReimburse(){
        let url = `${gHandler.UrlData.host}${Api.oldReimburse}`;
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
    private async Axios_oldUserApplyReimbursee(){
        let url = `${gHandler.UrlData.host}${Api.oldUserApplyReimburse}`;
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
        console.log("render")
        let rangeLine = ()=>{
            return  this.state.info.conf.map((e:any,index:number) => {
                return <div className ="line" key={index}>
                    <div className ="li1 flexBox">{e.first_pay_min}</div>
                    <div className ="li2 flexBox">{e.gold}</div>
                    <div className ="li3 flexBox">{e.first_pay_min*2}</div>
                    <div className ="li4 flexBox">10</div>
                    <div className ="li5 flexBox"> 
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
            <div className ="Lyhbp" >
                <div className = "group">
                    <div className ="line">
                        <div className ="li1 flexBox" style={{color:"#E8B56F"}}>首充金额</div>
                        <div className ="li2 flexBox" style={{color:"#E8B56F"}}>包赔金额</div>
                        <div className ="li3 flexBox" style={{color:"#E8B56F"}}>最高兑换金额</div>
                        <div className ="li4 flexBox" style={{color:"#E8B56F"}}>限制最高注</div>
                    </div>
                    {
                        rangeLine()
                    }
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
                    <p>1. 老会员每周限制参加一次，绑定手机以及银行卡后前往当前活动进行申请，申请时间：每周五/周六{gHandler.transitionTime(this.state.info.start)}-{gHandler.transitionTime(this.state.info.end)}。</p>
                    <p>所有未进行申请的玩家无法领取活动彩金。</p>
                    <p>2. 参加活动的会员，只能进行指定游戏《财神到》《捕鱼·聚宝盆》游戏，进行其他游戏便视为放弃此活动。</p>
                    <p>3. 在规定游戏中投注对应档位最高单注金额内，亏损至余额低于10金币时即可前往本活动界面进行领取活动彩金。</p>
                    <p>4. 赢金到规定金额不兑换视为放弃包赔资格（输完不能赔付）。</p>
                    <p>5. 同一用户（同IP同设备视为同一用户）仅限参加一次活动，活动彩金无需流水限制</p>
                    <p>可直接申请兑换。</p>
                    <p>6.平台拥有最终解释权，严禁一切恶意行为，出现违规情况，一律封号处理；同时平台</p>
                    <p>有权根据活动情况随时调整活动内容。</p>
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
        let local = localStorage.getItem(`ApplyLyhBp_${gHandler.UrlData.user_id}`)
        if(local){
            return false
        }else{
            return true
        }
    }
    setLocalApply(){
        localStorage.setItem(`ApplyLyhBp_${gHandler.UrlData.user_id}`,`${true}`)            
    }
    setLocal(){
        let time = new Date().getTime()/1000
        let FristPayAmount = {
            time:time,
            frist_pay_amount:this.state.frist_pay_amount,
            is_received:this.state.is_received
        }
        localStorage.setItem(`oldUserFristPayAmount_${gHandler.UrlData.user_id}`,JSON.stringify(FristPayAmount))
    }
    getLocal(){
        let newTime = new Date().getTime()/1000
        let localFristPayAmount :any= localStorage.getItem(`oldUserFristPayAmount_${gHandler.UrlData.user_id}`)
        if (localFristPayAmount && JSON.parse(localFristPayAmount).frist_pay_amount >0 && (newTime-JSON.parse(localFristPayAmount).time ) < 3600){
            this.setState({
                is_received:JSON.parse(localFristPayAmount).is_received,
                frist_pay_amount:JSON.parse(localFristPayAmount).frist_pay_amount
            },()=>{
                this.renderBtn()
            })
        }else{
            this.Axios_GetFristPayAmountByWeek()
        }
    }
}
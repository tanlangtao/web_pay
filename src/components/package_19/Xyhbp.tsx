/*活动组件*/
import React from 'react'
import {gHandler} from '../../lib/gHandler'
import { Api } from '../../lib/Api';
import Axios from 'axios';
import {message, Button} from 'antd';
import "./Xyhbp.scss";
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
    showGuize:boolean
}
export default class Xyhbp19 extends React.Component<Props,State>{
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
            ],
            withdraw_conf:{
                condition:[{
                    max_withdraw_amount:0
                }]
            }
        },
        frist_pay_amount:0,
        is_received:0,
        btnActive :false,
        applyBtnInteractable : true,
        is_apply : false,
        showGuize:false
    }
    btnIndex= 0 
    
    componentDidMount(){
        console.log(this.props.curData.info)
        this.setState({
            info:this.props.curData.info
        },()=>{
            this.ApplyBtnInit()
        })
        this.getLocal()
    }
    renderBtn(){
        if(this.state.frist_pay_amount !==0){
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
        this.Axios_reimburse()
    }
    guizeClick = ()=>{
        this.setState({
            showGuize:!this.state.showGuize
        })
    }
    applyBtnonClick =()=>{
        if(this.state.applyBtnInteractable){
            this.Axios_applyReimburse()
        }else{
            message.info('未到开放时间！')
        }
    }
    
    private async  Axios_getFristPayAmount(){
        let url = `${gHandler.UrlData.host}${Api.getFristPayAmount}?user_id=${gHandler.UrlData.user_id}&activity_id=${this.props.curData.id}&package_id=${gHandler.UrlData.package_id}&token=${gHandler.token}&center_auth=${gHandler.UrlData.center_auth}`;
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
    private async Axios_reimburse(){
        let url = `${gHandler.UrlData.host}${Api.reimburse}`;
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
    private async Axios_applyReimburse(){
        let url = `${gHandler.UrlData.host}${Api.applyReimburse}`;
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
        let rangeLine = ()=>{
            return  this.state.info.conf.map((e:any,index:number) => {
                return <div className ="line" key={index}>
                    <div className ="li1 flexBox">{e.first_pay_min}</div>
                    <div className ="li2 flexBox">{e.gold}</div>
                    <div className ="li3 flexBox">{this.state.info.withdraw_conf.condition[index].max_withdraw_amount}</div>
                    <div className ="li4 flexBox">10</div>
                    <div className ="li5 flexBox"> 
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
            <div className ="Xyhbp19" >
                <div className = "group">
                    <div className ="line">
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
                    
                </div>
                <div className="guizeBtn" onClick={this.guizeClick}>
                    {
                        this.state.showGuize ?<div className="guizeMask">
                        </div>:null
                    }
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
        let local = localStorage.getItem(`ApplyXyhbp_${gHandler.UrlData.user_id}`)
        if(local){
            return false
        }else{
            return true
        }
    }
    setLocalApply(){
        localStorage.setItem(`ApplyXyhbp_${gHandler.UrlData.user_id}`,`${true}`)            
    }
    setLocal(){
        let time = new Date().getTime()/1000
        let FristPayAmount = {
            time:time,
            frist_pay_amount:this.state.frist_pay_amount,
            is_received:this.state.is_received
        }
        localStorage.setItem(`FristPayAmount_${gHandler.UrlData.user_id}`,JSON.stringify(FristPayAmount))
    }
    getLocal(){
        let newTime = new Date().getTime()/1000
        let localFristPayAmount :any= localStorage.getItem(`FristPayAmount_${gHandler.UrlData.user_id}`)
        if (localFristPayAmount && JSON.parse(localFristPayAmount).frist_pay_amount >0 && (newTime-JSON.parse(localFristPayAmount).time ) < 3600){
            this.setState({
                is_received:JSON.parse(localFristPayAmount).is_received,
                frist_pay_amount:JSON.parse(localFristPayAmount).frist_pay_amount
            },()=>{
                this.renderBtn()
            })
        }else{
            this.Axios_getFristPayAmount()
        }
    }
}
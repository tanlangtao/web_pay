/*活动组件*/
import React from 'react'
import {gHandler} from '../../lib/gHandler'
import { Api } from '../../lib/Api';
import Axios from 'axios';
import {message, Button} from 'antd';
import "./UsdtCunKuan.scss";
import {ConfigItem} from '../../interface/activity_interface';
interface Props {
    curData:ConfigItem
}
interface State {
    info:any,
    UsdtInfo:any,
    btn1Active :boolean,
    btn2Active :boolean,
    btn3Active :boolean,
    is_received1:boolean,
    is_received2:boolean,
    is_received3:boolean,
}
export default class UsdtCunKuan extends React.Component<Props,State>{
    state = {
        info:{
            range:[{
                recharge_num:0,
                bonus:0,
            }],
            usdt_amount:0,
            flow_rate:0
        },
        UsdtInfo:{
            num:0,
            received_info:[{
                receive_amount:0
            }]
        },
        btn1Active :false,
        btn2Active :false,
        btn3Active :false,
        is_received1: false,
        is_received2: false,
        is_received3:false,
    }
    btnIndex= 0 
   
    componentDidMount(){
        this.setState({
            info:this.props.curData.info
        })
        this.Axios_getRewardUsdtInfo()
    }
    renderBtn(){
        if(this.state.UsdtInfo.num !==0 ){
            this.state.info.range.forEach((item,index)=>{
                if(index < 3 &&  this.state.UsdtInfo.num >=item.recharge_num ) {
                    if(index === 0){
                        this.setState({
                            btn1Active:true
                        })
                    }else if(index === 1){
                        this.setState({
                            btn2Active:true
                        })
                    }else if(index === 2){
                        this.setState({
                            btn3Active:true
                        })
                    }
                }
            })
            
        }
        if(Number(this.state.UsdtInfo.received_info[0].receive_amount)> 0){
            this.state.UsdtInfo.received_info.forEach((e)=>{
                this.state.info.range.forEach((item,index)=>{
                    if(Number(e.receive_amount) === item.bonus){
                        if(index === 0){
                            this.setState({
                                is_received1:true
                            })
                        }else if(index ===1){
                            this.setState({
                                is_received2:true
                            })
                        }else if(index ===2){
                            this.setState({
                                is_received3:true
                            })
                        }
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
        this.btnIndex = e.target.getAttribute("data-index")
        this.Axios_receiveUsdtPayGold()
    }
    private async Axios_receiveUsdtPayGold(){
        let url = `${gHandler.UrlData.host}${Api.receiveUsdtPayGold}`;
        let data = new FormData();
        data.append('user_id',gHandler.UrlData.user_id);
        data.append('index',`${this.btnIndex}`);
        data.append('source',"1");
        data.append('package_id',gHandler.UrlData.package_id);
        data.append('activity_id',this.props.curData.id);
        data.append('login_ip',gHandler.UrlData.login_ip?gHandler.UrlData.login_ip:gHandler.UrlData.regin_ip);
        data.append('regin_ip',gHandler.UrlData.regin_ip);
        data.append('device_id',gHandler.UrlData.device_id);
        data.append('center_auth',gHandler.UrlData.center_auth);
        data.append('token',gHandler.token);
        let response = await Axios.post(url,data).then(response=>{
            return response.data;
        }).catch(err => { message.error(err)} )
        if(response.status === 0){
            message.success('申请成功！');
            this.Axios_getRewardUsdtInfo();
        }else{
            message.error(response.msg)
        }
    }
    private async  Axios_getRewardUsdtInfo(){
        let url = `${gHandler.UrlData.host}${Api.getRewardUsdtInfo}?user_id=${gHandler.UrlData.user_id}&amount=${this.state.info.usdt_amount}&activity_id=${this.props.curData.id}&token=${gHandler.token}&center_auth=${gHandler.UrlData.center_auth}`;
        let response = await Axios.get(url).then(response=>{
            return response.data
        }).catch(err=>{
            message.error(err)
        })
        if(response.status === 0){
            this.setState({
                UsdtInfo:response.data
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
                    <div className ="li1 flexBox">USDT存款次数≥{e.recharge_num}</div>
                    <div className ="li2 flexBox">{e.bonus}元</div>
                    <div className ="li3 flexBox"></div>
                    <div className ="li4 flexBox"> 
                        {
                            index === 0&&this.state.btn1Active ?<div className = { this.state.is_received1 ? `btn_Ylinqu`:"btn_linqu" } data-index={index} 
                                onClick={this.onClick}
                            ></div>:(index === 1&&this.state.btn2Active?<div className = { this.state.is_received2 ? `btn_Ylinqu`:"btn_linqu" } data-index={index} 
                                onClick={this.onClick}
                            ></div>:(index === 2&&this.state.btn3Active?<div className = { this.state.is_received3 ? `btn_Ylinqu`:"btn_linqu" } data-index={index} 
                                onClick={this.onClick}
                            ></div>:null))
                        }
                    </div>
                </div>
            })
        }
        return (
            <div className ="UsdtCunKuan" style={{
                transform:`scale(${gHandler.getNodeScale()},${gHandler.getNodeScale()})`,
                marginLeft:gHandler.getLeftOff(),
                marginTop:gHandler.getTopOff()
            }}>
                <div className = "group">
                    {
                        rangeLine()
                    }
                    <div className="label1">彩金{this.state.info.flow_rate}倍流水</div>
                </div>
                <div className = "rule">
                    <p>活动规则：</p>
                    <p>1. 只要您使用虚拟货币USDT进行存款，单笔充值100USDT以上，累计达到相对应的充值次数即可领取相对应的彩金（彩金5倍流水即可申请兑换）。</p>
                    <p>2. 同IP同设备多账号仅限1个账号享受活动资格。</p>
                    <p>3. USDT地址绑定，依照平台指引地址类型进行绑定，如有疑问请及时咨询客服。</p>
                    <p>4. 本活动最终解释权归新贵游戏所有。</p>
                </div>
            </div>
        )
    }
}
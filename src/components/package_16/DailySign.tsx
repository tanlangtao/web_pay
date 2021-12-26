/*活动组件*/
import React from 'react'
import {gHandler} from '../../lib/gHandler'
import { Api } from '../../lib/Api';
import Axios from 'axios';
import {message, Button} from 'antd';
import "./DailySign.scss";
import {ConfigItem} from '../../interface/activity_interface';
interface Props {
    curData:ConfigItem
}
interface State {
    info:any,
    showGuize:Boolean,
    flagData:any
}
export default class DailySign16 extends React.Component<Props,State>{
    state = {
        info:{
            flow_rate:0,
            range:[
                {
                    bonus:0, //每日免费礼金  第1次可领取金额
                    bet:0, //每日免费礼金   第1次 有效投注门槛  以此类推
                }
            ]
        },
        flagData:{
            check_receive:false,
            day:0,
            is_received:0
        },
        showGuize:false,
    }
    componentDidMount(){
        this.setState({
            info:this.props.curData.info
        })
        console.log(this.state.info,this.props.curData)
        this.Axios_getFreeGoldFlag()
    }
    componentWillUnmount(){
        this.setState = (state,callback)=>{
            return
        }
    }
    onClick =(e:any)=>{
        this.Axios_receiveFreeGoldByDay()
        //阻止冒泡
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();
    }
    tipClick =(e:any)=>{
        message.info("您不符合领取资格!")
    }
    guizeClick = ()=>{
        this.setState({
            showGuize:!this.state.showGuize
        })
    }
    private async  Axios_getFreeGoldFlag(){
        let url = `${gHandler.UrlData.host}${Api.getFreeGoldFlag}?user_id=${gHandler.UrlData.user_id}&activity_id=${this.props.curData.id}&package_id=${gHandler.UrlData.package_id}&token=${gHandler.token}&center_auth=${gHandler.UrlData.center_auth}`;
        let response = await Axios.get(url).then(response=>{
            return response.data
        }).catch(err=>{
            return message.error("failed to load response data")
        })
        if(response.status === 0){
            this.setState({
                flagData:response.data
            })
        }else{
            message.error(response.msg)
        }
    }
    //领取
    private async Axios_receiveFreeGoldByDay(){
        let url = `${gHandler.UrlData.host}${Api.receiveFreeGoldByDay}`;
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
            this.Axios_getFreeGoldFlag()
        }else{
            message.error(response.msg)
        }
    }
    render (){
        let flagData = this.state.flagData
        let rangeLine = ()=>{
            return  this.state.info.range.map((e:any,index:number) => {
                if(index<7){
                    return <div className ={`li1 flexBox `}  key={index} onClick={this.tipClick}>
                        <div className={`icon icon${index+1}`}>
                            {
                                flagData.check_receive && flagData.day===index ?
                                    (flagData.is_received === 0 ?<div className ="lingqu" onClick={this.onClick}>
                                        <div className="waitToCheck"></div>
                                    </div>:<div className="yilingqu"></div>):
                                    (index < flagData.day?<div className="yilingqu"></div>:null)
                            }
                            <div className="foot">
                                <div className = "jinbi"></div>
                                <div className='zi'>{e.bonus}</div>
                            </div>
                        </div>
                        
                    </div>
                }else{
                    return null
                }
            })
        }
        return (
            <div className ="DailySign16" >
                <div className = "group">
                    {
                        rangeLine()
                        
                    }
                </div>
                <div className="guizeBtn" onClick={this.guizeClick}>
                    {
                        this.state.showGuize ?<div className="guizeMask">
                            <p>1. 用户需要绑定银行卡方可参加此活动。</p>
                            <p>2. 昨日活跃用户，次日可领取免费礼金3.8金币，可连续领取7日，礼金无流水限制。</p>
                            <p>3. 活跃用户定义：玩家单日有效投注满200即可（沙巴体育，真人视讯，彩票游戏不参与统计）。</p>
                            <p>4. 同一用户（同IP同设备视为同一用户）仅限参加一次活动，活动彩金无需流水限制可直接申请兑换。</p>
                            <p>5. 平台拥有最终解释权，严禁一切恶意行为，出现违规情况，一律封号处理；同时平台有权根据实际情况，随时调整活动内容。</p>
                        </div>:null
                    }
                </div>
            </div>
        )
    }
}
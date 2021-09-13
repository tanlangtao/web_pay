/*活动组件*/
import React from 'react'
import {gHandler} from '../../lib/gHandler'
import { Api } from '../../lib/Api';
import Axios from 'axios';
import {message, Button} from 'antd';
import "./Xzdlphb.scss";
import {ConfigItem} from '../../interface/activity_interface';
interface Props {
    curData:ConfigItem
}
interface Item{
    id:string,
    ren:number
}
interface State {
    info:any,
    is_received:number,
    lastweek:any,
    lastweekList:Item[],
    num:number
}
export default class Xzdlphb extends React.Component<Props,State>{
    state = {
        info:{
            hour:0,
            flow_rate:0,
            bonus:[]
        },
        is_received:0,
        lastweek: {},
        lastweekList:[{
            id:"",
            ren:0
        }],
        num:0,
    }
    componentDidMount(){
        this.setState({
            info:this.props.curData.info
        })
        this.Axios_getRankByProxyPid()
    }
    renderBtn(){
        let objectSource:any = this.state.lastweek;
        let arr = []
        for(var k in objectSource){
            if(objectSource.hasOwnProperty(k)){
                let item:Item = {
                    "id":k,
                    "ren":Number(objectSource[k])
                }
                arr.push(item)
            }
        }
        arr.sort((a,b)=>b.ren-a.ren)
        this.setState({
            lastweekList:arr
        })
    }
    componentWillUnmount(){
        this.setState = (state,callback)=>{
            return
        }
    }
    onClick =(e:any)=>{
        this.Axios_receiveRankGoldByPid()
    }
    private async Axios_receiveRankGoldByPid(){
        let url = `${gHandler.UrlData.host}${Api.receiveRankGoldByPid}`;
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
            this.Axios_getRankByProxyPid();
        }else{
            message.error(response.msg)
        }
    }
    private async  Axios_getRankByProxyPid(){
        let url = `${gHandler.UrlData.host}${Api.getRankByProxyPid}?user_id=${gHandler.UrlData.user_id}&activity_id=${this.props.curData.id}&package_id=${gHandler.UrlData.package_id}&token=${gHandler.token}&center_auth=${gHandler.UrlData.center_auth}`;
        let response = await Axios.get(url).then(response=>{
            return response.data
        }).catch(err=>{
            return message.error("failed to load response data")
        })
        if(response.status === 0){
            this.setState({
                is_received:response.data.is_received,
                lastweek:response.data.lastweek,
                num:response.data.num
            },()=>{this.renderBtn()})
            
        }else{
            message.error(response.msg)
        }
    }
    render (){
        let rangeLine = ()=>{
            return  this.state.info.bonus.map((e:any,index:number) => {
                return <div className ="line" key={index}>
                    <div className ="li1 flexBox">第{index+1}名</div>
                    <div className ="li2 flexBox">{e}</div>
                    <div className ="li3 flexBox"> 
                        {
                            this.state.lastweekList[index] && this.state.lastweekList[index].id === gHandler.UrlData.user_id?<div className = { this.state.is_received === 1 ? `btn_Ylinqu`:"btn_linqu" } data-index={index} 
                                onClick={this.onClick}
                            ></div> :null
                        }
                    </div>
                </div>
            })
        }
        return (
            <div className ="Xzdlphb" >
                <div className ="bg"></div>
                <div className = "group">
                    <div className ="line title" >
                        <div className ="li1 flexBox">名次</div>
                        <div className ="li2 flexBox">彩金</div>
                    </div>
                    {
                        rangeLine()
                    }
                </div>
                <div className="label1">{this.state.num}名</div>
                <div className = "rule">
                    <p>活动规则：</p>
                    <p>1. 玩家需要绑定手机号码和银行卡才能参与此活动。</p>
                    <p>2. 会员的直属玩家发展一名有效玩家，则计算为该会员新增了一名有效代理。</p>
                    <p>3. 有效玩家定义：绑定手机号码+绑定银行卡+充值金额100以上且有效流水100以上。</p>
                    <p>4. 领取时间：每周一12:00-23:59:59，逾期未领取视为自动放弃。</p>
                    <p>5. 同一用户（同IP同设备视为同一用户）仅限参加一次活动。</p>
                    <p>6. 平台拥有最终解释权，严禁一切恶意行为，出现违规情况，一律封号处理；同时平台有权根据实际情况，随时调整活动内容。</p>
                </div>
            </div>
        )
    }
}
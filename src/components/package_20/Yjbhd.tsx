/*活动组件*/
import React from 'react'
import {gHandler} from '../../lib/gHandler'
import { Api } from '../../lib/Api';
import Axios from 'axios';
import {message, Button} from 'antd';
import "./Yjbhd.scss";
import {ConfigItem} from '../../interface/activity_interface';
interface Props {
    curData:ConfigItem
}
interface msgItem {
    game_nick:String,
    id:Number,
    win:Number
}
interface dayItem{
    id:Number,
    lose_total:Number,
    win_total:Number,
}
interface State {
    info:any,
    is_received:number,
    today:dayItem[],
    yesterday:dayItem[],
    GetWinRankList :msgItem[],
    showGuize:boolean
}
export default class Yjbhd20 extends React.Component<Props,State>{
    state = {
        showGuize:false,
        info:{
            hour:0,
            flow_rate:0,
            bonus:[]
        },
        today:[{
            id:0,
            lose_total:0,
            win_total:0
        }],
        yesterday:[{
            id:0,
            lose_total:0,
            win_total:0
        }],
        is_received:0,
        GetWinRankList:[{
            game_nick:"",
            id:0,
            win:0
        }]
    }
    btnIndex= 0 
    componentDidMount(){
        this.getTodayDate()
        this.setState({
            info:this.props.curData.info
        })
        this.Axios_center_GetWinRankList()
        this.Axios_getGameUsersWinAndLoseByDate()
    }
    componentWillUnmount(){
        this.setState = (state,callback)=>{
            return
        }
    }
    onClick =(e:any)=>{
        this.Axios_receiveGoldByWin()
    }
    //领取
    private async Axios_receiveGoldByWin(){
        let url = `${gHandler.UrlData.host}${Api.receiveGoldByWin}`;
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
            this.Axios_getGameUsersWinAndLoseByDate();
        }else{
            message.error(response.msg)
        }
    }
    private async  Axios_getGameUsersWinAndLoseByDate(){
        let url = `${gHandler.UrlData.host}${Api.getGameUsersWinAndLoseByDate}?user_id=${gHandler.UrlData.user_id}&activity_id=${this.props.curData.id}&package_id=${gHandler.UrlData.package_id}&token=${gHandler.token}&center_auth=${gHandler.UrlData.center_auth}`;
        let response = await Axios.get(url).then(response=>{
            return response.data
        }).catch(err=>{
            return message.error("failed to load response data")
        })
        if(response.status === 0){
            this.setState({
                today:response.data.today === null ?this.state.today:response.data.today ,
                yesterday:response.data.yesterday=== null ?this.state.yesterday:response.data.yesterday,
                is_received:response.data.is_received
            })
            
        }else{
            message.error(response.msg)
        }
    }
    private async  Axios_center_GetWinRankList(){
        let url = `${gHandler.UrlData.host}${Api.GetWinRankList}?platform_key=654321&package_id=${gHandler.UrlData.package_id}&date=${this.getTodayDate()}&limit=10`;
        let response = await Axios.get(url).then(response=>{
            return response.data
        }).catch(err=>{
            return message.error("failed to load response data")
        })
        if(response.code === 200){
            if(response.msg === null){
                response.msg = []
            }
            this.setState({
                GetWinRankList:response.msg
            })
        }else{
            message.error(response.msg)
        }
    }
    guizeClick = ()=>{
        this.setState({
            showGuize:!this.state.showGuize
        })
    }
    render (){
        let rangeLine = ()=>{
            return  this.state.GetWinRankList.map((e:any,index:number) => {
                if(e.win <=0){
                    return <div key={index}></div>
                }
                return <div className ="line" key={index}>
                    <div className ="li1 flexBox">第{index+1}名</div>
                    <div className ="li2 flexBox">{e.game_nick}</div>
                    <div className ="li3 flexBox">{gHandler.toDecimal(e.win)}</div>
                    <div className ="li4 flexBox">{this.state.info.bonus[index]}</div>
                    <div className ="li5 flexBox"> 
                        {
                            `${this.state.GetWinRankList[index].id}` === gHandler.UrlData.user_id ?<div className = { this.state.is_received === 1 ? `btn_Ylinqu`:"btn_linqu" } data-index={index} 
                                onClick={this.onClick}
                            ></div> :null
                        }
                    </div>
                </div>
            })
        }
        return (
            <div className ="Yjbhd20" >
                <div className ="bg"></div>
                <div className = "group">
                    <div className ="title" >
                        <div className ="li1 flexBox">名次</div>
                        <div className ="li2 flexBox">玩家昵称</div>
                        <div className ="li3 flexBox">盈利金额</div>
                        <div className ="li4 flexBox">彩金</div>
                        <div className ="li5 flexBox"></div>
                    </div>
                    {
                        rangeLine()
                    }
                </div>
                <div className="foot">
                    <div className = "icon2">{gHandler.toDecimal(this.state.yesterday[0].win_total - Math.abs(this.state.yesterday[0].lose_total))}</div>
                    <div className = "icon2">{gHandler.toDecimal(this.state.today[0].win_total - Math.abs(this.state.today[0].lose_total))}</div>
                </div>
                <div className="guizeBtn" onClick={this.guizeClick}>
                    {
                        this.state.showGuize ?<div className="guizeMask">
                            <p>1.绑定手机和银行卡即可参加活动。</p>
                            <p>2.活动内容：每日0点进行统计所有玩家昨日盈利进行排行，前十名获得奖励。</p>
                            <p>3.奖励内容：第一名到第十名依次奖励为888, 788, 688, 488, 388, 288, 188, 128, 88, 58金币。</p>
                            <p>4.领取时间：每天12:00:00-23:59:59，逾期未领取视为自动放弃。</p>
                            <p>5.同一用户单日仅限领取一次，恶意套利者将封号处理。</p>
                            <p>6.平台拥有最终解释权。</p>
                        </div>:null
                    }
                </div>
            </div>
        )
    }
    getTodayDate(){
        let today =  new Date()
        let yesterday = new Date(today.getTime() - 86400000)
        let y = yesterday.getFullYear()
        let m :any= yesterday.getMonth()+1
        let d :any= yesterday.getDate()
        if(m<10){
            m = `0${m}`
        }
        if(d<10){
            d = `0${d}`
        }
        let date = `${y}-${m}-${d}`
        return date
    }
}
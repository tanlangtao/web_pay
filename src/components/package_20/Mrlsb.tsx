/*活动组件*/
import React from 'react'
import {gHandler} from '../../lib/gHandler'
import { Api } from '../../lib/Api';
import Axios from 'axios';
import {message, Button} from 'antd';
import "./Mrlsb.scss";
import {ConfigItem} from '../../interface/activity_interface';
interface Props {
    curData:ConfigItem
}
interface msgItem {
    bet_total:Number,
    game_user_id:Number,
}
interface State {
    info:any,
    is_received:number,
    List :msgItem[],
    List2 :msgItem[],
    showGuize:boolean,
    today_bet_total:number,
    yesterday_bet_total:number,
}
export default class Mrlsb20 extends React.Component<Props,State>{
    state = {
        showGuize:false,
        info:{
            hour:0,
            flow_rate:0,
            bonus:[]
        },
        is_received:0,
        List:[{
            bet_total:0,
            game_user_id:0,
        }],
        List2:[{
            bet_total:0,
            game_user_id:0,
        }],
        today_bet_total:0,
        yesterday_bet_total:0,
    }
    btnIndex= 0 
    componentDidMount(){
        this.getTodayDate()
        this.setState({
            info:this.props.curData.info
        })
        this.Axios_getTopTenLeaderBoardByDate()
    }
    componentWillUnmount(){
        this.setState = (state,callback)=>{
            return
        }
    }
    onClick =(e:any)=>{
        this.Axios_receiveTopTenLeaderBoardByDate()
    }
    //领取
    private async Axios_receiveTopTenLeaderBoardByDate(){
        let url = `${gHandler.UrlData.host}${Api.receiveTopTenLeaderBoardByDate}`;
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
            this.Axios_getTopTenLeaderBoardByDate();
        }else{
            message.error(response.msg)
        }
    }
    private async  Axios_getTopTenLeaderBoardByDate(){
        let url = `${gHandler.UrlData.host}${Api.getTopTenLeaderBoardByDate}?user_id=${gHandler.UrlData.user_id}&activity_id=${this.props.curData.id}&package_id=${gHandler.UrlData.package_id}&token=${gHandler.token}&center_auth=${gHandler.UrlData.center_auth}`;
        let response = await Axios.get(url).then(response=>{
            return response.data
        }).catch(err=>{
            return message.error("failed to load response data")
        })
        if(response.status === 0){
            let arr :msgItem[]= response.data.today
            this.setState({
                is_received:response.data.is_received,
                yesterday_bet_total:response.data.yesterday_bet_total,
                today_bet_total:response.data.today_bet_total,
                List:arr.slice(0,8),
                List2:arr.slice(8),
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
            return  this.state.List.map((e:any,index:number) => {
                if(e.bet_total <=0){
                    return <div key={index}></div>
                }
                return <div className ="line" key={index}>
                    <div className ="li1 flexBox">第{index+1}名</div>
                    <div className ="li2 flexBox">{e.game_user_id}</div>
                    <div className ="li3 flexBox">{gHandler.toDecimal(e.bet_total)}</div>
                    <div className ="li4 flexBox">{this.state.info.bonus[index]}</div>
                    <div className ="li5 flexBox"> 
                        {
                            `${this.state.List[index].game_user_id}` === gHandler.UrlData.user_id ?<div className = { this.state.is_received === 1 ? `btn_Ylinqu`:"btn_linqu" } data-index={index} 
                                onClick={this.onClick}
                            ></div> :null
                        }
                    </div>
                </div>
            })
        }
        let rangeLine2 = ()=>{
            return  this.state.List2.map((e:any,index:number) => {
                if(e.bet_total <=0){
                    return <div key={index}></div>
                }
                return <div className ="line" key={index}>
                    <div className ="li1 flexBox">第{index+9}名</div>
                    <div className ="li2 flexBox">{e.game_user_id}</div>
                    <div className ="li3 flexBox">{gHandler.toDecimal(e.bet_total)}</div>
                    <div className ="li4 flexBox">{this.state.info.bonus[index+8]?this.state.info.bonus[index+8]:38}</div>
                    <div className ="li5 flexBox"> 
                        {
                            `${this.state.List2[index].game_user_id}` === gHandler.UrlData.user_id ?<div className = { this.state.is_received === 1 ? `btn_Ylinqu`:"btn_linqu" } data-index={index} 
                                onClick={this.onClick}
                            ></div> :null
                        }
                    </div>
                </div>
            })
        }
        return (
            <div className ="Mrlsb20" >
                <div className ="bg"></div>
                <div className = "group">
                    <div className ="title" >
                        <div className ="li1 flexBox">名次</div>
                        <div className ="li2 flexBox">玩家ID</div>
                        <div className ="li3 flexBox">昨日流水</div>
                        <div className ="li4 flexBox">彩金</div>
                        <div className ="li5 flexBox"></div>
                    </div>
                    {
                        rangeLine()
                    }
                </div>
                <div className = "group2">
                    <div className ="title" >
                        <div className ="li1 flexBox">名次</div>
                        <div className ="li2 flexBox">玩家ID</div>
                        <div className ="li3 flexBox">昨日流水</div>
                        <div className ="li4 flexBox">彩金</div>
                        <div className ="li5 flexBox"></div>
                    </div>
                    {
                        rangeLine2()
                    }
                </div>
                
                <div className="foot">
                    <div className = "icon2">{gHandler.toDecimal(this.state.yesterday_bet_total)}</div>
                    <div className = "icon2">{gHandler.toDecimal(this.state.today_bet_total)}</div>
                </div>
                <div className="guizeBtn" onClick={this.guizeClick}>
                    {
                        this.state.showGuize ?<div className="guizeMask">
                            <p>1.绑定手机和银行卡即可参加活动。</p>
                            <p>2.活动内容：每日0点进行统计所有玩家昨日盈利进行排行，前十五名获得奖励。</p>
                            <p>3.奖励内容：第一名到第十名依次奖励为3888, 2888, 1888, 888, 688, 588, 388, 288, 188, 88金币，第十一名到第十五名奖励38金币，彩金需打满3倍流水方可申请兑换。</p>
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
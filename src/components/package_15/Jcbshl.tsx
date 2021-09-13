/*活动组件*/
import React from 'react'
import {gHandler} from '../../lib/gHandler'
import { Api } from '../../lib/Api';
import Axios from 'axios';
import {message, Button} from 'antd';
import "./Jcbshl.scss";
import {ConfigItem} from '../../interface/activity_interface';
interface Props {
    curData:ConfigItem
}
interface item {
    bonus:Number,
    end_time:String,
    rank:Number,
    start_time:String,
    turnover:Number,
    turnover_bonus:Number,
    user_id:String
}
interface State {
    info:any,
    list:item[],
}
export default class Jcbshl extends React.Component<Props,State>{
    state = {
        info:{
        },
        list:[
            {
                bonus:0,
                end_time:"",
                rank:0,
                start_time:"",
                turnover:0,
                turnover_bonus:0,
                user_id:""
            }
        ]
    }
    btnIndex= 0 
    componentDidMount(){
        this.setState({
            info:this.props.curData.info
        })
        this.Axios_getFristPayAmount()
    }
    componentWillUnmount(){
        this.setState = (state,callback)=>{
            return
        }
    }
    private async  Axios_getFristPayAmount(){
        let gameHost = gHandler.UrlData.host.replace("pay","game")
        let url = `${gameHost}${Api.game_getHaoLiPlayerData}?user_id=${gHandler.UrlData.user_id}&game_id=5b1f3a3cb76a451e210820&room_id=1`;
        let response = await Axios.get(url).then(response=>{
            return response.data
        }).catch(err=>{
            return message.error("failed to load response data")
        })
        if(response.code === 0){
            this.setState({
                list:response.data.list
            })
        }else{
            message.error(response.msg)
        }
    }
    render (){
        let rangeLine = ()=>{
            return  this.state.list.map((e:any,index:number) => {
                return <div className ="line" key={index}>
                    <div className ="li1 flexBox">{e.start_time.substring(5,10)} {e.start_time.substring(11,e.start_time.length-3)} - {e.end_time.substring(11,e.start_time.length-3)}</div>
                    <div className ="li2 flexBox">{e.turnover_bonus}</div>
                    <div className ="li3 flexBox">{e.turnover}</div>
                    <div className ="li4 flexBox">{e.rank===0?"无":e.rank}</div>
                    <div className ="li5 flexBox">{e.bonus===0?"无":e.bonus}</div>
                </div>
            })
        }
        return (
            <div className ="Jcbshl" >
                <div className ="bg"></div>
                <div className = "group">
                    <div className ="line title" >
                        <div className ="li1 flexBox">时间</div>
                        <div className ="li2 flexBox">奖金池</div>
                        <div className ="li3 flexBox">我的流水</div>
                        <div className ="li4 flexBox">名次</div>
                        <div className ="li5 flexBox">彩金</div>
                    </div>
                    {
                        rangeLine()
                    }
                </div>
                <div className = "rule">
                    <p>1. 玩家在分分彩猜大小奇趣分分彩游戏房间中游戏所产生的流水才计算到排行榜中，在其他游戏中产生的流水不计算其中。</p>
                    <p>2. 活动时间：每日11:00am至次日凌晨02:00，每天共发放15轮奖励。</p>
                    <p>3. 所有在奇趣分分彩中的玩家总流水达到1万，奖池将增加20金币，每小时按照玩家当前所贡献的流水进行排名，前10名按名次瓜分当前奖池总奖金，每小时排行榜中的流水和奖池将清零并结算一次，重新开始计算。</p>
                    <p>4. 活动奖励：每小时整点结算后，系统自动发放。第一名：25%，第二名：20%，第三名：15%，第四名：9%，第五名：6%，第六名至第十名5%。</p>
                </div>
            </div>
        )
    }
}
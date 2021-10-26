/*活动组件*/
import React from 'react'
import {gHandler} from '../../lib/gHandler'
import { Api } from '../../lib/Api';
import Axios from 'axios';
import {message, Button} from 'antd';
import "./Qpdjc.scss";
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
    showRule:Boolean
}
export default class Qpdjc extends React.Component<Props,State>{
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
        ],
        showRule:false
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
    ruleBtnClick = ()=>{
        this.setState({
            showRule:!this.state.showRule
        })
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
            <div className ="Qpdjc" >
                <div className ="bg"></div>
                <div className = "group1">
                    <div className ="line title" >
                        <div className ="li1 flexBox">本周</div>
                        <div className ="li2 flexBox">
                            <div className = "title">
                                <div className = "item flexBox">奖池奖金</div>
                                <div className = "item flexBox">我的奖金占比</div>
                                <div className = "item flexBox">预估奖金</div>
                            </div>
                            <div className = "content">
                                <div className = "item flexBox"></div>
                                <div className = "item flexBox"></div>
                                <div className = "item flexBox"></div>
                            </div>
                        </div>
                        <div className ={`flexBox lingqu`}></div>
                    </div>
                    <div className ="line title" >
                        <div className ="li1 flexBox">上周</div>
                        <div className ="li2 flexBox">
                            <div className = "title">
                                <div className = "item flexBox">奖池奖金</div>
                                <div className = "item flexBox">我的奖金占比</div>
                                <div className = "item flexBox">预估奖金</div>
                            </div>
                            <div className = "content">
                                <div className = "item flexBox"></div>
                                <div className = "item flexBox"></div>
                                <div className = "item flexBox"></div>
                            </div>
                        </div>
                        <div className ={`flexBox lingqu`}></div>

                    </div>
                </div>
                <div className = "ruleBtn" onClick={this.ruleBtnClick}></div>
                {
                    this.state.showRule ? <div className = "rule">
                        <p>棋牌奖金池发放原则:</p>
                        <p>1. 每周平台会累计棋牌奖金池金额，发放给满足条件的棋牌玩家。</p>
                        <p>2. 平台的棋牌流水 = 平台所有人棋牌类有效投注总和。</p>
                        <p>3. 参与本活动个人棋牌有效投注要求不低于10万。</p>
                        <p>4. 奖金池占比 = 我的个人棋牌有效投注 / 平台所有人棋牌有效投注。</p>
                        <p>5. 系统自动依据奖金池占比派发奖金。</p>
                        <p>6. 奖金池金额领取时间为每周一的12:00开放到每周日的12:00。</p>
                        <p>7. 平台保留此活动最终解释权。</p>
                    </div> :null
                }
            </div>
        )
    }
}
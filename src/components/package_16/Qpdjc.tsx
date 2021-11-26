/*活动组件*/
import React from 'react'
import {gHandler} from '../../lib/gHandler'
import { Api } from '../../lib/Api';
import Axios from 'axios';
import {message, Button} from 'antd';
import "./Qpdjc.scss";
import {ConfigItem} from '../../interface/activity_interface';
import { inflate } from 'zlib';
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
    data:BoosPoolData,
    showRule:Boolean
}
interface BoosPoolData{
    currentweek:Week,
    lastweek:Week,
    is_received:Number
}
interface Week {
    bonus_pool:Number,
    platform_bet_total:Number,
    player_bet_total:Number,
    player_bonus_pool_ratio:Number
}
export default class Qpdjc extends React.Component<Props,State>{
    state = {
        info:{
        },
        data:{
            currentweek:{
                bonus_pool:0,
                platform_bet_total:0,
                player_bet_total:0,
                player_bonus_pool_ratio:0,
            },
            lastweek:{
                bonus_pool:0,
                platform_bet_total:0,
                player_bet_total:0,
                player_bonus_pool_ratio:0,
            },
            is_received:0
        },
        showRule:false
    }
    btnIndex= 0 
    componentDidMount(){
        this.setState({
            info:this.props.curData.info
        })
        this.Axios_getBonusPool()
    }
    componentWillUnmount(){
        this.setState = (state,callback)=>{
            return
        }
    }
    private async  Axios_getBonusPool(){
        let url = `${gHandler.UrlData.host}${Api.getBonusPool}?user_id=${gHandler.UrlData.user_id}&activity_id=${this.props.curData.id}&package_id=${gHandler.UrlData.package_id}&token=${gHandler.token}&center_auth=${gHandler.UrlData.center_auth}`;
        let response = await Axios.get(url).then(response=>{
            return response.data
        }).catch(err=>{
            return message.error("failed to load response data")
        })
        if(response.status === 0){
            this.setState({
                data:response.data
            })
        }else{
            message.error(response.msg)
        }
    }
    //领取
    private async Axios_receiveBonusPool(){
        let url = `${gHandler.UrlData.host}${Api.receiveBonusPool}`;
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
            this.Axios_getBonusPool()
        }else{
            message.error(response.msg)
        }
    }
    ruleBtnClick = ()=>{
        this.setState({
            showRule:!this.state.showRule
        })
    }
    onClick =(e:any)=>{
        this.Axios_receiveBonusPool()
    }
    getTime(){
        let hour  = new Date().getHours()
        let day  = new Date().getDay()
        //周一中午12点之前不能领
        if(day === 1 && hour < 12 ){
            return false
        //周日中午12点之后不能领
        }else if(day === 7 && hour >=12){
            return false
        }else{
            return true
        }
    }
    render (){
        let Font = gHandler.toDecimal(this.state.data.currentweek.bonus_pool)
        let FontArr = Font.split("")
        
        let renderFont = ()=>{
            return  FontArr.map((e:any,index:number) => {
                return <div className ="spriteFont" key={index}>
                    <div className={e === "0" ? "font f0" :
                        e === "1" ? "font f1":
                            e === "2" ? "font f2":
                                e === "3" ? "font f3":
                                    e === "4" ? "font f4":
                                        e === "5" ? "font f5":
                                            e === "6" ? "font f6":
                                                e === "7" ? "font f7":
                                                    e === "8" ? "font f8":
                                                        e === "9"? "font f9":
                                                            e === "." ? "font f11": ""
                    }></div>
                </div>
            })
        }
        return (
            <div className ="Qpdjc" >
                <div className ="bg"></div>
                <div className ="Font">
                    {
                        renderFont()
                    }
                    <div className = "spriteFont">
                        <div className ="font f10"></div>
                    </div>
                </div>
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
                                <div className = "item flexBox">{gHandler.toDecimal(this.state.data.currentweek.bonus_pool)}</div>
                                <div className = "item flexBox">{gHandler.toDecimal(this.state.data.currentweek.player_bonus_pool_ratio*100)}%</div>
                                <div className = "item flexBox">{gHandler.toDecimal(this.state.data.currentweek.bonus_pool*this.state.data.currentweek.player_bonus_pool_ratio)}</div>
                            </div>
                        </div>
                    </div>
                    <div className ="line title" >
                        <div className ="li1 flexBox">上周</div>
                        <div className ="li2 flexBox">
                            <div className = "title">
                                <div className = "item flexBox">奖池奖金</div>
                                <div className = "item flexBox">我的奖金占比</div>
                                <div className = "item flexBox">个人奖金</div>
                            </div>
                            <div className = "content">
                                <div className = "item flexBox">{gHandler.toDecimal(this.state.data.lastweek.bonus_pool)}</div>
                                <div className = "item flexBox">{gHandler.toDecimal(this.state.data.lastweek.player_bonus_pool_ratio*100)}%</div>
                                <div className = "item flexBox">{gHandler.toDecimal(this.state.data.lastweek.bonus_pool*this.state.data.lastweek.player_bonus_pool_ratio)}</div>
                            </div>
                        </div>
                        {
                            this.state.data.lastweek.bonus_pool*this.state.data.lastweek.player_bonus_pool_ratio >0 && this.getTime() ?
                                <div className ={`flexBox ${this.state.data.is_received === 0 ?"lingqu" : "ylingqu"}`} onClick={this.onClick}></div> :
                                null
                        }
                    </div>
                </div>
                <div className = "ruleBtn" onClick={this.ruleBtnClick}></div>
                {
                    this.state.showRule ? <div className = "rule">
                        <p>棋牌奖金池发放原则:</p>
                        <p>1.每周一至每周日平台会累积棋牌奖金池金额，发放给满足条件的棋牌玩家。</p>
                        <p>2.当周累计的奖金池金额则在下周清空重新计算。</p>
                        <p>3.奖金池占比 = 我的个人棋牌有效投注 / 平台的棋牌有效投注。</p>
                        <p>4.平台的棋牌有效投注 = 平台所有人棋牌类有效投注总和。</p>
                        <p>5.如何累积棋牌有效投注:</p>
                        <p>用户仅需进入以下游戏游玩，即可累积棋牌有效投注《彩源龙虎斗》，《彩源猜大小》，《聚宝盆捕鱼》，《疯狂旋涡》，《龙虎斗》，《百人牛牛》，《斗地主》，《奔驰宝马》，《抢庄牛牛》，《百家乐》，《十三水》，《二八杠》，《炸金花》，《红包乱斗》，《德州扑克》，《红黑大战》，《跑得快》，《轮盘》，《二人麻将》，《水果机》，《海王捕鱼》，《骰宝》，《21点》，《狮子王国》，《城堡争霸》，《多福多财》，《梭哈》，《财神到》，《发财推币机》。</p>
                        <p>6.参予本活动个人棋牌有效投注要求不低于3万。</p>
                        <p>7.系统自动依据奖金池占比派发奖金。</p>
                        <p>8.领取的奖金需打满一倍流水限制后才可进行兑换。</p>    
                        <p>9.奖金池金额领取时间为每周一的12:00开放到每周日的12:00。</p>    
                        <p>10.用户若在当期领取时间内无采取领取动作，视为放弃红利。</p>    
                        <p>11.本活动领取金额以最终奖金领取为准。</p>    
                        <p>12.平台保留此活动最终解释权。</p>    
                    </div> :null
                }
            </div>
        )
    }
}
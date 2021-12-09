/*活动组件*/
import React from 'react'
import {gHandler} from '../../lib/gHandler'
import { Api } from '../../lib/Api';
import Axios from 'axios';
import {message, Button} from 'antd';
import "./Qpdjc.scss";
import {ConfigItem} from '../../interface/activity_interface';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
// Import Swiper styles
import 'swiper/swiper.scss';
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
        }else if(day === 0 && hour >=12){
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
                        <div className="ruleContent">
                            <Swiper
                                direction={"vertical"}
                                spaceBetween={0}
                                height={80*gHandler.getHeightDiff()}
                                // onSlideChange={() => console.log('slide change')}
                                // onSwiper={(swiper) => console.log(swiper)}
                            >
                                <SwiperSlide><div className ="txt_rule"></div></SwiperSlide>
                                <SwiperSlide></SwiperSlide>
                                <SwiperSlide></SwiperSlide>
                                <SwiperSlide></SwiperSlide>
                                <SwiperSlide></SwiperSlide>
                            </Swiper>
                        </div>
                    </div> :null
                }
            </div>
        )
    }
}
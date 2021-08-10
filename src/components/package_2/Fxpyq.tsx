/*活动组件*/
import React from 'react'
import {gHandler} from '../../lib/gHandler'
import { Api } from '../../lib/Api';
import Axios from 'axios';
import {message, Button} from 'antd';
import "./Fxpyq.scss";
import {ConfigItem} from '../../interface/activity_interface';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
// Import Swiper styles
import 'swiper/swiper.scss';
interface Props {
    curData:ConfigItem
}
interface State {
    info:any,
}
export default class Fxpyq extends React.Component<Props,State>{
    state = {
        info:{
            range:[
                {
                    people:200,
                    bouns:30,
                    gold:38
                },
                {
                    people:500,
                    bouns:30,
                    gold:58
                },
                {
                    people:1000,
                    bouns:60,
                    gold:88
                },
                {
                    people:2000,
                    bouns:80,
                    gold:118
                },
            ]
        }
    }
    btnIndex= 0 
    componentDidMount(){
    }
    componentWillUnmount(){
        this.setState = (state,callback)=>{
            return
        }
    }
    render (){
        let rangeLine = ()=>{
            
            return  this.state.info.range.map((e:any,index:number) => {
                return <div className ="line" key={index}>
                    <div className ="li1 flexBox">{e.people}+</div>
                    <div className ="li2 flexBox">{e.bouns}+</div>
                    <div className ="li3 flexBox">{e.gold}元</div>
                </div>
            })
        }
        return (
            <div className ="Fxpyq">
                <div className="Swiper">
                    <Swiper
                        direction={"vertical"}
                        spaceBetween={10}
                        height={800*gHandler.getHeightDiff()}
                        // onSlideChange={() => console.log('slide change')}
                        // onSwiper={(swiper) => console.log(swiper)}
                    >
                        <SwiperSlide className="SwiperSlide">
                            <div className = "label1">
                                <p>1. 分享内容：佣金领取截图 活动图 游戏赢分截图 业绩图 游戏邀请二维码。</p>
                                <p>2. 每日分享朋友圈, 超过12小时, 屏蔽人数不能超过5人, 满12小时后隔天, 录屏审核。</p>
                            </div>
                            <div className = "group">
                                <div className="line"> 
                                    <div className="li1 flexBox" >微信人数</div>
                                    <div className="li2 flexBox" >当日佣金</div>
                                    <div className="li3 flexBox" >领取工资</div>
                                </div>
                                {
                                    rangeLine()
                                }
                            </div>
                            <div className = "label2">
                                <p>审核要求，提供ID，要求微信人数跟当日佣金达到以上要求，录制视屏昨日朋友圈所发内容跟微信人数仅此我这条线下面的ID。
                                所领取的每日工资，赠送的金币一倍流水即可兑换。
                                此活动不能跟官网优惠活动同时申请。</p>
                            </div>
                            <div className = "label3">
                                <p>1. 点开微信，并结束微信进程。</p>
                                <p>2. 打开 "微信" ，点击聊天页随意找到一个好友，点击对方头像进入对方朋友圈。</p>
                                <p>3. 点击通讯录，并将通讯录翻至最底部显示好友人数。</p>
                                <p>4. 请您点击 "发现" 进入朋友圈，点击自己朋友圈的头像进入自己的朋友圈，并点击昨日分享的朋友圈进入查看朋友圈状态。</p>
                                <p>5. 点击 "我" 页面，点击 "支付" 页面。进入两秒后退出。 </p>
                            </div>
                        </SwiperSlide>
                        <SwiperSlide >
                        </SwiperSlide>
                    </Swiper>
                </div>
                
            </div>
        )
    }
}
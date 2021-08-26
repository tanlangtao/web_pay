/*活动组件*/
import React from 'react'
import {gHandler} from '../../lib/gHandler'
import { Api } from '../../lib/Api';
import Axios from 'axios';
import {message, Button} from 'antd';
import "./Xyhschd.scss";
import {ConfigItem} from '../../interface/activity_interface';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
// Import Swiper styles
import 'swiper/swiper.scss';
interface Props {
    curData:ConfigItem
}
interface State {
    Day1:any,
    Day2:any,
}
export default class Xyhschd2 extends React.Component<Props,State>{
    state={
        Day1:[
            { recharge:100,gold:28 },
            { recharge:500,gold:68 },
            { recharge:1000,gold:98 },
            { recharge:3000,gold:388 },
            { recharge:5000,gold:588 },
            { recharge:10000,gold:1188 },
        ],
        Day2:[
            { recharge:100,gold:18 },
            { recharge:500,gold:38 },
            { recharge:1000,gold:88 },
            { recharge:3000,gold:188 },
            { recharge:5000,gold:388 },
            { recharge:10000,gold:688 },
        ]
    }
    componentWillUnmount(){
        this.setState = (state,callback)=>{
            return
        }
    }
    render (){
        let data1 = ()=>{
            return  this.state.Day1.map((e:any,index:number) => {
                return <div className ="line" key={index}>
                    <div className ="li1 flexBox">{e.recharge}</div>
                    <div className ="li2 flexBox">{e.gold}</div>
                </div>
            })
        }
        let data2 = ()=>{
            return  this.state.Day2.map((e:any,index:number) => {
                return <div className ="line" key={index}>
                    <div className ="li1 flexBox">{e.recharge}</div>
                    <div className ="li2 flexBox">{e.gold}</div>
                </div>
            })
        }
        return (
            <div className ="Xyhschd2" >
                <div className = "bg">
                    <div className="navBox">
                        <Swiper
                            direction={"vertical"}
                            spaceBetween={0}
                            height={240*gHandler.getHeightDiff()}
                            // onSlideChange={() => console.log('slide change')}
                            // onSwiper={(swiper) => console.log(swiper)}
                        >
                            <SwiperSlide>
                                <div className = "group">
                                    <div className="line"> 
                                        <div className="li1 flexBox" >充值金额</div>
                                        <div className="li2 flexBox" >赠送金额</div>
                                        <div className="li3 flexBox" >兑换限制</div>
                                    </div>
                                    {
                                        data1()
                                    }
                                    <div className="label1">第一天</div>
                                    <div className="label2">3倍流水</div>
                                </div>
                            </SwiperSlide>
                            <SwiperSlide>
                                <div className = "group">
                                    <div className="line"> 
                                        <div className="li1 flexBox" >充值金额</div>
                                        <div className="li2 flexBox" >赠送金额</div>
                                        <div className="li3 flexBox" >兑换限制</div>
                                    </div>
                                    {
                                        data2()
                                    }
                                    <div className="label1">第二天</div>
                                    <div className="label2">1倍流水</div>
                                </div>
                            </SwiperSlide>
                            <SwiperSlide>
                                <div className = "group">
                                    <div className="line"> 
                                        <div className="li1 flexBox" >充值金额</div>
                                        <div className="li2 flexBox" >赠送金额</div>
                                        <div className="li3 flexBox" >兑换限制</div>
                                    </div>
                                    {
                                        data2()
                                    }
                                    <div className="label1">第三天</div>
                                    <div className="label2">1倍流水</div>
                                </div>
                            </SwiperSlide>
                            <SwiperSlide>
                                <div className = "group2">
                                    <div className="rule"> 
                                        <p>申请条件：</p>
                                        <p>1. 当天新注册用户，需先绑定好手机号码，银行卡(ip关联2个以下)。</p>
                                        <p>2. 实名限制2及2个以上不符合。</p>
                                        <p>3. 只限游戏（财神到，水果机，捕鱼，百人牛牛，红包乱斗，二八杠，21点，奔驰宝马）。</p>
                                        <p>4. 每个账号一天只限第一次充值（如果遇到无法一笔充值达到有效的档位，可充值两次以上）充值成功未下注之前找专线客服专员申请。</p>
                                        <p>5. 每一个账号（同一ip，同一设备，同一姓名）视为一个账号，只能申请一次。</p>
                                        <p>6. 本活动最终解释权归德比所有。</p>
                                    </div>
                                </div>
                            </SwiperSlide>
                        </Swiper>
                    </div>
                    
                </div>
            </div>
        )
    }
}
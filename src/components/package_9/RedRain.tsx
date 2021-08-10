/*活动组件*/
import React from 'react'
import {gHandler} from '../../lib/gHandler'
import { Api } from '../../lib/Api';
import Axios from 'axios';
import {message, Button} from 'antd';
import "./RedRain.scss";
import {ConfigItem} from '../../interface/activity_interface';
interface Props {
    curData:ConfigItem
}
interface State {
    info:any,
    type:any
}
export default class RedRain extends React.Component<Props,State>{
    state = {
        info:{
            end_date:"",
            flow_rate:0,
            packetList:[{
                fortuna_red_packet:0,
                left:0,
                max:0,
                min:0,
                mintute:0,
                recharge:0,
                start:0,
                statement:0,
                total:0
            }]
        },
        type:[
            "春雨",
            "夏雨",
            "秋雨",
            "冬雨",
        ]
    }
    componentDidMount(){
        this.setState({
            info:this.props.curData.info
        })
        console.log(this.props.curData.info)
    }
    componentWillUnmount(){
        this.setState = (state,callback)=>{
            return
        }
    }
    render (){
        let rangeLine = ()=>{
            return  this.state.info.packetList.map((e:any,index:number) => {
                return <div className ="line" key={index}>
                    <div className ="li1 flexBox">{this.state.type[index]}</div>
                    <div className ="li2 flexBox">{gHandler.transitionTime(e.start)}</div>
                    <div className ="li3 flexBox"style={{
                        justifyContent:"space-around"
                    }}>
                        <span>{e.recharge}</span>
                        <span>{e.statement}</span>
                    </div>
                    <div className ="li4 flexBox">{e.total}</div>
                    <div className ="li5 flexBox">{e.min}</div>
                    <div className ="li6 flexBox">{e.max}</div>
                    <div className ="li7 flexBox"></div>
                </div>
            })
        }
        return (
            <div className ="RedRain" >
                <div className = "group">
                    <div className ="title">
                        <div className ="li1  flexBox" >四季发财红包雨</div>
                        <div className ="li2  flexBox" style={{
                            flexFlow:"column"
                        }} >
                            <div className ="li2 flexBox">下雨时间</div>
                            <div className ="li2 flexBox">每场{this.state.info.packetList[0].mintute}分钟</div>
                        </div>
                        <div className ="li3  flexBox" style={{
                            flexFlow:"column"
                        }} >
                            <div className ="li2 flexBox">领取条件</div>
                            <div className ="li2 flexBox" style={{
                                justifyContent:"space-around"
                            }}>
                                <span>充值</span>  <span>流水</span>
                            </div>
                        </div>
                        <div className ="li4  flexBox" >红包总额</div>
                        <div className ="li5  flexBox" >最小红包</div>
                        <div className ="li6  flexBox" >财神红包</div>
                        <div className ="li7  flexBox" >流水要求</div>
                    </div>
                    {
                        rangeLine()
                    }
                    <div className ="label1">{this.state.info.flow_rate}倍流水</div>
                    
                </div>
                <div className = "rule">
                    <p>1.每场红包雨下雨时间前达成领取条件, 即可参加这一场红包雨。</p>
                    <p>2.每场雨可随机获得最小红包至财神红包数额区间的随机数额红包。</p>
                    <p>3.当日存款、流水可累计, 所获红包{this.state.info.flow_rate}倍流水即可兑换。</p>
                </div>
            </div>
        )
    }
}
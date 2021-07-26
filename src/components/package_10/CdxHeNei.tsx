/*活动组件*/
import React from 'react'
import {gHandler} from '../../lib/gHandler'
import { Api } from '../../lib/Api';
import Axios from 'axios';
import {message, Button} from 'antd';
import "./CdxHeNei.scss";
import {ConfigItem} from '../../interface/activity_interface';
interface Props {
    curData:ConfigItem
}
interface State {
    info:any,
    game_count:number,
    is_received:number,
    btnActive :boolean,
}
export default class CdxHeNei extends React.Component<Props,State>{
    state = {
        info:{
            win:0,
            range:[
                {
                    bonus:0,
                    win_round:0
                }
            ],
            flow_rate:0
        },
        is_received:0,
        game_count:0,
        btnActive :false,
    }
    btnIndex= 0 
    componentDidMount(){
        this.setState({
            info:this.props.curData.info
        },()=>{
            console.log(this.state.info)
        })
        this.Axios_HandleQiQuWin()
        this.Axios_getRewardHeNeiWinFlag()
    }
    renderBtn(){
        if(this.state.is_received === 0 && this.state.game_count!==0){
            this.state.info.range.forEach((item,index)=>{
                if(this.state.game_count >= item.win_round) {
                    this.btnIndex = index
                    this.setState({
                        btnActive : true
                    })
                }
            })
        }
    }
    componentWillUnmount(){
        this.setState = (state,callback)=>{
            return
        }
    }
    onClick =(e:any)=>{
        this.Axios_receiveHandleHeNeiWin()
    }
    private async Axios_receiveHandleHeNeiWin(){
        let url = `${gHandler.UrlData.host}${Api.receiveHandleHeNeiWin}`;
        let data = new FormData();
        data.append('user_id',gHandler.UrlData.user_id);
        data.append('user_name',decodeURI(gHandler.UrlData.user_name));
        data.append('flag',`${1}`);
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
            this.Axios_getRewardHeNeiWinFlag();
        }else{
            message.error(response.msg)
        }
    }
    private async  Axios_HandleQiQuWin(){
        let gameHost = gHandler.UrlData.host.replace("pay","game")
        let url = `${gameHost}${Api.game_HandleQiQuWin}?user_id=${gHandler.UrlData.user_id}&level_amount=${this.state.info.win}&token=${gHandler.token}&center_auth=${gHandler.UrlData.center_auth}`;
        let response = await Axios.get(url).then(response=>{
            return response.data
        }).catch(err=>{
            return message.error("failed to load response data")
        })
        if( response.status === 0){
            this.setState({
                game_count:response.data.list.game_count,
            },()=>{
                this.renderBtn()
            })
        }else{
            message.error(response.msg)
        }
    }
    private async  Axios_getRewardHeNeiWinFlag(){
        let url = `${gHandler.UrlData.host}${Api.game_HandleQiQuWin}?user_id=${gHandler.UrlData.user_id}&activity_id=${this.props.curData.id}&token=${gHandler.token}&center_auth=${gHandler.UrlData.center_auth}`;
        let response = await Axios.get(url).then(response=>{
            return response.data
        }).catch(err=>{
            return message.error("failed to load response data")
        })
        if( response.status === 0){
            this.setState({
                is_received:response.data.is_received,
            },()=>{
                this.renderBtn()
            })
        }else{
            message.error(response.msg)
        }
    }
    render (){
        let rangeLine = ()=>{
            return  this.state.info.range.map((e:any,index:number) => {
                return <div className ="line" key={index}>
                    <div className ="li1 flexBox"></div>
                    <div className ="li2 flexBox">{e.win_round}局</div>
                    <div className ="li3 flexBox"></div>
                    <div className ="li4 flexBox">{e.bonus}</div>
                    <div className ="li5 flexBox"></div>
                    <div className ="li6 flexBox"> 
                        {
                            this.state.btnActive && this.btnIndex === index ?<div className = { this.state.is_received===1 ? `btn_Ylinqu`:"btn_linqu" } data-index={index} 
                                onClick={this.onClick}
                            ></div> :null
                        }
                    </div>
                </div>
            })
        }
        return (
            <div className ="CdxHeNei" style={{
                transform:`scale(${gHandler.getNodeScale()},${gHandler.getNodeScale()})`,
                marginLeft:gHandler.getLeftOff(),
                marginTop:gHandler.getTopOff()
            }}>
                <div className = "group">
                    <div className ="line">
                        <div className ="li1 flexBox" style={{color:"#4D5F95"}}>游戏房间</div>
                        <div className ="li2 flexBox" style={{color:"#4D5F95"}}>连赢局数</div>
                        <div className ="li3 flexBox" style={{color:"#4D5F95"}}>每局净盈利</div>
                        <div className ="li4 flexBox" style={{color:"#4D5F95"}}>彩金</div>
                        <div className ="li5 flexBox" style={{color:"#4D5F95"}}>流水要求</div>
                        <div className ="li6 flexBox"></div>
                    </div>
                    {
                        rangeLine()
                    }
                    <div className ="label1">河内分分彩</div>
                    <div className ="label2 flexBox">不低于{this.state.info.win}金币</div>
                    <div className ="label3">彩金{this.state.info.flow_rate}倍流水</div>
                </div>
                <div className = "rule">
                    <p>1. 本活动需先绑定好手机号码与银行卡后才能参与，平台中的老玩家活动只能参加其中一个。</p>
                    <p>2. 活动限制：<span style={{color:"#E3FD00"}}>仅限分分彩猜大小-河内分分彩房间</span></p>
                    <p>3. 在<span style={{color:"#E3FD00"}}>规定游戏中单局净盈利不低于1000金币</span>，依照连赢局数前往本活动界面进行领取活动彩金。</p>
                    <p>4. 每天只能领取一次， 超过23:59:59符合条件不进行领取则视为自动放弃。</p>
                    <p>5. 同一用户（同IP同设备视为同一用户）仅限参加一次活动，活动彩金需10倍流水方可申请兑换。</p>
                    <p>6. 平台拥有最终解释权，严禁一切恶意行为，出现违规情况，一律封号处理；同时平台有权根据实际情况，随时调整活动内容。</p>
                </div>
            </div>
        )
    }
}
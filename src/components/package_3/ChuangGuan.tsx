/*活动组件*/
import React from 'react'
import {gHandler} from '../../lib/gHandler'
import { Api } from '../../lib/Api';
import Axios from 'axios';
import {message, Button} from 'antd';
import "./ChuangGuan.scss";
import {ConfigItem} from '../../interface/activity_interface';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
// Import Swiper styles
import 'swiper/swiper.scss';
interface Props {
    curData:ConfigItem
}
interface State {
    today_statement:number
    levelArr:any,
    progress:number,
    remainingGold :any,//今日剩余可领金币
    remainingLevel:any,//今日剩余可领的那几个档次
    is_received:number,
    activeArr:number[],
    historylist:any,
    showHistory:Boolean
}
export default class Fxpyq extends React.Component<Props,State>{
    state = {
        today_statement:0,
        levelArr:[],
        progress:0,
        is_received:0,
        remainingGold :0,//今日剩余可领金币
        remainingLevel:[],//今日剩余可领的那几个档次
        activeArr:[10],
        historylist:[],
        showHistory:false
    }
    
    componentDidMount(){
        let arr :any= []
        arr.push(this.props.curData.info.level_1)
        arr.push(this.props.curData.info.level_2)
        arr.push(this.props.curData.info.level_3)
        arr.push(this.props.curData.info.level_4)
        arr.push(this.props.curData.info.level_5)
        this.setState({
            levelArr:arr
        },()=>{
            this.Axios_receiveGoldInfo()
        })
        console.log(this.props.curData.info)
    }
    componentWillUnmount(){
        this.setState = (state,callback)=>{
            return
        }
    }
    onClick =(e:any)=>{
        this.Axios_receiveGold()
    }
    onClickHistory =(e:any)=>{
        this.setState({
            showHistory:true
        })
        this.Axios_activityList()
    }
    onCloseHistory =(e:any)=>{
        this.setState({
            showHistory:false
        })
    }
    private async  Axios_receiveGoldInfo(){
        let url = `${gHandler.UrlData.host}${Api.receiveGoldInfo}?user_id=${gHandler.UrlData.user_id}&activity_id=${this.props.curData.id}&package_id=${gHandler.UrlData.package_id}&token=${gHandler.token}&center_auth=${gHandler.UrlData.center_auth}`;
        let response = await Axios.get(url).then(response=>{
            return response.data
        }).catch(err=>{
            return message.error("failed to load response data")
        })
        if(response.status === 0){
            this.setState({
                today_statement:response.data.today_statement,
            })
            this.setStatement(response.data.receive_info)
        }else{
            message.error(response.msg)
        }
    }
    private async  Axios_activityList(){
        let url = `${gHandler.UrlData.host}${Api.activityList}?user_id=${gHandler.UrlData.user_id}&activity_id=${this.props.curData.id}&package_id=${gHandler.UrlData.package_id}&page=1&limit=10&token=${gHandler.token}&center_auth=${gHandler.UrlData.center_auth}`;
        let response = await Axios.get(url).then(response=>{
            return response.data
        }).catch(err=>{
            return message.error("failed to load response data")
        })
        if(response.status === 0){
            this.addList(response.data)
        }else{
            message.error(response.msg)
        }
    }
    //领取
    private async Axios_receiveGold(){
        let level = this.state.remainingLevel.join();
        let url = `${gHandler.UrlData.host}${Api.receiveGold}`;
        let data = new FormData();
        data.append('user_id',gHandler.UrlData.user_id);
        data.append('user_name',decodeURI(gHandler.UrlData.user_name));
        data.append('package_id',gHandler.UrlData.package_id);
        data.append('activity_id',this.props.curData.id);
        data.append('activity_name',this.props.curData.name);
        data.append('level',level);
        data.append('gold',`${this.state.remainingGold}`);
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
            this.Axios_receiveGoldInfo()
        }else{
            message.error(response.msg)
        }
    }
    render (){
        let rangeHistory = ()=>{
            return  this.state.historylist.map((e:any,index:number)=>{
                return <div className ="line2" key={index}>
                    <div className="li">{e.date}</div>
                    <div className="li">{e.statement}</div>
                    <div className="li">{e.gold}</div>
                    <div className="li">{e.time}</div>
                </div>
            })
        }
        let rangeLine = ()=>{
            return  this.state.levelArr.map((e:any,index:number) => {
                return <div className ={`item ${this.state.activeArr.indexOf(index)>-1?"activeBg":""}`} key={index}>
                    <div className ="li1 flexBox">{e.gold}</div>
                    <div className ="li2 flexBox">{e.statement}</div>
                </div>
            })
        }
        let GoldHistory = ()=>{
            return  <div className="GoldHistory" >
                <div className="title"></div>
                <div className="closeBtn" onClick={this.onCloseHistory}></div>
                <div className="line1">
                    <div className="li li1" style={{color:"#FEFFC9"}}></div>
                    <div className="li li2" style={{color:"#FEFFC9"}}></div>
                    <div className="li li3" style={{color:"#FEFFC9"}}></div>
                    <div className="li li4" style={{color:"#FEFFC9"}}></div>
                </div>
                <div className="db2">
                    {
                        rangeHistory()
                    }
                </div>
                
            </div>
        }
        return (
            <div className ="ChuangGuan">
                <div  className ="title"></div>
                <div className ="rule">
                    <p>1、每日通过游戏, 输赢均可产生同等额度的流水。</p>
                    <p>2、当日流水达到指定的档位, 即可领取活动规定的相应金币。</p>
                    <p>3、每日23:59:59, 活动计算用的当日流水归零。</p>
                </div>
                <div className="btn_history" onClick={this.onClickHistory}></div>
                <div className="group">
                    {
                        rangeLine()
                    }
                </div>
                <div className="progress">
                    <div className="progressBar" style={{
                        width:`${this.state.progress}rem`
                    }}></div>
                </div>
                <div className ="jinri"></div>
                <div className ="statement">{this.state.today_statement}</div>
                <div className ="foot">
                    <div className="jrkl"></div>
                    <div className ="txt_jinbi"></div>
                    <div className ="goldlabel">{this.state.remainingGold}</div>
                    <div className={`btn_lingqu ${this.state.is_received === 1?"btn_lingqu_done":""}`} onClick={this.onClick}></div>
                </div>
                {
                    this.state.showHistory ? GoldHistory():null
                }
            </div>
        )
    }
    addList(data:any){
        let list :any = []
        data.forEach((item:any) => {
            let date = item.receive_date;
            let time = Number(item.created_at);
            let info = JSON.parse(item.receive_info);
            let gold = 0;
            let statement = 0;
            for(var k in info){
                if(info[k].time>= time){
                    gold += Number(info[k].gold);//保存金币
                    statement = statement < info[k].statement ? info[k].statement :statement;//保存最大的流水
                }
            }
            list.push({
                date,
                statement,
                gold,
                time,
            })
        });
        console.log("list",list)
        this.setState({
            historylist:list
        })
    }
    private setStatement(info:any){
        console.log("setStatement",info)
        let remainingLevel = []//清空上一轮
        let remainingGold = 0//清空上一轮
        let is_received = 0
        let activeArr :number[]= []
        this.state.levelArr.forEach((item:any,index)=>{
           
            let infoItem = info[`level_${index+1}`]
            item.gold = infoItem.gold
            item.statement = infoItem.statement
            if(Number(infoItem.statement) <= this.state.today_statement && infoItem.has_receive!==1){
                activeArr.push(index)
            }
        })
        for(var k in info){
            if((Number(info[k].statement) <= this.state.today_statement) && info[k].has_receive===0){
                remainingGold += Number(info[k].gold);
                remainingLevel.push(k.substr(-1,1))//将level最后一位数字截取，放入数组
            }
        }
        if(remainingLevel.length > 0){
            is_received = 0
        }else{
            is_received = 1;
        }
        this.setState({
            remainingLevel,
            remainingGold,
            is_received,
            activeArr,
        })
        this.mathProgress(info);
    }
    private mathProgress(info:any){
        var progress = 0;
        var lastKey = '';
        var step = 0
        for(var k in info){ 
            if(lastKey === ''){
                //lastKey为空，说明是第一个区间,statement = 0;
                step = (this.state.today_statement / info[k].statement )*0.1;
                if (step > 0.1) {
                    step = 0.1
                };
                lastKey = k;
                progress += step;
            }else if(info[k].statement<this.state.today_statement){
                progress += 0.2;
                lastKey = k;
            }else{
                step = ((this.state.today_statement-info[lastKey].statement) / (info[k].statement - info[lastKey].statement))*0.2;
                progress += step;
                break;
            }
        }
        if(info["level_5"].statement<this.state.today_statement){
            step = (this.state.today_statement - info["level_5"].statement) /info["level_5"].statement*0.1;
            if(step>0.1) {
                step = 0.1
            }
            progress += step;

        }
        if(this.state.today_statement === 0){
            progress = 0
        }
        console.log("today_statement",this.state.today_statement,"progress",progress)
        this.setState({
            progress:progress*8
        })
    }
}
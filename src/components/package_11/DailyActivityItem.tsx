/*活动组件*/
import React from 'react'
import {message, Button} from 'antd';
import "./DailyActivity.scss";
export interface ActivityData {
    game_id:string,
    task_id:string,
    item:{
        integral:number,
        rounds:number,
        winround:number,
        game_statement:number,
        gold:number
    }
}
interface Props {
    data:ActivityData,
    Detail:any,
    Axios_getTask:Function,
}
interface State {
    game_id:string,
    task_id:string,
    type:string,
    roomLevel:string,
    gameLabel:string,
    targetLabel:string,
    rewardLabel:string,
    integralActive:boolean,
    progressTotal:number,
    progressCurrent:number,
    progress:number,
    btnType:string,
}
export default class DailyActivity extends React.Component<Props,State>{
    state = {
        game_id:"",
        task_id:"",
        type:"",
        roomLevel:"",
        gameLabel:"",
        targetLabel:"",
        rewardLabel:"",
        integralActive:false,
        progressTotal:0,
        progressCurrent:0,
        progress:0,
        btnType:"",
    }
    componentDidMount(){
        this.setState({
            game_id:this.props.data.game_id,
            task_id:this.props.data.task_id,
            type:this.props.data.task_id.slice(0,1),
            roomLevel:this.props.data.task_id.slice(-1),
        },()=>{
            this.setLabel()
            
        })
    }
    componentWillUnmount(){
        this.setState = (state,callback)=>{
            return
        }
    }
    onClick =(e:any)=>{
        if(this.state.btnType ==="lingquBtn"){
            let self = this
            this.props.Axios_getTask(self.state.game_id,self.state.task_id,()=>{
                self.setState({
                    btnType:"lingquDoneBtn"
                })
            })
        }else if(this.state.btnType === "goToBtn"){
            message.info("请先返回游戏大厅进入游戏完成任务！")
        }else{
            message.info("不能重复领取任务，请明天再来！")
        }
        
    }
    render (){
        return (
            <div className ="DailyActivityItem">
                <div className="icon"></div>
                <div className="gameLabel">{this.state.gameLabel}</div>
                <div className={`rewardLabel flexBox ${this.state.integralActive ?"fen":"jb"}`}><span>{this.state.rewardLabel}</span></div>
                <div className="progress">
                    <div className="progressBar" style={{
                        width:`${this.state.progress}rem`
                    }}></div>
                </div>
                <div className="targetlabel">{this.state.targetLabel}</div>
                <div className="progresslabel">{this.state.progressCurrent}/{this.state.progressTotal}</div>
                <div className={`btn ${this.state.btnType ==="lingquBtn" ?"lingquBtn":this.state.btnType ==="goToBtn" ?"goToBtn":"lingquDoneBtn"}`} onClick={this.onClick}></div>
            </div>
        )
    }
    setLabel(){
        var gameName = this.switchGameId(this.state.game_id)
        var roomLevelName = this.switchRoomLevel(this.state.roomLevel)
        let gameLabel = `${gameName}${roomLevelName}`
        let targetLabel = ''
        let rewardLabel = ''
        let integralActive = false;
        let progressTotal = 0;
        if(this.state.type === "1"){
            //总局+积分
            targetLabel = `在${gameLabel}中完成${this.props.data.item.rounds}局`;
            rewardLabel = `${this.props.data.item.integral}`;
            integralActive = true;
            progressTotal = this.props.data.item.rounds;
        }else if(this.state.type === "2"){
            //总局+金币
            targetLabel = `在${gameLabel}中完成${this.props.data.item.rounds}局`;
            rewardLabel = `${this.props.data.item.gold}`
            integralActive = false 
            progressTotal = this.props.data.item.rounds
        }else if(this.state.type === '3'){
            //赢局 + 积分 
            targetLabel = `在${gameLabel}中胜利${this.props.data.item.winround}局`;
            rewardLabel = `${this.props.data.item.integral}`
            integralActive = true // 
            progressTotal = this.props.data.item.winround
        }else if(this.state.type ==='4'){
            //赢局 +  金币
            targetLabel = `在${gameLabel}中胜利${this.props.data.item.winround}局`;
            rewardLabel = `${this.props.data.item.gold}`
            integralActive= false // 
            progressTotal = this.props.data.item.winround
        }else if(this.state.type === '5'){
            //流水 + 积分 
            targetLabel = `在${gameName}${roomLevelName}中累计达到${this.props.data.item.game_statement}流水`
            rewardLabel= `${this.props.data.item.integral}`
            integralActive = true // 
            progressTotal = this.props.data.item.game_statement
        }else if(this.state.type === '6'){
            //流水 + 金币
            targetLabel = `在${gameName}${roomLevelName}中累计达到${this.props.data.item.game_statement}流水`
            rewardLabel = `${this.props.data.item.gold}`
            integralActive = false // 
            progressTotal = this.props.data.item.game_statement
        }
        this.setState({
            gameLabel,
            targetLabel,
            rewardLabel,
            integralActive,
            progressTotal
        },()=>{
            this.setDetail()
        })
    }
    setDetail(){
        let isReceive = false
        this.props.Detail.received_task.forEach((e:any )=> {
            //数组里存在，则表示已领取
            let item = JSON.parse(e)
            if(item.task_id === this.state.task_id && item.game_id === this.state.game_id){
                isReceive = true
            }
        });
        let progressCurrent = 0
        let GameData_task = {
            "win_num" :0,
            "lose_num": 0,
            "win_gold": 0,
            "lose_gold": 0,
            "game_flow": 0
        }
        for(var key in this.props.Detail["game"]){
            if(key === this.state.game_id){
                for(var task_id  in this.props.Detail['game'][key]){
                    if(task_id === this.state.task_id){
                        GameData_task =  this.props.Detail["game"][this.state.game_id][this.state.task_id]
                    }
                }
            }
        }
        if(this.state.type === '1' || this.state.type === "2"){
            //总输加总赢
            progressCurrent = GameData_task.win_num+GameData_task.lose_num
            
        }else if(this.state.type === '3' || this.state.type ==='4'){
            //总赢
            progressCurrent = GameData_task.win_num
        }else if(this.state.type === '5' || this.state.type ==='6'){
            //流水
            progressCurrent = GameData_task.game_flow
        }
        
        let progress = progressCurrent/this.state.progressTotal*4
        if(progress>=4){
            progress = 4
        }
        let btnType = ""
        if(progressCurrent >= this.state.progressTotal){
            if(!isReceive){
                btnType ="lingquBtn"
            }else{
                btnType="lingquDoneBtn"
            }
        }else{
            btnType ="goToBtn"
        }
        this.setState({
            progress,
            btnType,
            progressCurrent
        })
    }
    switchRoomLevel(key:string){
        switch (key) {
        case '1':
            return `体验场`
        case '2' :
            return `初级场`
        case '3':
            return `中级场`
        case '4':
            return `高级场`
        default :
            console.log('房间等级错误',key)
            return ""
        }
    }
    switchGameId(Gameid:string){
        switch(Gameid) {
        case "5b1f3a3cb76a591e7f251715" :
            return `炸金花`
        case "5b1f3a3cb76a591e7f251711" :
            return `斗地主`
        case "5c6a62be7ff09a54amb446aa" :
            return `跑得快`
        case "5b1f3a3cb76a591e7f25170" :
            return `二人麻将`
        case "5b1f3a3cb76a591e7f251714" :
            return `抢庄牛牛`
        case "5b1f3a3cb76a591e7f25171" :
            return `十三水`
        case "5b1f3a3cb76a591e7f25176" :
            return `德州扑克`
        case "5b1f3a3cb76a591e7f251732" :
            return `梭哈`
        default :
            return ""
        }
    }
}
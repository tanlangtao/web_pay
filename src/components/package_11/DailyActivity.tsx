/*活动组件*/
import React from 'react'
import {gHandler} from '../../lib/gHandler'
import { Api } from '../../lib/Api';
import Axios from 'axios';
import {message, Button} from 'antd';
import "./DailyActivity.scss";
import {ConfigItem} from '../../interface/activity_interface';
import DailyActivityItem from "./DailyActivityItem";
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
// Import Swiper styles
import 'swiper/swiper.scss';
interface Props {
    curData:ConfigItem
}
interface State {
    Detail:any,
    mapArray:any
}
export default class DailyActivity11 extends React.Component<Props,State>{
    state = {
        mapArray:[],
        Detail:{}
    }
    btnIndex= 0 
    info :any={
        flow_rate:0,
        game:{
            "5b1f3a3cb76a591e7f25170":{
                "101":{
                    rounds:0,
                    integral:0
                }
            }
        }
    }
    ActivityConfig :any=[]
    componentDidMount(){
        this.info = this.props.curData.info
        this.setActivityConfig()
        console.log(this.info)
        this.Axios_dayTaskDetail()
    }
    componentWillUnmount(){
        this.setState = (state,callback)=>{
            return
        }
    }
    private async  Axios_dayTaskDetail(){
        let url = `${gHandler.UrlData.host}${Api.dayTaskDetail}?user_id=${gHandler.UrlData.user_id}&activity_id=${this.props.curData.id}&package_id=${gHandler.UrlData.package_id}&token=${gHandler.token}&center_auth=${gHandler.UrlData.center_auth}`;
        let response = await Axios.get(url).then(response=>{
            return response.data
        }).catch(err=>{
            return message.error("failed to load response data")
        })
        if(response.status === 0){
            this.setState({
                Detail:response.data
            })
        }else{
            message.error(response.msg)
        }
    }
    //领取
    private async Axios_getTask(game_id:string,task_id:string,callBack = ()=>{}){
        let url = `${gHandler.UrlData.host}${Api.getTask}`;
        let data = new FormData();
        data.append('user_id',gHandler.UrlData.user_id);
        data.append('user_name',decodeURI(gHandler.UrlData.user_name));
        data.append('package_id',gHandler.UrlData.package_id);
        data.append('activity_id',this.props.curData.id);
        data.append('game_id',game_id);
        data.append('task_id',task_id);
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
            this.Axios_dayTaskDetail()
            callBack()
        }else{
            message.error(response.msg)
        }
    }
    setActivityConfig(){
        for(var game_id in this.info['game'] ){
            for( var task_id in this.info['game'][game_id]){
                var item = this.info['game'][game_id][task_id]
                let data = {
                    game_id : game_id,
                    task_id :task_id,
                    item :item,
                }
                this.ActivityConfig.push(data)
                this.setState({
                    mapArray:this.ActivityConfig
                })
            }
        }
        this.render()
    }
    render (){
        if(JSON.stringify(this.state.Detail )=== "{}"){
            return <div></div>
        }
        let rangeLine = ()=>{
            return this.state.mapArray.map((e:any,index:number) => {
                return <SwiperSlide key={index}>
                    <DailyActivityItem  data={e} Detail={this.state.Detail} Axios_getTask={this.Axios_getTask.bind(this)}></DailyActivityItem>
                </SwiperSlide>
                
            })
        }
        return (
            <div className ="DailyActivity11" >
                <div className="Swiper">
                    <Swiper
                        direction={"vertical"}
                        spaceBetween={10}
                        height={170*gHandler.getHeightDiff()}
                        // onSlideChange={() => console.log('slide change')}
                        // onSwiper={(swiper) => console.log(swiper)}
                    >
                        {rangeLine()}
                    </Swiper>
                </div>
            </div>
        )
    }
}
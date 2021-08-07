import React ,{Component} from 'react';
import { Layout, Menu, Icon, message } from 'antd';
import { gHandler } from './../../../lib/gHandler';
import { Api } from '../../../lib/Api';
import Axios from 'axios';
import {ConfigItem} from '../../../interface/activity_interface';
import './Activity.scss';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
// Import Swiper styles
import 'swiper/swiper.scss';
import Xyhschd11 from 'components/package_11/Xyhschd';
import Lyhsc11 from 'components/package_11/Lyhsc';
import RedRain11 from 'components/package_11/RedRain';
import Bytghl from 'components/package_11/Bytghl';
import DailyActivity11 from 'components/package_11/DailyActivity';
import DailySign11 from 'components/package_11/DailySign';
import FirstComponent from '../../../FirstComponent';
interface State{
    loading:Boolean,
    navArr :ConfigItem[],
    title :string,
    curData:ConfigItem
}
export default class Activity11 extends Component<{}, State> {
    state = {
        navArr:[],
        title:'',
        curData:{
            id:"",
            info:"",
            name:"",
            is_close:"",
            order_by:"",
        },
        loading:false
    }
    componentWillMount(){
        this.setState({
            loading:true
        })
    }
    componentDidMount(){
        this.setState({
            loading:false
        })
        this.AxiosIndex()
    }
    //请求首页
    private async  AxiosIndex(){
        let url = `${gHandler.UrlData.host}${Api.activityConfig}?package_id=${gHandler.UrlData.package_id}&token=${gHandler.token}&center_auth=${gHandler.UrlData.center_auth}`;
        let response = await Axios.get(url).then(response=>{
            return response.data
        }).catch(err=>{
            return message.error("failed to load response data")
        })
        if(response.status === 0){
            this.setNavArr(response.data)
        }else{
            message.error(response.msg)
        }
    }
    private setNavArr(data:ConfigItem[]){
        let navArr:ConfigItem[] = []
        data.forEach(e=>{
            if(e.info !== "" && e.info !== "{}"){
                e.info = JSON.parse(e.info)
            }else{
                console.log("请检查配置信息！",e.name)
            }
            if(e.is_close === "2"){
                navArr.push(e)
            } 
        })
        navArr.sort((a,b)=>Number(a.order_by)-Number(b.order_by));
        this.setState({
            navArr:navArr,
            curData:navArr[0],
            title:navArr[0].name
        })
    }
    returnToHall(){
        gHandler.closewebview()
    }
    render() {
        //渲染左侧导航
        let mapNav=()=>{
            return this.state.navArr.map((item:ConfigItem,index)=>{
                return <SwiperSlide 
                    key={index} 
                >
                    <div  onClick={()=>{
                        this.setState({
                            title:item.name,
                            curData:item
                        })
                        console.log("点击nav",item.name)
                    }} className={`navItem flexBox ${item.name ===this.state.title?"curNavItem":"" } ${this.state.title===""&&index ===0?"curNavItem":""}`}>
                        <div className = "btnline"></div>
                        <div className={`navText ${
                            item.name==="捕鱼通关豪礼11"?(item.name ===this.state.title ?"btn_bytghl1":"btn_bytghl2"):
                                item.name==="新用户首存活动11"?(item.name ===this.state.title ?"btn_db_xyhsccj1":"btn_db_xyhsccj2"):
                                    item.name==="老会员每日首存活动11"?(item.name ===this.state.title ?"btn_lhyschd1":"btn_lhyschd2"):
                                        item.name==="四季发财红包雨11"?(item.name ===this.state.title ?"btn_redRain1":"btn_redRain2"):
                                            item.name==="幸运轮盘11"?(item.name ===this.state.title ?"btn_xyzp1":"btn_xyzp2"):
                                                item.name==="每日任务11"?(item.name ===this.state.title ?"btn_dailyMission1":"btn_dailyMission2"):   
                                                    item.name==="每日签到11"?(item.name ===this.state.title ?"btn_qd1":"btn_qd2"):""
                        }`} ></div>
                    </div>
                </SwiperSlide>
            })
        }
        if(this.state.curData.id ===""){
            return <div></div>
        }
        return (
            !this.state.loading?<div className='activity11'>
                <div className='headerBox' >
                    <div className="returnToHall" onClick={this.returnToHall}></div>
                    <div className={`title ${
                        this.state.title==="捕鱼通关豪礼11"?"dm_title_bytghl":
                            this.state.title==="新用户首存活动11"?"dm_title_xyhsc":
                                this.state.title==="老会员每日首存活动11"?"dm_title_lhyschd":
                                    this.state.title==="四季发财红包雨11"?"db_redrain":
                                        this.state.title==="幸运轮盘11"?"xingyunlunpan":
                                            this.state.title==="每日任务11"?"dm_title":   
                                                this.state.title==="每日签到11"?"mrqd":""
                    }`} ></div>
                </div>
                <div className ="contentBox">
                    <div
                        className='sider' style={{
                            transform:`scale(${gHandler.getNodeScale()},${gHandler.getNodeScale()})`,
                            marginTop:gHandler.getTopOff()
                        }}>
                        <div className="navBox">
                            <Swiper
                                direction={"vertical"}
                                spaceBetween={0}
                                height={100*gHandler.getHeightDiff()}
                                // onSlideChange={() => console.log('slide change')}
                                // onSwiper={(swiper) => console.log(swiper)}
                            >
                                {mapNav()}
                            </Swiper>
                        </div>
                    </div>
                    <div className="content" style={{
                        transform:`scale(${gHandler.getNodeScale()},${gHandler.getNodeScale()})`,
                        marginLeft:gHandler.getLeftOff(),
                        marginTop:gHandler.getTopOff()
                    }}>
                        {
                            (this.state.title==='捕鱼通关豪礼11' ? <Bytghl curData={this.state.curData}/>:
                                (this.state.title==='四季发财红包雨11' ? <RedRain11 curData={this.state.curData}/>:
                                    (this.state.title==='老会员每日首存活动11' ? <Lyhsc11 curData={this.state.curData}/>:
                                        (this.state.title==='新用户首存活动11' ? <Xyhschd11 curData={this.state.curData}/>:
                                            (this.state.title==='每日任务11' ? <DailyActivity11 curData={this.state.curData}/>:
                                                (this.state.title==='每日签到11' ? <DailySign11 curData={this.state.curData}/>:
                                                    <div></div>
                                                )   
                                            )
                                        )
                                    )
                                )
                            )
                        }
                    </div>
                </div>
            </div>
                :<FirstComponent></FirstComponent>
        )
    }
}
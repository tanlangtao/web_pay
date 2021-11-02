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
import Bwfcjl from 'components/package_9/Bwfcjl';
import FfcBpQiQu from 'components/package_9/FfcBpQiQu';
import Xyhschd from 'components/package_9/Xyhschd';
import Lyhsc from 'components/package_9/Lyhsc';
import Lyhbp from 'components/package_9/Lyhbp';
import RedRain from 'components/package_9/RedRain';
import Ryjhd from 'components/package_9/Ryjhd';
import UsdtCunKuan from 'components/package_9/UsdtCunKuan';
import Xyhbpdfs from 'components/package_9/Xyhbpdfs';
import DailySign from 'components/package_9/DailySign';
import DailyActivity from 'components/package_9/DailyActivity';
import FirstComponent from '../../../FirstComponent';
const { Header, Content, Sider } = Layout;

interface State{
    navArr :ConfigItem[],
    title :string,
    curData:ConfigItem,
    loading:Boolean
}
export default class Activity9 extends Component<{}, State> {
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
        loading:true
    }
    componentDidMount(){
        this.setState({
            loading:false
        })
        if(this.getLocal()){
            this.setNavArr(this.getLocal().data)
        }else{
            this.AxiosIndex()
        }
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
            this.setLocal(response.data)
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
        if(navArr.length>0){
            this.setState({
                navArr:navArr,
                curData:navArr[0],
                title:navArr[0].name
            })
        }
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
                    }} className={`navItem ${item.name ===this.state.title?"curNavItem":"" } ${this.state.title===""&&index ===0?"curNavItem":""}`}>
                        <div className="navText flexBox">
                            <p>{item.name.length<=5?item.name.substring(0,item.name.length-1):item.name.substring(0,item.name.length-1).substring(0,5)}</p>
                            <p>{item.name.substring(0,item.name.length-1).length>5?item.name.substring(5,item.name.length-1):""}</p>
                        </div>
                        <div className="xian_dh"></div>
                    </div>
                </SwiperSlide>
            })
        }
        if(this.state.curData.id ===""){
            return <div className='activity9'>
                <div className='headerBox' >
                    {/* <div className="returnToHall" onClick={this.returnToHall}></div> */}
                </div>
            </div>
        }
        return (
            !this.state.loading?<div className='activity9'>
                <div className='sider' style={{
                    zIndex:2,
                    transform:`scale(${gHandler.getFontsizeScale()})`,
                    marginTop:`${gHandler.getFontsizeScale()===1?"0px":`${80/gHandler.getFontsizeScale()}px` }`
                }}>
                    {/* <div className='headerBox' >
                        <div className='title_jchd'></div>
                    </div> */}
                    <div className="navBox">
                        <Swiper
                            direction={"vertical"}
                            spaceBetween={0}
                            height={70*gHandler.getHeightDiff()}
                            // onSlideChange={() => console.log('slide change')}
                            // onSwiper={(swiper) => console.log(swiper)}
                        >
                            {mapNav()}
                            <SwiperSlide></SwiperSlide>
                            <SwiperSlide></SwiperSlide>
                            <SwiperSlide></SwiperSlide>
                            <SwiperSlide></SwiperSlide>
                            <SwiperSlide></SwiperSlide>
                        </Swiper>
                    </div>
                </div>
                <div className="content"style={{
                    zIndex:1,
                    transform:`scale(${gHandler.getFontsizeScale()})`,
                    marginLeft:`${gHandler.getFontsizeScale()===1?"0px":`${-60/gHandler.getFontsizeScale()}px` }`,
                    marginTop:`${gHandler.getFontsizeScale()===1?"0px":`${80/gHandler.getFontsizeScale()}px` }`
                }}>
                    {
                        this.state.title==='百万扶持奖励9' ? <Bwfcjl curData={this.state.curData}/>:
                            (this.state.title==="分分彩猜大小奇趣包赔9"?<FfcBpQiQu curData={this.state.curData}/>:
                                (this.state.title === "新用户首存活动9" ? <Xyhschd curData={this.state.curData}/>:
                                    (this.state.title === "老会员每日首存活动9" ? <Lyhsc curData={this.state.curData}/>:
                                        (this.state.title === "老用户包赔活动9" ? <Lyhbp curData={this.state.curData}/>:
                                            (this.state.title === "四季发财红包雨9" ? <RedRain curData={this.state.curData}/>:
                                                (this.state.title === "日业绩活动9" ? <Ryjhd curData={this.state.curData}/>:
                                                    (this.state.title === "USDT存款大礼包9" ? <UsdtCunKuan curData={this.state.curData}/>:
                                                        (this.state.title === "新用户包赔大放送9" ? <Xyhbpdfs curData={this.state.curData}/>:
                                                            (this.state.title === "每日签到9" ? <DailySign curData={this.state.curData}/>:
                                                                (this.state.title === "每日任务9" ? <DailyActivity curData={this.state.curData}/>:
                                                                    <div></div>
                                                                )
                                                            )
                                                        )
                                                    )
                                                )
                                            )
                                        )
                                    )
                                )
                            )
                    }
                </div>
                {/* <div className="returnToHall" onClick={this.returnToHall}></div> */}
            </div>
                :<FirstComponent></FirstComponent>
        )
    }
    getLocal(){
        let local = localStorage.getItem(`ActivityConfig_${gHandler.UrlData.package_id}`)
        if(local){
            let content = JSON.parse(local)
            let newTime = new Date().getTime()/1000
            //超过3小时，重新请求数据
            if((newTime - content.time) <600){
                return content
            }else{
                return false
            }
        }else{
            return false
        }
    }
    setLocal(data:ConfigItem[]){
        let newTime = new Date().getTime()/1000
        let content = {
            time: newTime,
            data :data
        }
        localStorage.setItem(`ActivityConfig_${gHandler.UrlData.package_id}`,JSON.stringify(content))
    }
}
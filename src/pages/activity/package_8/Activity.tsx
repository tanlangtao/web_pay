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
import RedRain8 from 'components/package_8/RedRain';
import Lyhsc8 from 'components/package_8/Lyhsc';
import FirstComponent from '../../../FirstComponent';
interface State{
    navArr :ConfigItem[],
    title :string,
    curData:ConfigItem,
    loading:Boolean
}
export default class Activity8 extends Component<{}, State> {
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
            if(e.is_close === "2" && (e.name === "四季发财红包雨8" ||e.name === "老会员每日首存活动8")){
                navArr.push(e)
            } 
        })
        navArr.sort((a,b)=>Number(a.order_by)-Number(b.order_by));
        console.log(navArr)
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
                    }} className={`navItem flexBox ${item.name ===this.state.title?"curNavItem":"" } ${this.state.title===""&&index ===0?"curNavItem":""}`}>
                        <div className={`navText ${
                            item.name==="四季发财红包雨8"?(item.name ===this.state.title ?"btn_redRain1":"btn_redRain2"):
                                item.name==="老会员每日首存活动8"?(item.name ===this.state.title ?"btn_lyhbc1":"btn_lyhbc2"):""
                        }`} ></div>
                    </div>
                </SwiperSlide>
            })
        }
        if(this.state.curData.id ===""){
            return <div className='activity8'>
                {/* <div className='headerBox' >
                    <div className="returnToHall" onClick={this.returnToHall}></div>
                </div> */}
            </div>
        }
        return (
            !this.state.loading?<div className='activity8'>
                {/* <div className='headerBox' >
                    <div className="returnToHall" onClick={this.returnToHall}></div>
                    <div className={`title ${
                        this.state.title==="四季发财红包雨8"?"db_redrain":
                            this.state.title==="老会员每日首存活动8"?"event_xl_lyhsc_title":""
                    }`} ></div>
                </div> */}
                <div className ="contentBox">
                    <div className='sider' style={{
                        transform:`scale(${gHandler.getFontsizeScale()})`,
                        marginTop:`${gHandler.getFontsizeScale()===1?"0px":`${40/gHandler.getFontsizeScale()}px` }`
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
                                <SwiperSlide></SwiperSlide>
                                <SwiperSlide></SwiperSlide>
                                <SwiperSlide></SwiperSlide>
                                <SwiperSlide></SwiperSlide>
                                <SwiperSlide></SwiperSlide>
                            </Swiper>
                        </div>
                    </div>
                    <div className="content"style={{
                        transform:`scale(${gHandler.getFontsizeScale()})`,
                        marginLeft:`${gHandler.getFontsizeScale()===1?"0px":`${-60/gHandler.getFontsizeScale()}px` }`,
                        marginTop:`${gHandler.getFontsizeScale()===1?"0px":`${40/gHandler.getFontsizeScale()}px` }`
                    }}>
                        {
                            (this.state.title==='四季发财红包雨8' ? <RedRain8 curData={this.state.curData}/>:
                                (this.state.title==='老会员每日首存活动8' ? <Lyhsc8 curData={this.state.curData}/>:
                                    <div></div> 
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
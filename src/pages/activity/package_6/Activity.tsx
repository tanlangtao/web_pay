import React ,{Component} from 'react';
import { Layout, Menu, Icon, message } from 'antd';
import { gHandler } from './../../../lib/gHandler';
import { Api } from '../../../lib/Api';
import Axios from 'axios';
import {ConfigItem} from '../../../interface/activity_interface';
import '../package_11/Activity.scss';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
// Import Swiper styles
import 'swiper/swiper.scss';
import FirstComponent from '../../../FirstComponent';
import Xyhschd6 from 'components/package_6/Xyhschd';
import Lyhsc6 from 'components/package_6/Lyhsc';
import Zcsyj from 'components/package_6/Zcsyj';
import Xyhbp6 from 'components/package_6/Xyhbp';
import DailySign6 from 'components/package_6/DailySign';
import Ryjhd6 from 'components/package_6/Ryjhd';
interface State{
    loading:Boolean,
    navArr :ConfigItem[],
    title :string,
    curData:ConfigItem
}
export default class Activity6 extends Component<{}, State> {
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
        Axios.defaults.timeout = 30000 //超时时间
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
                try{
                    e.info = JSON.parse(e.info)
                }catch{

                }
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
                    }} className={`navItem flexBox ${item.name ===this.state.title?"curNavItem":"" } ${this.state.title===""&&index ===0?"curNavItem":""}`}>
                        <div className = "btnline"></div>
                        <div className ="navText flexBox">
                            <p>{item.name.length<=7?item.name.substring(0,item.name.length-1):item.name.substring(0,item.name.length-1).substring(0,7)}</p>
                            <p>{item.name.substring(0,item.name.length-1).length>7?item.name.substring(7,item.name.length-1):""}</p>
                        </div>
                    </div>
                </SwiperSlide>
            })
        }
        if(this.state.curData.id ===""){
            return <div className='activity11'>
            </div>
        }
        return (
            !this.state.loading?<div className='activity11'>
                <div className ="contentBox">
                    <div
                        className='sider' style={{
                            // transform:`scale(${gHandler.getFontsizeScale()})`,
                        }} >
                        <div className="navBox">
                            <Swiper
                                direction={"vertical"}
                                spaceBetween={0}
                                height={65*gHandler.getHeightDiff()}
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
                    <div className="content" style={{
                        // transform:`scale(${gHandler.getFontsizeScale()})`,
                        // marginLeft:`${gHandler.getFontsizeScale()===1?"0px":`${-20/gHandler.getFontsizeScale()}px` }`,
                    }}>
                        {
                            (this.state.title==='新用户首存活动6' ? <Xyhschd6 curData={this.state.curData}/>:
                                (this.state.title==='老用户首存活动6' ? <Lyhsc6 curData={this.state.curData}/>:
                                    (this.state.title==='注册送佣金6' ? <Zcsyj curData={this.state.curData}/>:
                                        (this.state.title==='新用户包赔活动6' ? <Xyhbp6 curData={this.state.curData}/>:
                                            (this.state.title==='每日免费礼金6' ? <DailySign6 curData={this.state.curData}/>:
                                                (this.state.title==='日业绩活动6' ? <Ryjhd6 curData={this.state.curData}/>:
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
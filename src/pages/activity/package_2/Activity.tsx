import React ,{Component} from 'react';
import { Layout, Menu, Icon, message } from 'antd';
import { gHandler } from './../../../lib/gHandler';
import { Api } from '../../../lib/Api';
import Axios from 'axios';
import {ConfigItem} from '../../../interface/activity_interface';
import '../package_2/Activity.scss';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
// Import Swiper styles
import 'swiper/swiper.scss';
import Lyhsc2 from 'components/package_2/Lyhsc';
import FirstComponent from '../../../FirstComponent';
import RedRain2 from 'components/package_2/RedRain';
import Xyhschd2 from 'components/package_2/Xyhschd';
import Fxpyq from 'components/package_2/Fxpyq';
import Zcs58 from 'components/package_2/Zcs58';
import Jtfl2 from 'components/package_2/Jtfl';
interface State{
    loading:Boolean,
    navArr :ConfigItem[],
    title :string,
    curData:ConfigItem
}
export default class Activity2 extends Component<{}, State> {
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
    componentWillMount(){
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
        let item :any= {
            name :"集团福利2",
            info:{
            }
        }
        // navArr.push(item)
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
                        <div className = "btnline"></div>
                        <div className={`navText ${
                            item.name==="老用户首存活动2"?(item.name ===this.state.title ?"btn_lhysc1":"btn_lhysc2"):
                                item.name==="开业前三千名注册送58元2"?(item.name ===this.state.title ?"zcs58_1":"zcs58_2"):
                                    item.name==="新用户首存活动2"?(item.name ===this.state.title ?"btn_xhysc1":"btn_xhysc2"):
                                        item.name==="集团福利2"?(item.name ===this.state.title ?"jtfl1":"jtfl2"):""
                        }`} ></div>
                        {/* <div className ="navText flexBox">
                            <p>{item.name.length<=7?item.name.substring(0,item.name.length-1):item.name.substring(0,item.name.length-1).substring(0,7)}</p>
                            <p>{item.name.substring(0,item.name.length-1).length>7?item.name.substring(7,item.name.length-1):""}</p>
                        </div> */}
                    </div>
                </SwiperSlide>
            })
        }
        if(this.state.curData.id ===""){
            return <div className='activity2'>
                <div className='headerBox' >
                    {/* <div className="returnToHall" onClick={this.returnToHall}></div> */}
                </div>
            </div>
        }
        return (
            !this.state.loading?<div className='activity2'>
                <div className ="contentBox">
                    <div
                        className='sider' style={{
                            // transform:`scale(${gHandler.getFontsizeScale()})`,
                        }}>
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
                                <SwiperSlide></SwiperSlide>
                                <SwiperSlide></SwiperSlide>
                            </Swiper>
                        </div>
                    </div>
                    <div className="content" style={{
                        // transform:`scale(${gHandler.getFontsizeScale()})`,
                        // marginLeft:`${gHandler.getFontsizeScale()===1?"0px":`${-20/gHandler.getFontsizeScale()}px` }`,
                    }} >
                        {
                            (this.state.title==='老用户首存活动2' ? <Lyhsc2 curData={this.state.curData}/>:
                                (this.state.title==='开业前三千名注册送58元2' ? <Zcs58 curData={this.state.curData}/>:
                                    (this.state.title==='新用户首存活动2' ? <Xyhschd2 curData={this.state.curData}/>:
                                        (this.state.title==='集团福利2' ? <Jtfl2 curData={this.state.curData}/>:
                                            <div></div>
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
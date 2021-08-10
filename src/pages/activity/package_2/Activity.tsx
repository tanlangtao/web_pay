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
import Lyhsc2 from 'components/package_2/Lyhsc';
import RedRain11 from 'components/package_11/RedRain';
import Bytghl from 'components/package_11/Bytghl';
import FirstComponent from '../../../FirstComponent';
import RedRain2 from 'components/package_2/RedRain';
import Xyhschd2 from 'components/package_2/Xyhschd';
import Fxpyq from 'components/package_2/Fxpyq';
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
            if(e.is_close === "1" && (e.name === "分享朋友圈活动3" || e.name === "新会员首存活动三重奏2" || e.name === "老会员每日首存活动非自动领取2" || e.name === "四季发财红包雨2")){
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
                        <div className = "btnline"></div>
                        <div className={`navText ${
                            item.name==="分享朋友圈活动3"?(item.name ===this.state.title ?"btn_fpyq1":"btn_fpyq2"):
                                item.name==="新会员首存活动三重奏2"?(item.name ===this.state.title ?"btn_xhysc1":"btn_xhysc2"):
                                    item.name==="老会员每日首存活动非自动领取2"?(item.name ===this.state.title ?"btn_lhysc1":"btn_lhysc2"):
                                        item.name==="四季发财红包雨2"?(item.name ===this.state.title ?"btn_redRain1":"btn_redRain2"):""
                        }`} ></div>
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
                            transform:`scale(${gHandler.getNodeScale()},${gHandler.getNodeScale()})`,
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
                    }}>
                        {
                            (this.state.title==='分享朋友圈活动3' ? <Fxpyq curData={this.state.curData}/>:
                                (this.state.title==='新会员首存活动三重奏2' ? <Xyhschd2 curData={this.state.curData}/>:
                                    (this.state.title==='老会员每日首存活动非自动领取2' ? <Lyhsc2 curData={this.state.curData}/>:
                                        (this.state.title==='四季发财红包雨2' ? <RedRain2 curData={this.state.curData}/>:
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
}
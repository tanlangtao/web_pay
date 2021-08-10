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
import Bybphd from 'components/package_12/Bybphd';
import Xyhschd12 from 'components/package_12/Xyhschd';
import Lyhsc12 from 'components/package_12/Lyhsc';
import Xyhbp12 from 'components/package_12/Xyhbp';
import Bwfcjl12 from 'components/package_12/Bwfcjl';
import FirstComponent from '../../../FirstComponent';
interface State{
    navArr :ConfigItem[],
    title :string,
    curData:ConfigItem,
    loading:Boolean
}
export default class Activity12 extends Component<{}, State> {
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
                        <div className={`navText ${
                            item.name==="捕鱼包赔活动12"?(item.name ===this.state.title ?"btn_bybp1":"btn_bybp2"):
                                item.name==="新用户首存活动12"?(item.name ===this.state.title ?"btn_xyhschd1":"btn_xyhschd2"):
                                    item.name==="老用户首存活动12"?(item.name ===this.state.title ?"btn_lyhbc1":"btn_lyhbc2"):
                                        item.name==="新用户包赔活动12"?(item.name ===this.state.title ?"btn_xyhbp1":"btn_xyhbp2"):
                                            item.name==="百万扶持奖励活动12"?(item.name ===this.state.title ?"btn_bwfc1":"btn_bwfc2"):""
                        }`} ></div>
                    </div>
                </SwiperSlide>
            })
        }
        if(this.state.curData.id ===""){
            return <div className='activity12'>
                {/* <div className='headerBox' >
                    <div className="returnToHall" onClick={this.returnToHall}></div>
                </div> */}
            </div>
        }
        return (
            !this.state.loading?<div className='activity12'>
                {/* <div className='headerBox' >
                    <div className="returnToHall" onClick={this.returnToHall}></div>
                    <div className={`title ${
                        this.state.title==="捕鱼包赔活动12"?"event_xl_bybp_title":
                            this.state.title==="新用户首存活动12"?"event_xl_xyhsc_title":
                                this.state.title==="老用户首存活动12"?"event_xl_lyhsc_title":
                                    this.state.title==="新用户包赔活动12"?"event_xl_xyhbp_title":
                                        this.state.title==="百万扶持奖励活动12"?"event_xl_bwfc_title":""
                    }`} ></div>
                </div> */}
                <div className ="contentBox">
                    <div className='sider' style={{
                        transform:`scale(${gHandler.getNodeScale()},${gHandler.getNodeScale()})`,
                    }}>
                        <div className="navBox">
                            <Swiper
                                direction={"vertical"}
                                spaceBetween={0}
                                height={145*gHandler.getHeightDiff()}
                                // onSlideChange={() => console.log('slide change')}
                                // onSwiper={(swiper) => console.log(swiper)}
                            >
                                {mapNav()}
                            </Swiper>
                        </div>
                    </div>
                    <div className="content"style={{
                        transform:`scale(${gHandler.getNodeScale()},${gHandler.getNodeScale()})`,
                    }}>
                        {
                            (this.state.title==='捕鱼包赔活动12' ? <Bybphd curData={this.state.curData}/>:
                                (this.state.title==='新用户首存活动12' ? <Xyhschd12 curData={this.state.curData}/>:
                                    (this.state.title==='老用户首存活动12' ? <Lyhsc12 curData={this.state.curData}/>:
                                        (this.state.title==='新用户包赔活动12' ? <Xyhbp12 curData={this.state.curData}/>:
                                            (this.state.title==='百万扶持奖励活动12' ? <Bwfcjl12 curData={this.state.curData}/>:
                                                <div></div>
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
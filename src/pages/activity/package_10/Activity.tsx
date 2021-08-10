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
import Xyhbp10 from 'components/package_10/Xyhbp';
import Xyhzybp from 'components/package_10/Xyhzybp';
import Lyhsc10 from 'components/package_10/Lyhsc';
import Xyhschd10 from 'components/package_10/Xyhschd';
import AGAbp from 'components/package_10/AGAbp';
import CdxHeNei from 'components/package_10/CdxHeNei';
import CdxQiQu from 'components/package_10/CdxQiQu';
import FfcBaoPeiQiQu from 'components/package_10/FfcBaoPeiQiQu';
import FfcBaoPeiHeNei from 'components/package_10/FfcBaoPeiHeNei';
import FirstComponent from '../../../FirstComponent';
interface State{
    loading:Boolean,
    navArr :ConfigItem[],
    title :string,
    curData:ConfigItem
}
export default class Activity10 extends Component<{}, State> {
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
                            item.name==="专线包赔活动10"?(item.name ===this.state.title ?"zsbp1":"zsbp2"):
                                item.name==="河内连赢活动10"?(item.name ===this.state.title ?"hnly1":"hnly2"):
                                    item.name==="奇趣连赢活动10"?(item.name ===this.state.title ?"qqly1":"qqly2"):
                                        item.name==="河内分分彩包赔10"?(item.name ===this.state.title ?"bphn1":"bphn2"):
                                            item.name==="AGA专属包赔10"?(item.name ===this.state.title ?"AGA1":"AGA2"):
                                                item.name==="新用户包赔活动10"?(item.name ===this.state.title ?"xyhbp1":"xyhbp2"):   
                                                    item.name==="新用户首存活动10"?(item.name ===this.state.title ?"xyh1":"xyh2"):   
                                                        item.name==="老用户首存活动10"?(item.name ===this.state.title ?"lyh1":"lyh2"):   
                                                            item.name==="奇趣分分彩包赔10"?(item.name ===this.state.title ?"bpqq1":"bpqq2"): ""
                        }`} ></div>
                    </div>
                </SwiperSlide>
            })
        }
        if(this.state.curData.id ===""){
            return <div className='activity10'>
                <div className='headerBox' >
                    {/* <div className="returnToHall" onClick={this.returnToHall}></div> */}
                </div>
            </div>
        }
        return (
            !this.state.loading ?<div className='activity10'>
                <div className='headerBox flexBox' >
                    {/* <div className="returnToHall" onClick={this.returnToHall}></div> */}
                    <div className='title_jchd'></div>
                </div>
                <div className ="contentBox">
                    <div className='sider' style={{
                        zIndex:2,
                        transform:`scale(${gHandler.getNodeScale()},${gHandler.getNodeScale()})`,
                        marginTop:gHandler.getTopOff10()
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
                        zIndex:1,
                        transform:`scale(${gHandler.getNodeScale()},${gHandler.getNodeScale()})`,
                        marginLeft:gHandler.getLeftOff(),
                        marginTop:gHandler.getTopOff10()
                    }}>
                        {
                            (this.state.title==='专线包赔活动10' ? <Xyhbp10 curData={this.state.curData}/>:
                                (this.state.title==='新用户包赔活动10' ? <Xyhzybp curData={this.state.curData}/>:
                                    (this.state.title==='老用户首存活动10' ? <Lyhsc10 curData={this.state.curData}/>:
                                        (this.state.title==='新用户首存活动10' ? <Xyhschd10 curData={this.state.curData}/>:
                                            (this.state.title==='AGA专属包赔10' ? <AGAbp curData={this.state.curData}/>:
                                                (this.state.title==='河内连赢活动10' ? <CdxHeNei curData={this.state.curData}/>:
                                                    (this.state.title==='奇趣连赢活动10' ? <CdxQiQu curData={this.state.curData}/>:
                                                        (this.state.title==='奇趣分分彩包赔10' ? <FfcBaoPeiQiQu curData={this.state.curData}/>:
                                                            (this.state.title==='河内分分彩包赔10' ? <FfcBaoPeiHeNei curData={this.state.curData}/>:
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
                        }
                    </div>
                </div>
            </div>
                :<FirstComponent></FirstComponent>
        )
    }
}
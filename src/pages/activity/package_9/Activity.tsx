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
const { Header, Content, Sider } = Layout;

interface State{
    navArr :ConfigItem[],
    title :string,
    curData:ConfigItem
}
export default class Activity extends Component<{}, State> {
    state = {
        navArr:[],
        title:'',
        curData:{
            id:"",
            info:"",
            name:"",
            is_close:"",
            order_by:"",
        }
    }
    
    componentDidMount() {
        this.AxiosIndex()

    }
    //请求首页
    private async  AxiosIndex(){
        let url = `${gHandler.UrlData.host}${Api.activityConfig}?package_id=${gHandler.UrlData.package_id}&token=${gHandler.token}&center_auth=${gHandler.UrlData.center_auth}`;
        let response = await Axios.get(url).then(response=>{
            return response.data
        }).catch(err=>{
            message.error(err)
        })
        console.log(response)
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
        })
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
                        <div className="navText flexBox">{item.name.substring(0,item.name.length-1)}</div>
                        <div className="xian_dh"></div>
                    </div>
                </SwiperSlide>
            })
        }
        if(this.state.curData.id ===""){
            return <div></div>
        }
        return (
            <div className='activity9'>
                <div
                    className='sider'
                >
                    <div className='headerBox' >
                        <div className='title_jchd'></div>
                    </div>
                    <div className="navBox">
                        <Swiper
                            direction={"vertical"}
                            spaceBetween={0}
                            height={100}
                            // onSlideChange={() => console.log('slide change')}
                            // onSwiper={(swiper) => console.log(swiper)}
                        >
                            {mapNav()}
                        </Swiper>
                    </div>
                </div>
                <div className="content">
                    {
                        this.state.title==='百万扶持奖励9' ? <Bwfcjl curData={this.state.curData}/>:
                            (this.state.title==="分分彩猜大小奇趣包赔9"?<FfcBpQiQu curData={this.state.curData}/>:
                                (this.state.title === "新用户首存活动9" ? <Xyhschd curData={this.state.curData}/>:
                                    (this.state.title === "老会员每日首存活动9" ? <Lyhsc curData={this.state.curData}/>:
                                        (this.state.title === "老用户包赔活动9" ? <Lyhbp curData={this.state.curData}/>:
                                            (this.state.title === "四季发财红包雨9" ? <RedRain curData={this.state.curData}/>:
                                                (this.state.title === "日业绩活动9" ? <Ryjhd curData={this.state.curData}/>:
                                                    (this.state.title === "USDT存款大礼包9" ? <UsdtCunKuan curData={this.state.curData}/>:
                                                        <div></div>
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
        )
    }
}
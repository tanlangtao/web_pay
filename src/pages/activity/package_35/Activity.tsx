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
import FirstComponent from '../../../FirstComponent';
import BtnLightBox from './BtnLightBox';
import Lyhsc35 from 'components/package_35/Lyhsc';
import Xyhschd35 from 'components/package_35/Xyhschd';
import Xyhbp35 from 'components/package_35/Xyhbp';
import Zcs28 from 'components/package_35/Zcs28';
interface State{
    loading:Boolean,
    navArr :ConfigItem[],
    title :string,
    curData:ConfigItem,
    btn_light_left:number
}
export default class Activity35 extends Component<{}, State> {
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
        loading:true,
        btn_light_left:-100
    }
    timer :any= null
    btn_light_left =0
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
            //缓存config
            this.setLocal(response.data)
        }else{
            message.error(response.msg)
        }
    }
    private setNavArr(data:ConfigItem[]){
        let navArr:ConfigItem[] = []
        // let item = {
        //     created_at: "1638453029",
        //     id: "162",
        //     info: "{\"range\": [{\"bonus\": 18, \"recharge_amount\": 300}, {\"bonus\": 28, \"recharge_amount\": 500}, {\"bonus\": 38, \"recharge_amount\": 1000}, {\"bonus\": 58, \"recharge_amount\": 2000}, {\"bonus\": 128, \"recharge_amount\": 5000}, {\"bonus\": 168, \"recharge_amount\": 10000}], \"game_id\": [\"5b1f3a3cb76a591e7f251730\", \"5b1f3a3cb76a591e7f251712\", \"5b1f3a3cb76a591e7f2517a6\", \"5c6a62be56209ac117d446aa\", \"5b1f3a3cb76a591e7f251731\", \"5b1f3a3cb76a59n210407n738\", \"5b1f3a3cb76a591e7f251735\", \"5b1f3a3cb76a591e7f251737\", \"5b1f3a3cb76a451e7f251739\", \"5b1f3a3cb1005251736\", \"5b1f3a3cb76a451e211110\", \"5b1f3a3cb76a451e210629\", \"5b1f3a3cb76a591e7f251736\"], \"flow_rate\": 1, \"withdraw_check_switch\": 1}",
        //     is_close: "2",
        //     is_del: "0",
        //     name: "老用户首存活动16",
        //     need_bankcard: "1",
        //     need_mobile: "1",
        //     order_by: "4",
        //     package_id: "19",
        // }
        // let item2 = {
        //     created_at: "1638445002",
        //     id: "161",
        //     info: "{\"end\": 22, \"conf\": [{\"gold\": 150, \"first_pay_max\": 500, \"first_pay_min\": 300}, {\"gold\": 250, \"first_pay_max\": 100000, \"first_pay_min\": 500}], \"start\": 12, \"balance\": 10, \"game_id\": [\"5c6a62be56209ac117d446aa\", \"5b1f3a3cb76a591e7f2517a6\", \"5b1f3a3cb76a591e7f251712\", \"5b1f3a3cb76a591e7f251730\"], \"flow_rate\": 0, \"start_date\": \"2021-12-01\", \"withdraw_conf\": {\"is_open\": 1, \"condition\": [{\"recharge_amount\": 300, \"max_withdraw_amount\": 600}, {\"recharge_amount\": 500, \"max_withdraw_amount\": 1000}]}, \"recharge_min_amount\": 300}",
        //     is_close: "2",
        //     is_del: "0",
        //     name: "新用户包赔活动16",
        //     need_bankcard: "1",
        //     need_mobile: "1",
        //     order_by: "3",
        //     package_id: "19"
        // }
        // let item3 = {
        //     created_at: "1638441263",
        //     id: "160",
        //     info: "{\"end\": 24, \"range\": [{\"bonus\": 58, \"recharge_amount\": 300}, {\"bonus\": 88, \"recharge_amount\": 500}, {\"bonus\": 128, \"recharge_amount\": 1000}, {\"bonus\": 168, \"recharge_amount\": 2000}], \"start\": 0, \"game_id\": [\"5b1f3a3cb76a591e7f251730\", \"5b1f3a3cb76a591e7f251712\", \"5b1f3a3cb76a591e7f2517a6\", \"5c6a62be56209ac117d446aa\", \"5b1f3a3cb76a591e7f251731\", \"5b1f3a3cb76a59n210407n738\", \"5b1f3a3cb76a591e7f251735\", \"5b1f3a3cb76a591e7f251737\", \"5b1f3a3cb76a451e7f251739\", \"5b1f3a3cb1005251736\", \"5b1f3a3cb76a451e211110\", \"5b1f3a3cb76a451e210629\", \"5b1f3a3cb76a591e7f251736\"], \"flow_rate\": 8, \"withdraw_check_switch\": 1}",
        //     is_close: "2",
        //     is_del: "0",
        //     name: "新用户首存活动16",
        //     need_bankcard: "1",
        //     need_mobile: "1",
        //     order_by: "2",
        //     package_id: "19",
        // }
        // data.push(item)
        // data.push(item2)
        // data.push(item3)
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
        console.log(navArr,decodeURI(gHandler.UrlData.firstPage))
        let firstPage :any= []
        if(decodeURI(gHandler.UrlData.firstPage) === "棋牌大奖池"){
            navArr.forEach((e,index) => {
                if(e.name === "棋牌大奖池16"){
                    //截取放到首位
                    firstPage = navArr.splice(index,1)
                }
            });
        }else if(decodeURI(gHandler.UrlData.firstPage) === "每日免费礼金"){
            navArr.forEach((e,index) => {
                if(e.name === "每日免费礼金16"){
                    //截取放到首位
                    firstPage = navArr.splice(index,1)
                }
            });
        }else if(decodeURI(gHandler.UrlData.firstPage) === "集团福利"){
            navArr.forEach((e,index) => {
                if(e.name === "集团福利16"){
                    //截取放到首位
                    firstPage = navArr.splice(index,1)
                }
            });
        }else{
            firstPage = navArr.splice(0,1)
        }
        navArr.unshift(firstPage[0])
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
                        <div className ="navText flexBox">
                            <p>{item.name.length<=8?item.name.substring(0,item.name.length-2):item.name.substring(0,item.name.length-2).substring(0,8)}</p>
                            <p>{item.name.substring(0,item.name.length-2).length>8?item.name.substring(8,item.name.length-2):""}</p>
                        </div>
                        {
                            item.name ===this.state.title?<BtnLightBox></BtnLightBox>:null
                        }
                    </div>
                </SwiperSlide>
            })
        }
        if(this.state.curData.id ===""){
            return <div className='Activity35'>
                {/* <div className='headerBox' >
                    <div className="returnToHall" onClick={this.returnToHall}></div>
                </div> */}
            </div>
        }
        return (
            !this.state.loading ?<div className='Activity35'>
                <div className ="contentBox">
                    <div className='sider' style={{
                        // zIndex:2,
                        // transform:`scale(${gHandler.getFontsizeScale()})`,
                    }}>
                        <div className="navBoxBg">
                            <div className ="version">v:1.1.8</div>
                        </div>
                        <div className="navBox">
                            <Swiper
                                direction={"vertical"}
                                spaceBetween={0}
                                height={68*gHandler.getHeightDiff()}
                                // onSlideChange={() => console.log('slide change')}
                                // onSwiper={(swiper) => console.log(swiper)}
                            >
                                {mapNav()}
                                <SwiperSlide></SwiperSlide>
                            </Swiper>
                            
                        </div>
                    </div>
                    <div className="content" style={{
                        // zIndex:1,
                        // transform:`scale(${gHandler.getFontsizeScale()})`,
                        // marginLeft:`${gHandler.getFontsizeScale()===1?"0px":`${-60/gHandler.getFontsizeScale()}px` }`,
                    }}>
                        {
                            (this.state.title==='次存活动35' ? <Lyhsc35 curData={this.state.curData}/>:
                                (this.state.title==='新用戶首存活动35' ? <Xyhschd35 curData={this.state.curData}/>:
                                    (this.state.title==='新用户包赔活动35' ? <Xyhbp35 curData={this.state.curData}/>:
                                        (this.state.title==='注册送28金币35' ? <Zcs28 curData={this.state.curData}/>:
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
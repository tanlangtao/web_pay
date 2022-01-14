/*活动组件*/
import React from 'react'
import {gHandler} from '../../lib/gHandler'
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
// Import Swiper styles
import 'swiper/swiper.scss';
import "./Jtfl.scss";
import {ConfigItem} from '../../interface/activity_interface';
interface Props {
    curData:ConfigItem
}
interface item {
    bonus:Number,
    end_time:String,
    rank:Number,
    start_time:String,
    turnover:Number,
    turnover_bonus:Number,
    user_id:String
}
interface State {
}
export default class Jtfl2 extends React.Component<Props,State>{
    state = {
    }
    btnIndex= 0 
    componentDidMount(){
    }
    componentWillUnmount(){
        this.setState = (state,callback)=>{
            return
        }
    }
    render (){
        return (
            <div className ="Jtfl2" >
                <Swiper
                    direction={"vertical"}
                    spaceBetween={0}
                    height={250*gHandler.getHeightDiff()}
                    // onSlideChange={() => console.log('slide change')}
                    // onSwiper={(swiper) => console.log(swiper)}
                >
                    <SwiperSlide><div className ="bg"></div></SwiperSlide>
                    <SwiperSlide></SwiperSlide>
                    <SwiperSlide></SwiperSlide>
                    <SwiperSlide></SwiperSlide>
                    <SwiperSlide></SwiperSlide>
                    <SwiperSlide></SwiperSlide>
                </Swiper>
                
            </div>
        )
    }
}
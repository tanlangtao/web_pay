/*活动组件*/
import React from 'react'
import "./Zcsyj.scss";
import {ConfigItem} from '../../interface/activity_interface';
interface Props {
    curData:ConfigItem
}
interface State {
}
export default class Zcsyj extends React.Component<Props,State>{
    componentWillUnmount(){
        this.setState = (state,callback)=>{
            return
        }
    }
    render (){
        return (
            <div className ="Zcsyj" >
                
                <div className = "rule">
                    <p>1.玩家需要绑定手机号码和银行卡才能参与此活动。</p>
                    <p>2.赠送佣金实时到账，请前往全名代理月入百万界面查看。</p>
                    <p>3.佣金需要达到50金币才能领取。</p>
                    <p>4.同一用户（同ip同设备视为同一用户）仅限参加一次活动。</p>
                    <p>5.平台拥有最终解释权，严禁一切恶意行为，出现违规情况，</p>
                    <p>一律封号处理；同时平台有权根据实际情况，随时调整活动内容。</p>
                </div>
                <div className = "logo">
                </div>
            </div>
        )
    }
}
import React ,{Component} from 'react';
import { gHandler } from '../../../lib/gHandler';
import './Activity.scss';
// Import Swiper styles
interface State{
    btn_light_left:number
}
export default class BtnLightBox extends Component<{}, State> {
    state = {
        btn_light_left:-100
    }
    timer :any= null
    componentDidMount(){
        this.runAnimate()
    }
    runAnimate(){
        clearInterval(this.timer)
        this.timer = setInterval(()=>{
            let btn_light_left = (this.state.btn_light_left +10);
            if (btn_light_left > 500*gHandler.getHeightDiff()){
                btn_light_left = -100*gHandler.getHeightDiff()
            }
            this.setState({
                btn_light_left:btn_light_left
            })
        },50)
    }
    render() {
        return <div className = "btn_lightBox" >
            <div className = "btn_light" style ={{
                left:`${this.state.btn_light_left}px`
            }}>
            </div>
            <div className = "rightTopMask"></div>
            <div className = "rightBottomMask"></div>
        </div>
    }
}
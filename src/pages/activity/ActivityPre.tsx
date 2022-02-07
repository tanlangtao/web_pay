import React ,{Component} from 'react';
import { gHandler } from '../../lib/gHandler';
import Activity9 from './package_9/Activity';
import Activity10 from './package_10/Activity';
import Activity11 from './package_11/Activity';
import Activity12 from './package_12/Activity';
import Activity1 from './package_1/Activity';
import Activity2 from './package_2/Activity';
import Activity3 from './package_3/Activity';
import Activity8 from './package_8/Activity';
import Activity6 from './package_6/Activity';
import Activity15 from './package_15/Activity';
import Activity13 from './package_13/Activity';
import Activity18 from './package_18/Activity';
import Activity16 from './package_16/Activity';
import Activity19 from './package_19/Activity';
import Activity20 from './package_20/Activity';
import Activity21 from './package_21/Activity';
import Activity22 from './package_22/Activity';
import Activity25 from './package_25/Activity';
import Activity26 from './package_26/Activity';
interface State{
}
export default class ActivityPre extends Component<{}, State> {
    
    render() {
        return (
            gHandler.UrlData.package_id==='9' ? <Activity9/>:
                (gHandler.UrlData.package_id==='10' ?<Activity10/>:
                    gHandler.UrlData.package_id==='11' ?<Activity11/>:
                        gHandler.UrlData.package_id==='12' ?<Activity12/>:
                            gHandler.UrlData.package_id==='2' ?<Activity2/>:
                                gHandler.UrlData.package_id==='3' ?<Activity3/>:
                                    gHandler.UrlData.package_id==='8' ?<Activity8/>:
                                        gHandler.UrlData.package_id==='6' ?<Activity6/>:
                                            gHandler.UrlData.package_id==='15' ?<Activity15/>:
                                                gHandler.UrlData.package_id==='13' ?<Activity13/>:
                                                    gHandler.UrlData.package_id==='18' ?<Activity18/>:
                                                        gHandler.UrlData.package_id==='16' ?<Activity16/>:
                                                            gHandler.UrlData.package_id==='1' ?<Activity1/>:
                                                                gHandler.UrlData.package_id==='19' ?<Activity19/>:
                                                                    gHandler.UrlData.package_id==='20' ?<Activity20/>:
                                                                        gHandler.UrlData.package_id==='21' ?<Activity21/>:
                                                                            gHandler.UrlData.package_id==='22' ?<Activity22/>:
                                                                                gHandler.UrlData.package_id==='25' ?<Activity25/>:
                                                                                    gHandler.UrlData.package_id==='26' ?<Activity26/>:
                                                                                        <Activity18></Activity18>    
                )
        )
    }
    componentDidMount(){
        let scale = gHandler.getDeviceScale()
        let body =document.getElementsByTagName("body")[0];
        body.style.zoom = `${scale}`;
        if(scale===1.2){
            body.style.marginTop = `-99px`
        }else if(scale===1.3){
            body.style.marginTop = `-60px`
        }
    }
}
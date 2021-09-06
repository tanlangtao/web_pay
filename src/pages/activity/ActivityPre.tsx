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
                                                    <Activity1></Activity1>    
                )
        )
    }
}
import React ,{Component} from 'react';
import { gHandler } from '../../lib/gHandler';
import Activity9 from './package_9/Activity';
import Activity10 from './package_10/Activity';
import Activity11 from './package_11/Activity';
import Activity12 from './package_12/Activity';
interface State{
}
export default class ActivityPre extends Component<{}, State> {
    
    render() {
        return (
            gHandler.UrlData.package_id==='9' ? <Activity9/>:
                (gHandler.UrlData.package_id==='10' ?<Activity10/>:
                    gHandler.UrlData.package_id==='11' ?<Activity11/>:
                        <Activity12></Activity12>  
                )
        )
    }
}
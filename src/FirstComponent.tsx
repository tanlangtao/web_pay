/*活动组件*/
import React from 'react'
import "./FirstComponent.scss"
import { gHandler } from './lib/gHandler';
interface Props {
}
interface State {
}
export default class FirstComponent extends React.Component<Props,State>{
    state = {
    }
    
    render (){
        // return <div className ={gHandler.UrlData.package_id==='9'? "Loading9":
        //     gHandler.UrlData.package_id==='10'?"Loading10":
        //         gHandler.UrlData.package_id==='11'?"Loading11":
        //             gHandler.UrlData.package_id==='12'?"Loading12":
        //                 gHandler.UrlData.package_id==='15'?"Loading10":
        //                     gHandler.UrlData.package_id==='8'?"Loading8":"Loading11"
        // }>
        // </div>
        return <div></div>
    }
}
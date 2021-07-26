/*兑换历史*/
import React from 'react'
import {gHandler} from '../lib/gHandler'
import { Api } from '../lib/Api';
import Axios from 'axios';
import {message, Button} from 'antd';
import {HistoryResults} from '../interface/cash_interface'
interface State {
    page:number,
    HistoryResults:HistoryResults
}
export default class DhHistory extends React.Component<{},State>{
    state = {
        page:1,
        HistoryResults:{
            data:{
                count:0,
                current_page:0,
                list:[{
                    amount:'',
                    type:'',
                    handling_fee:'',
                    platform_rate:'',
                    channel_rate:'',
                    arrival_amount:'',
                    status:'',
                    created_at:'',
                    arrival_at:'',
                    user_remark:'',
                }],
                total_page:0,
            },
            msg:'',
            status:0
        }
    }
    componentDidMount(){
        this.Axios_withDrawHistory()
    }
    componentWillUnmount(){
        this.setState = (state,callback)=>{
            return
        }
    }
    private async Axios_withDrawHistory(){
        let user_id = `user_id=${gHandler.UrlData.user_id}`;
        let order_status = `order_status=0`;
        let page = `page=${this.state.page}`;
        let page_set = `page_set=12`;
        let token = `token=${gHandler.token}`;
        let url = `${gHandler.UrlData.host}${Api.withDrawHistory}?${user_id}&${order_status}&${page}&${page_set}&${token}`;
        let  response= await Axios.get(url).then(response=>{
            return response.data
        }).catch(err=>{
            return null
        })
        this.setState({
            HistoryResults:response
        })
        console.log(response)
    }
    pageUp=()=>{
        if(this.state.page>1){
            this.setState({
                page:this.state.page-1
            },()=>{
                this.Axios_withDrawHistory()
            })
        }
    }
    pageDown=()=>{
        if(this.state.page < this.state.HistoryResults.data.total_page){
            this.setState({
                page:this.state.page+1
            },()=>{
                this.Axios_withDrawHistory()
            })
        }
    }
    render (){
        // 类型=兑换渠道
        // 当类型=人工兑换时，费率为玩家填写费率
        // 当类型=人工代提时，费率为0
        // 当类型=银行卡、支付宝时，费率=平台费率+渠道费率
        // 当类型=赠送时，费率均为0
        let title =['类型','兑换金额','费率','到账金额','状态','申请时间','到账时间','备注'];
        let mapTitle = title.map((item,index)=>{
            return <div key={index} className="flex-box" style={{width:'12%'}}>{item}</div>
        })
        let list = this.state.HistoryResults.data.list
        let mapList = list.map((item,index)=>{
            return  <div key={index} className="flex-box" style={{width:'100%',height:'40px',marginTop:'10px'}} >
                <div style={{width:'12%'}} className="flex-box">{item.type==="1" ?'支付宝':(item.type==='2'?'银行卡':'人工兑换')}</div>
                <div style={{width:'12%'}} className="flex-box">{Number(item.amount).toFixed(2)}</div>
                <div style={{width:'12%'}} className="flex-box">{item.type==="1"||item.type==="2" ?
                    `${( ( Number(item.platform_rate)+Number(item.channel_rate))*100).toFixed(1)}%`
                    :`${(Number(item.platform_rate)*100).toFixed(1)}%`}
                </div>
                <div style={{width:'12%'}} className="flex-box">{Number(item.arrival_amount).toFixed(2)}</div>
                <div style={{width:'12%'}} className="flex-box">{item.status ==='4'?'已成功' :'未成功'}</div>
                <div style={{width:'12%'}} className="flex-box">{item.created_at === "0" ? '无':gHandler.getTime(Number(item.created_at))}</div>
                <div style={{width:'12%'}} className="flex-box">{item.arrival_at === "0" ? '无':gHandler.getTime(Number(item.arrival_at))}</div>
                <div style={{width:'12%'}} className="flex-box">{item.user_remark}</div>
            </div>
        })
        return (
            <div>
                <div style={{height:'40px',borderBottom:'1px solid black',padding:'0px 5px',alignItems:'flex-start'}} className='flex-box'>
                    {mapTitle}
                </div>
                <div className="flex-box" style={{height:'600px',padding:'0px 5px',justifyContent:'flex-start',marginTop:'10px',flexDirection:'column'}} >
                    {mapList}
                </div>
                <div className="flex-box" style={{height:'40px',marginTop:'20px'}}>
                    <Button onClick={this.pageUp}>上一页</Button>
                    <div className="flex-box" style={{padding:'0 20px'}}>{this.state.page} / {this.state.HistoryResults.data.total_page}</div>
                    <Button onClick={this.pageDown}>下一页</Button>
                </div>
            </div>
        )
    }
}
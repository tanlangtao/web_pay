/*兑换历史*/
import React from 'react'
import {gHandler} from '../lib/gHandler'
import { Api } from '../lib/Api';
import Axios from 'axios';
import {message, Button,Modal} from 'antd';
import {RechargeHistoryResults,RechargeHistrotyListItem} from '../interface/pay_interface'
interface State {
    visible:boolean,
    page:number,
    HistoryResults:RechargeHistoryResults,
    orderData:RechargeHistrotyListItem,
}
export default class RechargeHistory extends React.Component<{},State>{
    state = {
        visible:false,
        page:1,
        HistoryResults:{
            data:{
                count:0,
                current_page:0,
                list:[{
                    amount:'',
                    type:'',
                    arrival_amount:'',
                    status:'',
                    created_at:'',
                    arrival_at:'',
                    bank_name:'',
                    card_name:'',
                    card_num:'',
                    user_name:'',
                    remark:''
                }],
                total_page:0,
            },
            msg:'',
            status:0
        }, 
        orderData:{
            amount:'',
                type:'',
                arrival_amount:'',
                status:'',
                created_at:'',
                arrival_at:'',
                bank_name:'',
                card_name:'',
                card_num:'',
                user_name:'',
                remark:''
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
        let url = `${gHandler.UrlData.host}${Api.payHistory}?${user_id}&${order_status}&${page}&${page_set}&${token}`;
        let  response= await Axios.get(url).then(response=>{
            return response.data
        }).catch(err=>{  message.error(err) })
        this.setState({
            HistoryResults:response
        })
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
    /**
    * 确认充值
    */
   handleOk = (e:any) => {
       this.setState({
           visible: false,
       }); 
       
   };
   /**
    * 取消
    */
   handleCancel = (e:any) => {
       this.setState({
           visible: false,
       });
   };
   showModel = (index:number) => {
       this.setState({
            orderData:this.state.HistoryResults.data.list[index],
            visible: true,
       });
   };
    render (){
        let title =['下单金额','到账金额','状态','类型','下单时间','到账时间','操作'];
        let mapTitle = title.map((item,index)=>{
            return <div key={index} className="flex-box" style={{width:'14%'}}>{item}</div>
        })
        let list = this.state.HistoryResults.data.list
        let mapList = list.map((item,index)=>{
            return  <div key={index} className="flex-box" style={{width:'100%',height:'40px',marginTop:'10px'}} >
                        <div style={{width:'14%'}} className="flex-box">{Number(item.amount).toFixed(2)}</div>
                        <div style={{width:'14%'}} className="flex-box">{Number(item.arrival_amount).toFixed(2)}</div>
                        <div style={{width:'14%'}} className="flex-box">{item.status ==='6'?'已成功' :(item.status==='4'?'已撤销':'未成功')}</div>
                        <div style={{width:'14%'}} className="flex-box">{
                            item.type==="1" ?
                                '支付宝充值':(item.type==='2'?'转账到银行卡':(
                                    (item.type==='6'?'微信支付':
                                        (item.type==='7'?'银联支付':
                                           ( item.type ==='8'?'网银支付':
                                                (item.type==='9'?'快捷支付':
                                                    (item.type==='14'?'专享快付':'')
                                                )
                                           )
                                        )
                                    )
                                )
                            )
                        }</div>
                        <div style={{width:'14%'}} className="flex-box">{item.created_at === "0" ? '无':gHandler.getTime(Number(item.created_at))}</div>
                        <div style={{width:'14%'}} className="flex-box">{item.arrival_at === "0" ? '无':gHandler.getTime(Number(item.arrival_at))}</div>
                        <div style={{width:'14%'}} className="flex-box">
                            {item.type==='2'?<Button onClick={()=>this.showModel(index)}>订单</Button> :''}
                        </div>
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
                <Modal
                    title="订单信息"
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    width ='600px'
                    style={{minWidth:'400px'}}
                >
                    <p>充值方式 : 银行卡转账</p>
                    <p>用户昵称 : {this.state.orderData.user_name}</p>
                    <p>收款银行 : {this.state.orderData.bank_name}</p>
                    <p>收款账号 : {this.state.orderData.card_num}</p>
                    <p>收款姓名 : {this.state.orderData.card_name}</p>
                    <p>转账金额 : {Number(this.state.orderData.amount).toFixed(2)}</p>
                    <p>转账备注 : {this.state.orderData.remark}</p>
                    <div style={{fontSize:'12px'}}>
                        注意事项:
                        <div>1、请务必按照该金额(包括小数点)进行转账，并填写备注信息(为空则不填)；</div>
                        <div>2、请在30分钟内完成支付，超时系统将不予处理；</div>
                        <div>3、完成转账后，请在60分钟后查询您的账号余额，若未到账请及时联系在线客服；</div>
                        <div>4、此处仅支持个人网银转账，不支持ATM机、柜台、支付宝或其他方式转账；</div>
                    </div>
                </Modal>
            </div>
        )
    }
}
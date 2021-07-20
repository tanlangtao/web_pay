/*充值组件*/
import React from 'react'
import {gHandler} from '../lib/gHandler'
import { Api } from '../lib/Api';
import Axios from 'axios';
import {message, Button} from 'antd';
import {AliPayPaymentIndex,orderData,channelItem} from '../interface/pay_interface';
import { InputNumber } from 'antd';
import OrderAlert from '../components/OrderAlert';
interface Props {
    title:string,
    IndexResults:AliPayPaymentIndex
}
interface State {
    data:channelItem[],
    cur:number,
    money:number,
    visible:boolean, 
    orderData:orderData,   
}
export default class Recharge extends React.Component<Props,State>{
    state = {
        data:[
            {
                channel_id:'',//渠道id
                max_amount:'',//最大充值金额
                min_amount:'',//最小充值金额
                name:'',//渠道显示名称
                nick_name:'',//渠道名称
                pay_type:'',//充值类型
                sort:'',//排序
                span_amount:'',//充值范围
            }
        ],
        cur:0,
        money:0,
        visible:false,
        orderData:{
            amount:'',
            bank_name:'',//收款银行
            card_name:'',//收款姓名
            card_num:'',//收款帐号
            remark:'',
            user_name:'',
        },
        title:'',

    }
    componentDidMount(){
       
    }
    static getDerivedStateFromProps(props:Props,state:State){
        if(props.title ==='支付宝'){ return { data:props.IndexResults.data.alipay} }
        else if( props.title === '转账到银行卡'){ return {data:props.IndexResults.data.bankcard_transfer}}
        else if( props.title === '银联扫码'){ return {data:props.IndexResults.data.union_pay} }
        else if( props.title === '微信'){return {data:props.IndexResults.data.wechat_pay} }
        else if( props.title === '快捷支付'){ return {data:props.IndexResults.data.quick_pay}}
        else if( props.title === '网银支付'){ return {data:props.IndexResults.data.bank_pay} }
        return null
    }
    componentWillUnmount(){
        this.setState = (state,callback)=>{
            return
        }
    }
    /**
     * 切换渠道
     * @param index 
     */
    changeChannel(index:number){
        this.setState({
            cur:index,
        })
    }
    /**
     * 常用金额
     * @param index 
     */
    usedAmountClick=(e:number)=>{
        this.setState({
            money:this.state.money+Number(e)
        })
    }
    changeMoney = (e :any)=>{
        this.setState({
            money:e
        })
    }
    /**
     * 点击充值
     * @param index 
     */
    paymentClick=()=>{
        let min_amount = Number(this.state.data[this.state.cur].min_amount);
        let max_amount = Number(this.state.data[this.state.cur].max_amount);
        if(this.state.money<min_amount || this.state.money > max_amount){
            message.info(`不符合充值范围！ (${min_amount}-${max_amount})`)
        }else{
            if(this.props.title === '转账到银行卡'){
                this.showModel()
            }else{
                this.AxiosPayment()
            }
        }
    }
    private async AxiosPayment(){
        
        let current = this.state.data[this.state.cur];
        let user_id = `user_id=${gHandler.UrlData.user_id}`;
        let user_name = `user_name=${decodeURI(gHandler.UrlData.user_name)}`;
        let payment_amount = `payment_amount=${this.state.money}`;
        let channel_type = `channel_type=${current.channel_id}`;
        let channel_name = `channel_name=${current.name}`;
        let pay_name = `pay_name=${current.nick_name}`;
        let pay_type =`pay_type=${current.pay_type}`;
        let client = `client=${gHandler.UrlData.client}`;
        let proxy_user_id = `proxy_user_id=${gHandler.UrlData.proxy_user_id}`;
        let proxy_name = `proxy_name=${decodeURI(gHandler.UrlData.proxy_name)}`;
        let package_id = `package_id=${gHandler.UrlData.package_id}`;
        let token = `token=${gHandler.token}`;
        let url = `${gHandler.UrlData.host}${Api.payment}?${user_id}&${user_name}&${payment_amount}&${channel_type}&${channel_name}&${pay_name}&${pay_type}&${client}&${proxy_user_id}&${proxy_name}&${package_id}&${token}`;
        window.open(url,"blank")
        
    }
    private async AxiosBankCardTransfer(){
        
        let current = this.state.data[this.state.cur];
        let data = new FormData();
        data.append('user_id',gHandler.UrlData.user_id);
        data.append('user_name',decodeURI(gHandler.UrlData.user_name));
        data.append('amount',String(this.state.money));
        data.append('channel_id',current.channel_id);
        data.append('pay_type',current.pay_type);
        data.append('client',gHandler.UrlData.client);
        data.append('proxy_user_id',gHandler.UrlData.proxy_user_id);
        data.append('proxy_name',decodeURI(gHandler.UrlData.proxy_name));
        data.append('package_id',gHandler.UrlData.package_id);
        data.append('order_type',"1");
        data.append('token',gHandler.token);
        let url = `${gHandler.UrlData.host}${Api.bankCardTransfer}`;
        let  response= await Axios.post(url,data).then(response=>{
            return response.data
        }).catch(err=>{  message.error(err) })
        this.setState({
            orderData:response.data
        })
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
    showModel = () => {
        this.setState({
            visible: true,
        });
        this.AxiosBankCardTransfer();
    };
    render (){
        let {title} = this.props;
        let mapChannel = ()=>{
            return this.state.data.map((item:any,index:number)=>{
                return <div key={index} className= {`flex-box ${this.state.cur===index?"cur-border":"normal-border"}`} 
                    style={{width:'150px',height:"30px",marginLeft:'10px'}} 
                    onClick={()=>this.changeChannel(index)}
                >
                    {item.name} 
                </div>
            })
        }
        let span_amount = this.state.data[this.state.cur].span_amount.split(",");
        let mapUsedAmount = ()=>{
            return span_amount.map((item:any,index)=>{
                return <div key={index} className= "flex-box hover-border"
                    style={{width:'150px',height:"30px",marginLeft:'10px',marginBottom:'5px'}} 
                    onClick={()=>this.usedAmountClick(item)}
                >
                    {item}
                </div>
            })
        }
        return (
            <div>
                <div style={{height:'40px',borderBottom:'1px solid black',padding:'0px 5px'}}>{title}充值 (充值比例 1元 = 1金币)</div>
                <div className="flex-box" style={{height:'60px',padding:'0px 5px',marginTop:'20px',justifyContent:'flex-start'}} >
                    <span>充值渠道 </span>
                    <div style={{display:'flex',marginLeft:'20px'}}> { mapChannel() } </div>
                </div>
                <div className="flex-box" style={{height:'60px',padding:'0px 5px',marginTop:'20px',justifyContent:'flex-start'}} >
                    <span>充值金额 </span>
                    <div style={{display:'flex',marginLeft:'20px'}}> 
                        <InputNumber style={{marginLeft:"10px",width:'150px'}} value={this.state.money} min ={0} onChange={(e)=>this.changeMoney(e)}></InputNumber>
                        <div className="flex-box" style={{marginLeft:'10px'}}>({this.state.data[this.state.cur].min_amount}-{this.state.data[this.state.cur].max_amount})</div>
                    </div>
                </div>
                <div className="flex-box" style={{height:'80px',padding:'0px 5px',marginTop:'20px',justifyContent:'flex-start'}} >
                    <span style={{flexShrink:0}}>常用金额 </span>
                    <div style={{display:'flex',marginLeft:'20px',flexWrap:'wrap'}}> {mapUsedAmount()} </div>
                </div>
                <div className="flex-box" style={{height:'80px'}} >
                    <Button type="primary" onClick={this.paymentClick}>充值</Button>
                </div>
                <OrderAlert 
                    orderData={this.state.orderData} 
                    visible={this.state.visible} 
                    handleCancel={()=>{
                        this.setState({
                            visible:false
                        })
                    }}
                ></OrderAlert> 
            </div>
        )
    }
}
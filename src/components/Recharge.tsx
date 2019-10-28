/*左侧导航组件*/
import React from 'react'
import {gHandler} from '../lib/gHandler'
import { Api } from '../lib/Api';
import Axios from 'axios';
import {message} from 'antd';
import {AliPayPaymentIndex,} from '../interface/pay_interface';
import { InputNumber } from 'antd';
interface Props {
    title:string,
    IndexResults:AliPayPaymentIndex
}
interface State {
    data:{}[],
    cur:number,
    money:number,
}
export default class Recharge extends React.Component<Props,State>{
    state = {
        data:[
            {
                channel_id:'',//渠道id
                created_at:'',//创建时间
                id :'',
                max_amount:'',//最大充值金额
                min_amount:'',//最小充值金额
                name:'',//渠道显示名称
                nick_name:'',//渠道名称
                pay_type:'',//充值类型
                rate:'',//费率
                seed:'',
                sort:'',//排序
                span_amount:'',//充值范围
                status:'',
                type:'',
                updated_at:'',//更新时间
            }
        ],
        cur:0,
        money:0
    }
    componentDidMount(){
        this.setData(this.props)
    }
    componentWillReceiveProps(prpos:Props){
        this.setData(prpos)
        
    }
    /**
     * 根据pros，确定显示的数据
     * @param props 
     */
    setData(props:Props){
        let {IndexResults,title} = props;
        if (title === '支付宝'){ this.setState({ data:IndexResults.data.alipay }) } 
        else if( title === '转账到银行卡'){ this.setState({ data:IndexResults.data.bankcard_transfer }) }
        else if( title === '银联扫码'){ this.setState({ data:IndexResults.data.union_pay }) }
        else if( title === '微信'){ this.setState({ data:IndexResults.data.wechat_pay }) }
        else if( title === '快捷支付'){ this.setState({ data:IndexResults.data.quick_pay }) }
        else if( title === '网银支付'){ this.setState({ data:IndexResults.data.bank_pay }) }
    }
    private async AxiosIndex(){
        let url = `${gHandler.UrlData.imHost}${Api.aliPayPaymentIndex}?user_id=${gHandler.UrlData.user_id}&token=${gHandler.token}`;
        let  response= await Axios.get(url).then(response=>{
            return response.data
        }).catch(err=>{  message.error(err) })
    }
    /**
     * 切换渠道
     * @param index 
     */
    changeChannel(index:number){
        this.setState({
            cur:index
        })
    }
    /**
     * 常用金额
     * @param index 
     */
    usedAmountClick=(e:number)=>{
        console.log(this.state.money)
        this.setState({
            money:this.state.money+Number(e)
        })
    }
    render (){
        let {IndexResults,title} = this.props;
        console.log(this.state.data)
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
                <div style={{height:'40px',borderBottom:'1px solid black',padding:'0px 5px'}}>{title}充值</div>
                <div className="flex-box" style={{height:'60px',padding:'0px 5px',marginTop:'20px',justifyContent:'flex-start'}} >
                    <span>充值渠道 </span>
                    <div style={{display:'flex',marginLeft:'20px'}}> { mapChannel() } </div>
                </div>
                <div className="flex-box" style={{height:'60px',padding:'0px 5px',marginTop:'20px',justifyContent:'flex-start'}} >
                    <span>充值金额 </span>
                    <div style={{display:'flex',marginLeft:'20px'}}> 
                        <InputNumber style={{marginLeft:"10px",width:'150px'}} value={this.state.money} max ={Number(span_amount[span_amount.length-1])}></InputNumber>
                        <div className="flex-box" style={{marginLeft:'10px'}}>({this.state.data[this.state.cur].min_amount}-{this.state.data[this.state.cur].max_amount})</div>
                    </div>
                </div>
                <div className="flex-box" style={{height:'80px',padding:'0px 5px',marginTop:'20px',justifyContent:'flex-start'}} >
                    <span style={{flexShrink:0}}>常用金额 </span>
                    <div style={{display:'flex',marginLeft:'20px',flexWrap:'wrap'}}> {mapUsedAmount()} </div>
                </div>
            </div>
        )
    }
}
/*左侧导航组件*/
import React from 'react'
import {gHandler} from '../lib/gHandler'
import { Api } from '../lib/Api';
import Axios from 'axios';
import {message} from 'antd';
import {AliPayPaymentIndex,} from '../interface/pay_interface';
interface Props {
    title:string,
    IndexResults:AliPayPaymentIndex
}
interface State {
    data:{}[],
    cur:number
}
export default class Recharge extends React.Component<Props,State>{
    state = {
        data:[],
        cur:0
    }
    componentDidMount(){
        this.setData(this.props)
    }
    componentWillReceiveProps(prpos:Props){
        this.setData(prpos)
        
    }
    setData(props:Props){
        let {IndexResults,title} = props;
        if (title === '支付宝'){
            this.setState({ data:IndexResults.data.alipay })
        } 
        else if( title === '转账到银行卡'){
            this.setState({ data:IndexResults.data.bankcard_transfer })
        }
        else if( title === '银联扫码'){
            this.setState({ data:IndexResults.data.union_pay })
        }
        else if( title === '微信'){
            this.setState({ data:IndexResults.data.wechat_pay })
        }
        else if( title === '快捷支付'){
            this.setState({ data:IndexResults.data.quick_pay })
        }
        else if( title === '网银支付'){
            this.setState({ data:IndexResults.data.bank_pay })
        }
    }
    private async AxiosIndex(){
        let url = `${gHandler.UrlData.imHost}${Api.aliPayPaymentIndex}?user_id=${gHandler.UrlData.user_id}&token=${gHandler.token}`;
        let  response= await Axios.get(url).then(response=>{
            return response.data
        }).catch(err=>{  message.error(err) })
    }
    changeChannel(index:number){
        this.setState({
            cur:index
        })
    }
    render (){
        let {IndexResults,title} = this.props;
        console.log(this.state.data)
        let mapData = ()=>{
            return this.state.data.map((item:any,index:number)=>{
                return <div key={index} className= {`flex-box ${this.state.cur===index?"cur-border":"normal-border"}`} 
                            style={{width:'150px',height:"30px",marginLeft:'10px'}} 
                            onClick={()=>this.changeChannel(index)}
                        >
                            {item.name}
                        </div>
            })
        }
        return (
            <div>
                <div style={{height:'40px',borderBottom:'1px solid black',padding:'0px 5px'}}>{title}充值</div>
                <div className="flex-box" style={{height:'60px',padding:'0px 5px',marginTop:'20px',justifyContent:'flex-start'}} >
                    <span>充值渠道 </span>
                    <div style={{display:'flex',marginLeft:'20px'}}>
                        {
                            mapData()
                        }
                    </div>
                </div>
            </div>
        )
    }
}
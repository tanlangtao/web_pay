/*兑换组件*/
import React from 'react'
import {gHandler} from '../lib/gHandler'
import { Api } from '../lib/Api';
import Axios from 'axios';
import {message, Button} from 'antd';
import {DhResults,alipayBank,channelItem,ListItem} from '../interface/cash_interface';
import { InputNumber ,Modal} from 'antd';
import Cash from '../pages/cash/Cash';
interface Props {
    app:Cash,
    title:string,
    DhResults:DhResults
}
interface State {
    visible:boolean,
    data:alipayBank,
    cur:number,
    money:number,
    zfbAccount:ListItem,
    bankAccount:ListItem,
    account_num:string,
    account_id:string,
    account_type:number,
}
export default class Dh extends React.Component<Props,State>{
    state = {
        visible:false,
        data:{
            channel:[{
                channel_name:'',
                channel_type:0,
                is_close:0,
                max_amount:0,
                min_amount:0,
                sort:0,
            }],
            is_close:0,
            name:'',
            withdraw_type:1
        },
        cur:0,
        money:0,
        zfbAccount:{
            id:'',
            info:'',
            type:'',
            user_id:'',
        },
        bankAccount:{
            id:'',
            info:'',
            type:'',
            user_id:'',
        },
        account_num:'',
        account_id:'',
        account_type:0,
    }
    componentDidMount(){
        
        let list = this.props.DhResults.data.list;
        list.map((e:ListItem) => {
            if(e.type === "2"){
                this.setState({
                    zfbAccount:e
                },()=>{
                    this.setData(this.props)
                })
            }else if(e.type === "3"){
                this.setState({
                    bankAccount:e
                },()=>{
                    this.setData(this.props)
                })
            }
            return e
        });
        
    }
    UNSAFE_componentWillReceiveProps(props:Props){
        this.setData(props);
        //当props改变时候，初始值
        this.setState({
            money:0,
            cur:0
        })
    }
    componentWillUnmount(){
        this.setState = (state,callback)=>{
            return
        }
    }
    /**
     * 根据pros，确定显示的数据
     * @param props 
     */
    setData(props:Props){
        let {DhResults,title} = props;
        if (title === '支付宝兑换'&&DhResults.data.withDraw_info.alipay.is_close>0 ){ 
            this.setState({ data:DhResults.data.withDraw_info.alipay }) 
            this.setAccount(0);
        } 
        else if( title === '银行卡兑换' &&DhResults.data.withDraw_info.bankcard.is_close>0){ 
            this.setState({ data:DhResults.data.withDraw_info.bankcard })
            this.setAccount(1);
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
    changeMoney = (e :any)=>{
        this.setState({
            money:e
        })
    }
    /**
     * 点击兑换 
     * @param index 
     */
    dhClick=()=>{
        let min_amount = Number(this.state.data.channel[this.state.cur].min_amount);
        let max_amount = Number(this.state.data.channel[this.state.cur].max_amount);
        if(this.state.account_id===''){
            message.warn('未设置帐号，请选择其他方式!')
        }else if(!this.state.money){
            message.warn('金额不能为空！')
        }else if(this.state.money%50 !== 0){
            message.warn(`兑换金额必须是50的倍数!`)
        }else if(this.state.money<min_amount || this.state.money > max_amount){
            message.warn(`超出兑换范围!`)
        }else{
            this.setState({
                visible:true
            })
        }
    }
    handleCancel=()=>{
        this.setState({
            visible:false
        })
    }
    handleOk=()=>{
        this.setState({
            visible:false
        })
        this.Axios_withDrawApply()
    }
    private async Axios_withDrawApply(){
        let url = `${gHandler.UrlData.host}${Api.withDrawApply}`;
        let data = new FormData();
        data.append('user_id',gHandler.UrlData.user_id);
        data.append('user_name',decodeURI(gHandler.UrlData.user_name));
        data.append('account_id',`${this.state.account_id}`);
        data.append('amount',`${this.state.money}`);
        data.append('order_type',`${this.state.data.channel[this.state.cur].channel_type}`);
        data.append('withdraw_type',this.props.title==='支付宝兑换'?"1":"2");
        data.append('client',gHandler.UrlData.client);
        data.append('proxy_user_id',gHandler.UrlData.proxy_user_id);
        data.append('proxy_name',gHandler.UrlData.proxy_name);
        data.append('package_id',gHandler.UrlData.package_id);
        data.append('token',gHandler.token);
        let response = await Axios.post(url,data).then(response=>{
            return response.data
        }).catch(err=>{
            return null
        })
        if(response.status === 0){
            message.success('申请成功！');
            //更新余额
            this.props.app.AxiosIndex()
        }else{
            message.warn(response.msg);
        }
    }
    onChange =(value:any)=>{
        this.setState({
            money:value
        })
    }
    //设置帐号
    setAccount(index:number){
        let account_num = '';
        let account_id ='';
        let account_type=0;
        if(index ===0){
            if(this.state.zfbAccount.id==='') {
                account_num= '未设置';
                account_id =''
            }else{
                account_num = JSON.parse(this.state.zfbAccount.info).account_card
                account_id =  this.state.zfbAccount.id   
            }
            account_type =1;
            
        }else{
            if(this.state.bankAccount.id==='') {
                account_num= '未设置';
                account_id ='';
            }else{
                account_num= JSON.parse(this.state.bankAccount.info).card_num
                account_id=this.state.bankAccount.id
            }
            account_type =2;
        }
        this.setState({
            account_num:account_num,
            account_id:account_id,
            account_type:account_type,
        })
    }
    render (){
        let {title,DhResults} = this.props;
        let mapChannel = ()=>{
            return this.state.data.channel.map((item:channelItem,index:number)=>{
                return <div key={index} className= {`flex-box ${this.state.cur===index?"cur-border":"normal-border"}`} 
                    style={{width:'150px',height:"30px",marginRight:'10px'}} 
                    onClick={()=>this.changeChannel(index)}>
                    {item.channel_name} 
                </div>
            })
        }
        let current = this.state.data.channel[this.state.cur];
        let rate = Number(DhResults.data.package_rate) ;
        return (
            <div>
                <div style={{height:'40px',borderBottom:'1px solid black',padding:'0px 5px'}}>{title} (兑换比例 1元 = 1金币)</div>
                <div className="flex-box" style={{height:'40px',padding:'0px 5px',justifyContent:'flex-start',marginTop:'20px'}} >
                    <span>账户余额 </span>
                    <div style={{display:'flex',marginLeft:'20px'}}> {DhResults.data.game_gold.toFixed(2)} </div>
                </div>
                <div className="flex-box" style={{height:'40px',padding:'0px 5px',marginTop:'10px',justifyContent:'flex-start'}} >
                    <span>兑换方式 </span>
                    <div style={{display:'flex',marginLeft:'20px'}}> { mapChannel() } </div>
                </div>
                <div className="flex-box" style={{height:'40px',padding:'0px 5px',marginTop:'10px',justifyContent:'flex-start'}} >
                    <span>兑换帐号 </span>
                    <div style={{display:'flex',marginLeft:'20px'}}> { this.state.account_num } </div>
                </div>
                <div className="flex-box" style={{height:'40px',padding:'0px 5px',marginTop:'10px',justifyContent:'flex-start'}} >
                    <span>兑换金额 </span>
                    <div style={{display:'flex',marginLeft:'20px'}}> 
                        <InputNumber style={{width:'150px'}} value={this.state.money} min ={0} onChange={this.onChange}></InputNumber>
                        <div className="flex-box" style={{marginLeft:'20px'}}>({current.min_amount}-{current.max_amount})</div>
                    </div>
                </div>
                <div className="flex-box" style={{height:'80px'}} >
                    <Button type="primary" onClick={this.dhClick}>兑换</Button>
                </div>
                <Modal
                    title="确认兑换"
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    width ='400px'
                    style={{minWidth:'400px'}}
                >
                    { `申请兑换金额为${this.state.money},扣除手续费${this.state.money*rate},实际到账金额为${this.state.money -this.state.money*rate},确认要提交兑换申请吗？`}
                </Modal>
            </div>
        )
    }
}
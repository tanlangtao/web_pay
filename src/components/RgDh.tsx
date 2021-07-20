/*人工兑换组件*/
import React from 'react'
import { Api } from '../lib/Api';
import Axios from 'axios';
import {message,Avatar,Icon,Button,Modal,InputNumber} from 'antd';
import {RgDcResults,RgDcItem,ListItem} from "../interface/pay_interface"
import { gHandler } from '../lib/gHandler';

interface State {
    visible:boolean,
    visible2:boolean,
    IndexResults:RgDcResults,
    curItem:RgDcItem,
    money:number,
    DhResults:{},
    cur:number,
    zfbAccount:ListItem,
    bankAccount:ListItem,
    account_num:string,
    account_id:string,
    account_type:number,
}
export default class RgDh extends React.Component<{},State>{

    state= {
        visible:false,//model显隐
        visible2:false,
        IndexResults:{//客服列表
            code:-1,
            msg:'',
            count:0,
            data:[
                {
                    create_time:0,
                    nick_name:'test',
                    package_ids:'',
                    sort:0,
                    status:0,
                    update_time:0,
                    user_id:'',
                    user_type:''
                }
            ]
        },
        curItem:{//当前选择的客服信息
            create_time:0,
            nick_name:'test',
            package_ids:'',
            sort:0,
            status:0,
            update_time:0,
            user_id:'',
            user_type:''
        },
        DhResults:{
            msg:'',
            status:0,
            data:{
                channel_rate:0,
                game_gold:'test',
                is_password:'',
                list:[
                    {
                        id:'',
                        info:'',
                        type:'',
                        user_id:'',
                    }
                ],
                package_rate:'',
                update_time:0,
                withDraw_info:{
                    alipay:{
                        channel:[],
                        is_close:0,//开关
                        name:'',
                        withdraw_type:''
                    },
                    artificial:{
                        is_close:0,
                        max_amount:0,
                        min_amount:0,
                        name:"",
                        rate:0,
                        withdraw_type:3,
                    },
                    bankcard:{
                        channel:[],
                        is_close:0,//开关
                        name:'',
                        withdraw_type:''
                    },
                },
            }
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
        this.AxiosImlist();
        this.AxiosIndex();
    }
    componentWillUnmount(){
        this.setState = (state,callback)=>{
            return
        }
    }
    private async AxiosImlist(){
        let url = `${gHandler.UrlData.imHost}${Api.imlist}?skip=0&limit=6&token=c7a9d6g21v87s&package_id=${gHandler.UrlData.package_id}&user_type=1`;
        let  response= await Axios.get(url).then(response=>{
            return response.data
        }).catch(err=>{  message.error(err) })
        this.setState({
            IndexResults:response
        })
        if(this.state.IndexResults.code !== 0){
            message.error(this.state.IndexResults.msg)
        }
    }
    private async AxiosIndex(){
        let user_id = `user_id=${gHandler.UrlData.user_id}`;
        let package_id = `package_id=${gHandler.UrlData.package_id}`;
        let token = `token=${gHandler.token}`;
        let url = `${gHandler.UrlData.host}${Api.index}?${user_id}&${package_id}&${token}`;
        let  response= await Axios.get(url).then(response=>{
            return response.data
        }).catch(err=>{  message.error(err) })
        this.setState({
            DhResults:response
        })
        let list = response.data.list;
        list.map((e:ListItem) => {
            if(e.type === "2"){
                this.setState({
                    zfbAccount:e
                },()=>{
                    this.setAccount(this.state.cur)
                })
            }else if(e.type === "3"){
                this.setState({
                    bankAccount:e
                },()=>{
                    this.setAccount(this.state.cur)
                })
            }
            return e
        });
    }
    private async Axios_withDrawApply(){
        let url = `${gHandler.UrlData.host}${Api.RgDhwithDrawApply}`;
        let data = new FormData();
        data.append('user_id',gHandler.UrlData.user_id);
        data.append('user_name',decodeURI(gHandler.UrlData.user_name));
        data.append('replace_id',this.state.curItem.user_id);
        data.append('replace_name',this.state.curItem.nick_name);
        data.append('account_id',`${this.state.account_id}`);
        data.append('amount',`${this.state.money}`);
        data.append('order_type','4');
        data.append('withdraw_type','3');
        data.append('account_type',`${this.state.account_type}`);
        data.append('client',gHandler.UrlData.client);
        data.append('proxy_user_id',gHandler.UrlData.proxy_user_id);
        data.append('proxy_name',gHandler.UrlData.proxy_name);
        data.append('package_id',gHandler.UrlData.package_id);
        data.append('token',gHandler.token);
        let response = await Axios.post(url,data).then(response=>{
            return response.data
        }).catch(err => { message.error(err)} )
        if(response.status === 0){
            message.success('申请成功！');
            //更新余额
            this.AxiosIndex();
            //唤起IM
        }else{
            message.info(response.msg)
        }
    }
    /**
     * 显示Model
     */
    showModal = (item:RgDcItem) => {
        this.setState({
            visible: true,
            curItem :item,
        });
    };
    /**
     * 确认兑换
     */
    handleOk = (e:any) => {
        let artificial = this.state.DhResults.data.withDraw_info.artificial//人工兑换
        if(this.state.account_id===''){
            message.warn('未设置帐号，请选择其他方式!')
        }else if(!this.state.money){
            message.warn('金额不能为空！')
        }else if(this.state.money%50 !== 0){
            message.warn(`兑换金额必须是50的倍数!`)
        }else if(this.state.money<artificial.min_amount || this.state.money > artificial.max_amount){
            message.warn(`超出兑换范围!`)
        }else{
            this.setState({
                visible2:true,
            })
        }
    };
    /**
     * 取消
     */
    handleCancel = (e:any) => {
        this.setState({
            visible: false,
            visible2:false,
        });
    };
    handleOkDh = ()=>{
        this.setState({
            visible:false,
            visible2:false,
        })
        this.Axios_withDrawApply()
    }
    onChange =(value:any)=>{
        this.setState({
            money:value
        })
    }
    /**
     * 切换渠道
     * @param index 
     */
    changeChannel(index:number){
        this.setState({
            cur:index,
        })
        this.setAccount(index);
    }
    //设置帐号
    setAccount(index:number){
        let account_num,account_id,account_type =null;
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
        let mapData = ()=>{
            let data = this.state.IndexResults.data.sort((a,b)=> a.sort-b.sort)
            return data.map((item,index)=>{
                return  <div key={index} style={{width:'100%',height:100,border:"1px solid rgb(237,240,243)",
                    display:"flex",alignItems:'space-between',margin:'0 auto',
                    flexDirection:'row',justifyContent:'space-between'
                }}
                >
                    <div style={{width:'50%',height:100,padding:'10px 20px',
                        display:"flex",alignItems:'flex-start',
                        flexDirection:'column',justifyContent:'space-between'
                    }}>
                        <div style ={{width:'100%'}}>
                            <Avatar src={require(`../asses/icon/${index+1}.png`)} />
                            <span style={{marginLeft:'10px'}}>{item.nick_name}</span>
                        </div>
                        <div style ={{width:'100%'}}>
                            <img src={require('../asses/rgdc/guanfang.png')} width="100px"  alt=""/>
                            <img src={require('../asses/rgdc/zhuanxkf.png')} width="100px" style ={{marginLeft:'10px'}} alt=""/>
                            <span style ={{marginLeft:'10px'}}>月评级5星+</span>
                        </div>
                    </div>
                    <div style={{width:'13%',height:100,padding:'10px 20px',
                        display:"flex",alignItems:'center',
                        flexDirection:'column',justifyContent:'space-between'
                    }}>
                        <div style ={{width:'100%',display:"flex",justifyContent:'space-between'}}>
                            <Icon type='alipay' style={{fontSize:25,color:"#1296db"}}/>
                            <Icon type='credit-card' style={{fontSize:25,color:"#1296db"}} />
                            {/* <Icon type='wechat'style={{fontSize:25,color:"#0e932e"}} /> */}
                        </div>
                        <Button type="primary" onClick={()=>this.showModal(item)}>
                            兑换
                        </Button>
                    </div>
                </div>
            })
        }
        let mapChannel = ()=>{
            var arr = ['支付宝','银行卡']
            return arr.map((item,index)=>{
                return <div  key={index} className= {`flex-box ${this.state.cur===index?"cur-border":"normal-border"}`} 
                    style={{width:'100px',height:"30px",marginRight:'10px'}} onClick={()=>this.changeChannel(index)}>{item}
                </div>
            })
        }
        let artificial = this.state.DhResults.data.withDraw_info.artificial//人工兑换
        return (
            <div>{mapData()}
                <Modal
                    title="人工兑换"
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    width ='400px'
                    style={{minWidth:'400px'}}
                >
                    <div className="flex-box" style={{height:'40px',padding:'0px 5px',justifyContent:'flex-start'}} >
                        <span>账户余额  </span>
                        <div style={{display:'flex',marginLeft:'20px'}}> {Number(this.state.DhResults.data.game_gold).toFixed(2)} </div>
                    </div>
                    <div className="flex-box" style={{height:'40px',padding:'0px 5px',marginTop:'10px',justifyContent:'flex-start'}} >
                        <span>兑换方式 </span>
                        <div style={{display:'flex',marginLeft:'20px'}}> { mapChannel() } </div>
                    </div>
                    <div className="flex-box" style={{height:'40px',padding:'0px 5px',marginTop:'10px',justifyContent:'flex-start'}} >
                        <span>兑换帐号 </span>
                        <div style={{display:'flex',marginLeft:'20px'}}> {
                            this.state.account_num
                        } </div>
                    </div>
                    <div className="flex-box" style={{height:'40px',padding:'0px 5px',marginTop:'10px',justifyContent:'flex-start'}} >
                        <span>兑换金额 </span>
                        <div style={{display:'flex',marginLeft:'20px'}}> 
                            <InputNumber style={{width:'150px'}} value={this.state.money} min ={0} onChange={this.onChange}></InputNumber>
                            <div className="flex-box" style={{marginLeft:'10px'}}>({artificial.min_amount}-{artificial.max_amount})</div>
                        </div>
                    </div>
                </Modal>
                <Modal
                    title="确认兑换"
                    visible={this.state.visible2}
                    onOk={this.handleOkDh}
                    onCancel={this.handleCancel}
                    width ='400px'
                    style={{minWidth:'400px'}}
                >
                    { `申请兑换金额为${this.state.money},扣除手续费${this.state.money*artificial.rate},实际到账金额为${this.state.money -this.state.money*artificial.rate},确认要提交兑换申请吗？`}
                </Modal>
            </div>
        )
    }
}
/*人工代充组件*/
import React from 'react'
import {gHandler} from '../lib/gHandler'
import { Api } from '../lib/Api';
import Axios from 'axios';
import {message,Avatar,Icon,Button,Modal,InputNumber} from 'antd';
import {RgDcResults,RgDcItem} from "../interface/pay_interface";
interface State {
    visible:boolean,
    IndexResults:RgDcResults,
    curItem:RgDcItem,
    money:number,
}
export default class RgDc extends React.Component<{},State>{
    state= {
        visible:false,//model显隐
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
        money:100,
    }
    componentDidMount(){
        this.AxiosIndex()
    }
    componentWillUnmount(){
        this.setState = (state,callback)=>{
            return
        }
    }
    private async AxiosIndex(){
        let url = `${gHandler.UrlData.imHost}${Api.imlist}?skip=0&limit=6&token=c7a9d6g21v87s&package_id=${gHandler.UrlData.package_id}&user_type=1`;
        let  response= await Axios.get(url).then(response=>{
            return response.data
        }).catch(err=>{ 
            message.error(err) 
        })
        this.setState({
            IndexResults:response
        })
        if(this.state.IndexResults.code !== 0){
            message.error(this.state.IndexResults.msg)
        }
    }
    private async Axios_checkOrder(){
        let self = this;
        let url = `${gHandler.UrlData.host}${Api.checkOrder}?user_id=${gHandler.UrlData.user_id}&token=${gHandler.token}`;
        let response= await Axios.get(url).then(response=>{ 
            return response.data
        }).catch(err=>{ message.error(err) })
        if(response.status === 0){
            //判断是否存在订单
            if(response.data.is_exist === 0){
                self.Axios_artificialVerify()
            }else{
                message.info('上一笔交易未完成！，请先至聊天工具里取消订单！')
            }
        }else{
            message.warn(response.msg)
        }
    }
    private async Axios_artificialVerify(){
        let self = this;
        let url = `${gHandler.UrlData.imHost}${Api.artificialVerify}`;
        let data = new FormData();
        data.append('user_id',gHandler.UrlData.user_id);
        let response = await Axios.post(url,data).then(response=>{
            return response.data
        }).catch(err => { message.error(err)} )
        if(response.code === 0){
            self.Axios_artificial()
        }else{
            message.info(response.msg)
        }
    }
    private async Axios_artificial(){
        let url = `${gHandler.UrlData.imHost}${Api.artificial}`;
        let data = new FormData();
        data.append('user_id',gHandler.UrlData.user_id);
        data.append('user_name',decodeURI(gHandler.UrlData.user_name));
        data.append('replace_id',this.state.curItem.user_id);
        data.append('replace_name',this.state.curItem.nick_name);
        data.append('gold',`${this.state.money}`);
        data.append('amount',`${this.state.money}`);
        data.append('exchange_price','1');
        data.append('client',gHandler.UrlData.client);
        data.append('proxy_user_id',gHandler.UrlData.proxy_user_id);
        data.append('proxy_name',gHandler.UrlData.proxy_name);
        data.append('package_id',gHandler.UrlData.package_id);
        data.append('token',gHandler.token);
        let response = await Axios.post(url,data).then(response=>{
            return response.data
        }).catch(err => { message.error(err)} )
        if(response.code === 0){
            message.success('操作成功,请到聊天中心交易！');
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
     * 确认充值
     */
    handleOk = (e:any) => {
        
        if(this.state.money){
            this.Axios_checkOrder()
            this.setState({
                visible: false,
            }); 
        }else{
            message.warn('金额不能为空！')
        }
        
    };
    /**
     * 取消
     */
    handleCancel = (e:any) => {
        this.setState({
            visible: false,
        });
    };
    onChange =(value:any)=>{
        this.setState({
            money:value
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
                                    <Icon type='wechat'style={{fontSize:25,color:"#0e932e"}} />
                                </div>
                                <Button type="primary" onClick={()=>this.showModal(item)}>
                                    充值
                                </Button>
                            </div>
                        </div>
            })
        }
        return (
            <div>{mapData()}
                <Modal
                    title="输入充值金额"
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    width ='400px'
                    style={{minWidth:'400px'}}
                >
                    <InputNumber min={1} max={5000} defaultValue={100} onChange={this.onChange} />
                </Modal>
            </div>
        )
    }
}
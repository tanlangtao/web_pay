import React ,{Component} from 'react';
import { Layout, Menu, Icon, message } from 'antd';
import { gHandler } from '../../lib/gHandler';
import { Api } from '../../lib/Api';
import Axios from 'axios';
import {AliPayPaymentIndex} from '../../interface/pay_interface';
import './Pay.scss';
import RgDc from '../../components/RgDc';
import Recharge from '../../components/Recharge';
import RechargeHistory from '../../components/RechargeHistory';
const { Header, Content, Sider } = Layout;
interface arrItem {
    text:string,
    icon:string
}
interface State{
    navArr :arrItem[],
    title :string
}
export default class Pay extends Component<{}, State> {
    state = {
        navArr:[{
            text:'',
            icon:'dollar'
        }],
        title:'专享快付'
    }
    componentDidMount() {
        this.AxiosIndex()
    }
    IndexResults :AliPayPaymentIndex={
        data:{
            alipay:[],
            bank_pay:[],
            bankcard_transfer:[],
            interval:[],
            quick_pay:[],
            union_pay:[],
            wechat_pay:[]
        },
        msg:'',
        status:-1
    }
    //请求首页
    private async  AxiosIndex(){
        let url = `${gHandler.UrlData.host}${Api.aliPayPaymentIndex}?user_id=${gHandler.UrlData.user_id}&token=${gHandler.token}`;
        let response = await Axios.get(url).then(response=>{
           return response.data
        }).catch(err=>{
            message.error(err)
        })
        this.IndexResults = response;
        if(this.IndexResults.status === 0){
            this.setNavArr()
        }else{
            message.error(this.IndexResults.msg)
        }
    }
    private setNavArr(){
        var arr = [{icon:'aliwangwang',text :'专享快付' }];
        if (this.IndexResults.data.alipay.length > 0 ) { arr.push({icon:'alipay-circle',text :'支付宝', })}
        if (this.IndexResults.data.bankcard_transfer.length > 0 ) {arr.push({icon:'credit-card',text :'转账到银行卡' } )}
        if (this.IndexResults.data.union_pay.length > 0 ) {arr.push({icon:'credit-card',text :'银联扫码' } )}
        if (this.IndexResults.data.wechat_pay.length > 0 ) { arr.push({icon:'wechat',text :'微信' } )}
        if (gHandler.UrlData.client==='desktop' && this.IndexResults.data.quick_pay.length > 0 ) { arr.push({icon:'credit-card',text :'快捷支付'} )}
        if (gHandler.UrlData.client==='desktop' && this.IndexResults.data.bank_pay.length > 0  ) {arr.push({icon:'credit-card',text :'网银支付'}) }
        arr.push({icon:'unordered-list',text:'充值历史'})
        this.setState({
            navArr:arr
        })
    }
    private setTitle(item:any){
        this.setState({
            title:item.item.props.title
        })
    }
    render() {
        //渲染左侧导航
        let mapNav=()=>{
            return this.state.navArr.map((item,index)=>{
                return <Menu.Item key={index} title={item.text} onClick={this.setTitle.bind(this)}>
                    <Icon type={item.icon} />
                    <span className="nav-text">{item.text}</span>
                </Menu.Item>
            })
        }
        return (
            <Layout className='pay'>
                <Sider
                    trigger={null} collapsible 
                    theme ='light'
                    className='pay_sider'
                >
                    <div className="pay_logo" />
                    <Menu theme="light" mode="inline" defaultSelectedKeys={[`0`]}>{mapNav()}</Menu>
                </Sider>
                <Layout className ='rightLayout'>
                    <Header style={{ background: '#fff', padding: 0,minWidth:750 }}>
                        <div className='headerBox'>充值</div>
                    </Header>
                    <Content className="pay_content">
                        <div style={{ padding: 24, background: '#fff', minHeight: 500 ,height:"100%",minWidth:750}}>
                            {
                                this.state.title==='专享快付' ? <RgDc/>:(this.state.title==='充值历史'?<RechargeHistory/>:<Recharge title ={this.state.title} IndexResults={this.IndexResults}/>)
                            }
                        </div>
                    </Content>
                </Layout>
            </Layout>
        )
    }
}
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
        let url = `${gHandler.UrlData.host}${Api.aliPayPaymentIndex}?user_id=${gHandler.UrlData.user_id}&token=${gHandler.token}&center_auth=${gHandler.UrlData.center_auth}`;
        let response = await Axios.get(url).then(response=>{
            return response.data
        }).catch(err=>{
            return message.error("failed to load response data")
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
                return <Menu.Item  
                    key={index} 
                    title={item.text} 
                    onClick={this.setTitle.bind(this)}
                    className="nav-item"
                >
                    <Icon 
                        type={item.icon} 
                        className="nav-icon"
                    />
                    <span className="nav-text">{item.text}</span>
                </Menu.Item>
            })
        }
        return (
            <Layout className='pay'>
                <Header className='headerBox' style={{ background: '#fff', padding: 0,minWidth:650 }}>
                    充值
                </Header>
                <Layout className ='rightLayout'>
                    <Sider
                        trigger={null} collapsible 
                        theme ='light'
                        className='pay_sider'
                        width='30vh'
                    >
                        <Menu theme="light" mode="inline" defaultSelectedKeys={[`0`]}>{mapNav()}</Menu>
                    </Sider>
                    <Content className="pay_content">
                        {
                            this.state.title==='专享快付' ? <RgDc/>:(this.state.title==='充值历史'?<RechargeHistory/>:<Recharge title ={this.state.title} IndexResults={this.IndexResults}/>)
                        }
                    </Content>
                </Layout>
            </Layout>
        )
    }
}
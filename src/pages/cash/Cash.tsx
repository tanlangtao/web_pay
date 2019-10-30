import React ,{Component} from 'react';
import { Layout, Menu, Icon, message } from 'antd';
import { gHandler } from '../../lib/gHandler';
import { Api } from '../../lib/Api';
import Axios from 'axios';
import './Cash.scss';
import RgDh from '../../components/RgDh';
import Dh from '../../components/Dh';
import { DhResults } from '../../interface/cash_interface';
import DhHistory from '../../components/DhHistory';
const { Header, Content, Sider } = Layout;
interface arrItem {
    text:string,
    icon:string
}
interface State{
    navArr :arrItem[],
    title :string,
    DhResults:DhResults,
}
export default class Cash extends Component<{}, State> {
    state = {
        navArr:[{
            text:'',
            icon:'dollar'
        }],
        title:'人工兑换',
        DhResults:{
            msg:'',
            status:0,
            data:{
                channel_rate:'',
                game_gold:0,
                is_password:0,
                list:[
                    {
                        id:'',
                        info:'',
                        type:'',
                        user_id:'',
                    }
                ], 
                package_rate:'',
                withDraw_info:{
                    alipay:{
                        channel:[],
                        is_close:0,//开关
                        name:'',
                        withdraw_type:1,
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
                        withdraw_type:2,
                    },
                },
            }
        },
    }
    componentDidMount() {
        this.AxiosIndex()
    }
    public async AxiosIndex(){
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
        this.setNavArr()
    }
    private setNavArr(){
        let withDraw_info = this.state.DhResults.data.withDraw_info;

        var arr = [];
        if (withDraw_info.artificial.is_close > 0 ) {arr.push({icon:'aliwangwang',text :'人工兑换' } )}
        if (withDraw_info.alipay.is_close > 0 ) { 
            arr.push({icon:'alipay-circle',text :'支付宝兑换', })
            if(withDraw_info.artificial.is_close < 0){
                this.setState({
                    title:'支付宝兑换'
                })
            }
        }
        if (withDraw_info.bankcard.is_close > 0 ) {
            arr.push({icon:'credit-card',text :'银行卡兑换' } )
            if(withDraw_info.artificial.is_close < 0&&withDraw_info.alipay.is_close < 0 ){
                this.setState({
                    title:'银行卡兑换'
                })
            }
        }
        arr.push({icon:'unordered-list',text:'兑换记录'})
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
            <Layout className='cash'>
                <Sider
                    trigger={null} collapsible 
                    theme ='light'
                    className='pay_sider'
                >
                    <div className="cash_logo" />
                    <Menu theme="light" mode="inline" defaultSelectedKeys={[`0`]}>{mapNav()}</Menu>
                </Sider>
                <Layout className ='cash_rightLayout'>
                    <Header style={{ background: '#fff', padding: 0,minWidth:750 }}>
                        <div className='cash_headerBox'>兑换</div>
                    </Header>
                    <Content className="cash_content">
                        <div style={{ padding: 24, background: '#fff', minHeight: 500 ,height:"100%",minWidth:750}}>
                            {
                                this.state.title==='人工兑换' ? <RgDh />: (this.state.title==='兑换记录'?<DhHistory/>:<Dh app={this} title ={this.state.title} DhResults={this.state.DhResults}/>)
                                
                            }
                        </div>
                    </Content>
                </Layout>
            </Layout>
        )
    }
}
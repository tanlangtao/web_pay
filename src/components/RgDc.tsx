/*左侧导航组件*/
import React from 'react'
import {gHandler} from '../lib/gHandler'
import { Api } from '../lib/Api';
import Axios from 'axios';
import {message,Avatar,Icon,Button,Modal,InputNumber} from 'antd';
interface RgDcItem{
    create_time:number,
    nick_name:string,
    package_ids:string,
    sort:number,
    status:number,
    update_time:number,
    user_id:string,
    user_type:string,
}

interface RgDcResults{
    code:number,
    msg:string,
    count:number,
    data:RgDcItem[]
}
interface State {
    visible:boolean,

    IndexResults:RgDcResults,
}
export default class RgDc extends React.Component<{},State>{

    state= {
        visible:false,
        IndexResults:{
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
        }
    }
    componentDidMount(){
        this.AxiosIndex()
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
        if(this.state.IndexResults.code === 0){
            console.log(this.state.IndexResults)
        }else{
            message.error(this.state.IndexResults.msg)
        }
    }
    showModal = (item:RgDcItem) => {
        this.setState({
          visible: true,
        });
    };
    
    handleOk = (e:any) => {
        this.setState({
            visible: false,
        }); 
    };
    
    handleCancel = (e:any) => {
        console.log(e);
        this.setState({
            visible: false,
        });
    };
    onChange =(value:string)=>{
        console.log('changed', value);
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
                            <div style={{width:'70%',height:100,padding:'10px 20px',
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
                    title="Basic Modal"
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                >
                    <InputNumber min={1} max={10} defaultValue={3} onChange={()=>this.onChange} />
             </Modal>
            </div>
        )
    }
}
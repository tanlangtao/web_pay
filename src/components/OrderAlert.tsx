import  React from 'react';
import {message,Modal} from 'antd';
import Clipboard from 'react-clipboard.js';
interface Props{
    orderData:any,
    visible:boolean,
    handleCancel:()=>void,
}
interface State {
    visible:boolean,
}
export default class OrderAlert extends React.Component<Props,State>{
    state={
        visible:false,
    }
    static getDerivedStateFromProps(props:Props,state:State){
        return {
            visible:props.visible
        }
    }
    /**
    * 确认
    */
    handleOk = (e:any) => {
        this.setState({
            visible: false,
        }); 
        console.log(this.props.handleCancel)
        this.props.handleCancel()
    };
    /**
    * 取消
    */
    handleCancel = (e:any) => {
        this.setState({
            visible: false,
        });
        this.props.handleCancel()
    };
    CopySuccess(text:string){
        message.success(`复制成功！${text}`)
    }
    render(){
        return (
            <Modal
                title="订单信息"
                visible={this.state.visible}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
                width ='600px'
                style={{minWidth:'400px'}}
            >
                <p>充值方式 : 银行卡转账</p>
                <p>用户昵称 : {this.props.orderData.user_name}</p>
                <p className='flex-box' style={{justifyContent:'space-between'}}>
                    <span>收款银行 : {this.props.orderData.bank_name} </span>
                    <Clipboard 
                        data-clipboard-text={`${this.props.orderData.bank_name}`} 
                        onSuccess={()=>this.CopySuccess(this.props.orderData.bank_name)}
                    >复制</Clipboard>
                </p>
                <p  className='flex-box' style={{justifyContent:'space-between'}}>
                    <span>收款账号 : {this.props.orderData.card_num}</span>
                    <Clipboard 
                        data-clipboard-text={`${this.props.orderData.card_num}`} 
                        onSuccess={()=>this.CopySuccess(this.props.orderData.card_num)}
                    >复制</Clipboard>
                </p>
                <p className='flex-box' style={{justifyContent:'space-between'}}>
                    <span>收款姓名 : {this.props.orderData.card_name}</span>
                    <Clipboard 
                        data-clipboard-text={`${this.props.orderData.card_name}`} 
                        onSuccess={()=>this.CopySuccess(this.props.orderData.card_name)}
                    >复制</Clipboard>
                </p>
                <p className='flex-box' style={{justifyContent:'space-between'}}>
                    <span>转账金额 : {Number(this.props.orderData.amount).toFixed(2)}</span>
                    <Clipboard 
                        data-clipboard-text={`${Number(this.props.orderData.amount).toFixed(2)}`} 
                        onSuccess={()=>this.CopySuccess(Number(this.props.orderData.amount).toFixed(2))}
                    >复制</Clipboard>
                </p>
                <p className='flex-box' style={{justifyContent:'space-between'}}>
                    <span>转账备注 : {this.props.orderData.remark}</span>
                    <Clipboard 
                        data-clipboard-text={`${this.props.orderData.remark}`} 
                        onSuccess={()=>this.CopySuccess(this.props.orderData.remark)}
                    >复制</Clipboard>
                </p>
                <div style={{fontSize:'12px'}}>
                    注意事项:
                    <div>1、请务必按照该金额(包括小数点)进行转账，并填写备注信息(为空则不填)；</div>
                    <div>2、请在30分钟内完成支付，超时系统将不予处理；</div>
                    <div>3、完成转账后，请在60分钟后查询您的账号余额，若未到账请及时联系在线客服；</div>
                    <div>4、此处仅支持个人网银转账，不支持ATM机、柜台、支付宝或其他方式转账；</div>
                </div>
            </Modal>
        )
    }
}
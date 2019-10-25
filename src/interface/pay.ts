export interface AliPayPaymentIndexData{
    alipay:[],
    bank_pay:[],
    bankcard_transfer:[],
    interval:[],
    quick_pay:[],
    union_pay:[],
    wechat_pay:[]
}
export interface AliPayPaymentIndex {
    data:AliPayPaymentIndexData,
    msg:string,
    status:number
}

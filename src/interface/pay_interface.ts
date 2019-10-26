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
export interface RgDcResults{
    code:number,
    msg:string,
    count:number,
    data:RgDcItem[]
}
export interface RgDcItem{
    create_time:number,
    nick_name:string,
    package_ids:string,
    sort:number,
    status:number,
    update_time:number,
    user_id:string,
    user_type:string,
}
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
export interface ListItem{
    id:string,
    info:string,
    type:string,
    user_id:string,
}
export interface orderData{
    amount:string,
    bank_name:string,
    card_name:string,
    card_num:string,
    remark:string,
    user_name:string,
}
export interface channelItem{
    channel_id:string,
    max_amount:string,
    min_amount:string,
    name:string,
    nick_name:string,
    pay_type:string,
    sort:string,
    span_amount:string,
}
//history
export interface RechargeHistrotyListItem{
    amount:string,
    type:string,
    arrival_amount:string,
    status:string,
    created_at:string,
    arrival_at:string,
    bank_name:string,
    card_name:string,
    card_num:string,
    user_name:string,
    remark:string,
}
export interface RechargeHistoryData{
    count:number,
    current_page:number,
    list:RechargeHistrotyListItem[],
    total_page:number,
}
export interface RechargeHistoryResults{
    data:RechargeHistoryData,
    msg:string,
    status:number,
}
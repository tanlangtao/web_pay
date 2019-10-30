export interface channelItem{
    channel_name:string,
    channel_type:number,
    is_close:number,
    max_amount:number,
    min_amount:number,
    sort:number,
}
export interface alipayBank{
    channel:channelItem[],
    is_close:number,
    name:string,
    withdraw_type:number,
}
export interface artificial{
    is_close:number,
    max_amount:number,
    min_amount:number,
    name:string,
    rate:number,
    withdraw_type:number,
}
export interface withDraw_info{
    alipay:alipayBank,
    artificial:artificial,
    bankcard:alipayBank,
}
export interface ListItem{
    id:string,
    info:string,
    type:string,
    user_id:string,
}
export interface DhData{
    channel_rate:string,
    game_gold:number,
    is_password:number,
    list:ListItem[],
    package_rate:string,
    withDraw_info:withDraw_info,
}
export interface DhResults{
    msg:string,
    status:number,
    data:DhData,
}
//history
export interface HistrotyListItem{
    amount:string,
    type:string,
    handling_fee:string,
    platform_rate:string,
    channel_rate:string,
    arrival_amount:string,
    status:string,
    created_at:string,
    arrival_at:string,
    user_remark:string,
}
export interface HistoryData{
    count:number,
    current_page:number,
    list:HistrotyListItem[],
    total_page:number,
}
export interface HistoryResults{
    data:HistoryData,
    msg:string,
    status:number,
}
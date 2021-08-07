
interface UrlData{
    user_id:string,
    user_name:string,
    client:string,
    proxy_user_id:string,
    proxy_name:string,
    package_id:string,
    host:string,
    imHost:string,
    path:string,
    env:string,
    center_auth:string,
    login_ip:string,
    regin_ip:string,
    device_id:string,
}
class gHandlerC  {

    public token:string='e40f01afbb1b9ae3dd6747ced5bca532'
    public UrlData :UrlData = {
        user_id:'',
        user_name:'',
        client:'',
        proxy_user_id:'',
        proxy_name:'',
        package_id:'',
        host:'',
        imHost:'',
        path:'',
        env:'',
        center_auth:'',
        login_ip:'',
        regin_ip:'',
        device_id:'',
    }
    constructor(){
        this.UrlData =this.getUrlData()
    }
    //获取url参数
    public getUrlData(){
        var path = window.location.search;
        var arr:any = {};
        path.slice(1).split('&').map(e => e.split('=')).forEach(e => arr[e[0]] = e[1]);
        if(arr.env==='dev'){
            this.token = 'e40f01afbb1b9ae3dd6747ced5bca532'
        }else if(arr.env ==='pre'){
            this.token = 'e40f01afbb1b9ae3dd6747ced5bca532'
        }else if(arr.env ==='online'){
            this.token = 'e40f01afbb1b9ae3dd6747ced5bca532'
        }

        return arr;
    }
    //时间戳转换
    public getTime(time :number){
        var date = new Date(time * 1000);    //根据时间戳生成的时间对象
        var m = date.getMonth() + 1 > 9 ? date.getMonth()+1 : `0${date.getMonth()+1}`;
        var d = date.getDate()  > 9 ? date.getDate(): `0${date.getDate()}`;
        var h = date.getHours()  > 9 ? date.getHours() : `0${date.getHours()}`;
        var minute = date.getMinutes()  > 9 ? date.getMinutes() : `0${date.getMinutes()}`;
        var s = date.getSeconds()  > 9 ? date.getSeconds(): `0${date.getSeconds()}`;
        var newDate =  m + "-" + d + " " + h + ":" + minute + ":" + s;
        return newDate;
    }
    
    public testBankNum(num:string){
        if (isNaN(Number(num))) {
            alert('传递参数错误，请检查！');
            return false;
        }
        var data = num.replace(/\s/g,'').replace(/(\d{4})\d+(\d{4})$/, "**** **** **** $2") ;
        return data;

    }
    public transitionTime(time:number){
        let transTime =``
        if(time <10){
            transTime = `0${time}:00`
        }else{
            if(time === 24){
                transTime = `23:59:59`
            }else{
                transTime = `${time}:00`
            }
            
        }
        return transTime
    }
    public getNodeScale(){
        return window.screen.height /375
    }
    public getLeftOff(){
        return window.screen.width - 667
    }
    public getTopOff10(){
        let topoff = window.screen.height - 375
        
        return topoff
    }
    public getTopOff12(){
        let topoff = window.screen.height - 375
        if(topoff <0){
            topoff =  375 - window.screen.height
        }
        return topoff
    }
    public getTopOff(){
        let topoff = window.screen.height - 375
        if(topoff <0){
            topoff =  0
        }
        return topoff
    }
    public getHeightDiff(){
        let fontSize = document.getElementsByTagName("html")[0].style.fontSize
        let neHeight=0
        if(fontSize){
            neHeight = Number(fontSize.slice(0,-2))/108
        }else{
            neHeight = 1
        }
        return neHeight
    }
    closewebview(){
        window.location.href = /Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent) ? "closewebview://a=1&b=2" :  "http://closewebview";
    }
}
export const gHandler = new gHandlerC()
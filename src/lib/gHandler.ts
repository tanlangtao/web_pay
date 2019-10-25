
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
    //保留两位小数
    public toDecimal(num :string) {
        var result = parseFloat(num);
        if (isNaN(result)) {
        alert('传递参数错误，请检查！');
        return '';
        }
        result = Math.round(Number(num) * 100) / 100;
        var s_x = result.toString();
        var pos_decimal = s_x.indexOf('.');
        if (pos_decimal < 0) {
        pos_decimal = s_x.length;
        s_x += '.';
        }
        while (s_x.length <= pos_decimal + 2) {
        s_x += '0';
        }
        return s_x;
    }
    //保留一位小数
    public toDecimal1(num:string) {
        var result = parseFloat(num);
        if (isNaN(result)) {
            alert('传递参数错误，请检查！');
            return false;
        }
        result = Math.round(Number(num) * 100) / 100;
        var s_x = result.toString();
        var pos_decimal = s_x.indexOf('.');
        if (pos_decimal < 0) {
        pos_decimal = s_x.length;
        s_x += '.';
        }
        while (s_x.length <= pos_decimal + 1) {
        s_x += '0';
        }
        return s_x;
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
}
export const gHandler = new gHandlerC()
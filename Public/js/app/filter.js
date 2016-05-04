//Filter
note.filter('trustHtml', function ($sce) {
    return function (input) {
        return $sce.trustAsHtml(input);
    }
});
note.filter('subStr', function () {
    return function (input,limit) {
        //去掉所有的html标记
        return input.replace(/<[^>]+>/g,"").substr(0,limit);
    }
});
//保留浮点数的n位小数
note.filter('subFloat', function () {
    return function (input,bit) {
        return Math.round(input*Math.pow(10,bit))/Math.pow(10,bit);
    }
});
//将数字转为货币格式，考虑浮点的情况
note.filter('toCurrentFormat',function(){
    /*return function (input) {
        var arr = input.split('').reverse();
        for(var i=0,ilen=arr.length;i<ilen;i++){
            if((i+1)%3 === 0){
                arr.splice(i,0,',');
                i++;
                ilen++;
            }
        }
    }*/
    return function (input) {
        var str = parseFloat(input).toFixed(2).toString();
        console.log('str:',str);

        if(str.lastIndexOf('.') !== -1){
            var str_pre = str.substr(0,str.lastIndexOf('.'));//整数部分
            var float_str = str.substr(str.lastIndexOf('.'),str.length);//小数部分，包括小数点
        }
        else {var float_str = '.00';var str_pre = str;}
        return str_pre.replace( /\B(?=(?:\d{3})+$)/g, ',' )+float_str; 
    }
});
//计算占比
note.filter('countProportion', function () {
    return function (input,items) {
        var total = 0;
        for(var i=0,ilen=items.length;i<ilen;i++){
            total += parseFloat(items[i].value);
        }
        console.log('input:',input,'total:',total);
        return Math.round((input*100/total)*100)/100;
    }
});

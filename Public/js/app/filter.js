/*Filter*/
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
//为字符串加上颜色
note.filter('addColor', function () {
    return function (input,color) {
    	if(input < 0)
        	return '<span style="color:'+color+'">'+input+'</span>';
        else return input;
    }
});
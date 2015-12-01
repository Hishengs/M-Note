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

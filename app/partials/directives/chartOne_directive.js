/**
 * Created by XRene on 2015/10/31.
 */
app.directive('chartOne', function ($stateParams, $state) {
    return {
        restrict: 'EA',
        link: function (scope, ele, attr) {

            var theme_config = {
                chart: {
                  zoomType: 'x'
                },
                title: {
                    text: '水分',
                    x: -20 //center
                },
                xAxis: {
                    type: 'datetime',
                },
                yAxis: {
                    title: {
                        text: ''
                    },
                    plotLines: [{
                        value: 0,
                        width: 1,
                        color: '#808080'
                    }]
                },
                tooltip: {
                    valueSuffix: '',
                    crosshairs: true,
                    shared: true,
                    style: {
                        padding: 4
                    }
                },
                legend: {
                    layout: 'vertical',
                    align: 'right',
                    verticalAlign: 'middle',
                    borderWidth: 0
                },
                credits: {
                    enabled: false
                },
                series: []
            };


            scope.$watch('results', function (val) {
                theme_config.title.text = scope.selectedItem;
                switch (scope.selectedItem){
                    case '水份':
                        theme_config.tooltip.valueSuffix = '%';
                        break;
                    case '电压':
                        theme_config.tooltip.valueSuffix = 'V';
                        break;
                    case '水表':
                        theme_config.tooltip.valueSuffix = '';
                        break;
                    default:
                        break;
                }
                var keys = [];
                for(var item in val){
                    keys.push(item);
                };
                var dataList = [];
                for(var i = 0; i < keys.length ; i ++){
                    _.map(val[keys[i]], function (item) {
                        item[0] = (new Date(item[0])).valueOf() + 28800000; //时间必须加上8个小时
                        item[1] = +item[1].toFixed(2);  //注意将string类型转化成num类型
                    })
                    dataList[i] = {
                        name: keys[i],
                        data: val[keys[i]]
                    }
                };
                theme_config.series = dataList;
                $(ele).highcharts(theme_config);
            })
        }
    }
});
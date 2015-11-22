/**
 * Created by XRene on 2015/11/8.
 */
app.directive('chartTwo', function () {
    return {
        restrict: 'EA',
        link: function (scope, ele, attr) {
            var theme_config = {
                chart:{
                    type: 'column'
                },
                title: {
                    text: '',
                    x: -20 //center
                },
                xAxis: {
                    categories: []
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
                    shared: true
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
            }
            scope.$watch('displayData', function (data) {
                console.log(data);
                if(data.status === 0){
                    theme_config.title.text = data.title;
                    theme_config.xAxis.categories = data.data.categoriesAndId[0];
                    var _results = _.map(data.data.categoriesAndId[1], function (item) {
                        return +item.toFixed(3);
                    })
                    theme_config.series = [
                        {
                            name: data.title,
                            data: _results
                        }
                    ];
                    $(ele).highcharts(theme_config);
                }
            })
        }
    }
})
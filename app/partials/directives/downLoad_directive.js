/**
 * Created by XRene on 2015/11/22.
 */
app.directive('downLoad', function () {
    return {
        restrict: 'EA',
        replace: true,
        template: '<div class="select-item download-excal">导出Excel</div>',
        link: function (scope, ele) {
            ele.bind('click', function () {
                for(var i = 1; i < 5; i++){
                    tableExport('table' + i, '数据', 'xls');
                }
            })
        }
    }
})
/**
 * Created by XRene on 2015/10/31.
 */
app.controller('chartOneCtrl', function ($scope, $_http, $_yaq) {

    $scope.results = null;



    $scope.selectedArea = '1号采集点';
    $scope.selectArea = function (item) {
        $scope.selectedArea = item;
    };
    $scope.selectedItem = '水份';
    $scope.selectItem = function (item) {
        $scope.selectedItem = item;
    }
    $scope.selectedTime = '3天';
    $scope.selectTime = function (item) {
        $scope.selectedTime = item;
    };

    var param = {
        start_time: $_yaq.timeToInit($_yaq.selectTimeFn(3)[0]),
        end_time: $_yaq.timeToInit($_yaq.selectTimeFn(3)[1]),
        area: $scope.selectedArea,
        item: $scope.selectedItem
    }

    $scope.searchData = function () {
        var time_num = parseInt($scope.selectedTime);
        param.start_time = $_yaq.timeToInit($_yaq.selectTimeFn(time_num)[0]);
        param.end_time = $_yaq.timeToInit($_yaq.selectTimeFn(time_num)[1]);
        param.area = $scope.selectedArea;
        param.item = $scope.selectedItem;
        $_http.reqPostFn('/chart', param).then(function (data) {
            if(data.status === 0){
                $scope.series = 1;
                $scope.results = data.data;
                console.log(data.data);
            }
            return ;
        }, function (data) {
            console.log(data);
        })
    }
    //请求数据
    $scope.searchData();
});
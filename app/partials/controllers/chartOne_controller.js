/**
 * Created by XRene on 2015/10/31.
 */
app.controller('chartOneCtrl', function ($scope, $_http, $_yaq) {

    $scope.results = null;

    $scope.dataList = {
        '一天': 1,
        '一周': 7,
        '一个月': 30
    }

    $scope.selectedArea = '1号采集点';
    $scope.selectArea = function (item) {
        $scope.selectedArea = item;
    };
    $scope.selectedItem = '水份';
    $scope.selectItem = function (item) {
        $scope.selectedItem = item;
    }
    $scope.selectedTime = '一天';
    $scope.selectTimeVal = 1;
    $scope.selectTime = function (time, val) {
        $scope.selectedTime = time;
        $scope.selectTimeVal = val;
    };

    var param = {};

    $scope.searchData = function () {
        param.start_time = $_yaq.timeToInit($_yaq.selectTimeFn($scope.selectTimeVal)[0]);
        param.end_time = $_yaq.timeToInit($_yaq.selectTimeFn($scope.selectedTimeVal)[1]);
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
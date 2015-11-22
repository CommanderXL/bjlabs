/**
 * Created by XRene on 2015/11/13.
 */
app.controller('tableTotalCtrl', function ($scope, $stateParams, $_http, $_yaq) {
    $scope.timeList = {
        '日报表': 3,
        '周报表': 7,
        '月报表': 30
    };
    $scope.defaultTime = '日报表';
    $scope.defaultIndex = 3;
    $scope.selectTime = function (key, value) {
        $scope.defaultTime = key;
        $scope.defaultIndex = value;
    }
    $scope.getTableData = function () {
        var _param = {
            areaID: $stateParams.areaID,
            from: $_yaq.timeToInit($_yaq.selectTimeFn($scope.defaultIndex)[0]),
            to: $_yaq.timeToInit($_yaq.selectTimeFn($scope.defaultIndex)[1])
        };
        $_http.reqPostFn('/tables', _param).then(function (data) {
            $scope.$broadcast('to-child', data);
            console.log(data);
        }, function (data) {
            console.log(data);
        })
    }

    $scope.getTableData();
})
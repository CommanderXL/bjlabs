/**
 * Created by XRene on 2015/11/5.
 */
app.controller('displayCtrl', function ($scope, $_http, $_yaq) {

    var param = {
        area: '1号采集点',
        name: '水分'
    };

    $scope.selectedItem = '水分';
    $scope.selectItem = function (item) {
        $scope.selectedItem = item;
    }

    $scope.Area = '1号采集点';
    $scope.selectArea = function (item) {
        $scope.Area = item;
    }

    $scope.searchData = function () {
        startLoadData($scope.Area, $scope.selectedItem);
    }

    var startLoadData = function (area, item) {
        param.name = item;
        param.area = area;
        $_http.reqPostFn('/display', param).then(function (data) {
            $scope.dataList = null;
            if(data.status === 0){
                $scope.dataList = data.data;
            }
        }, function (data) {
            console.log(data);
        })
    }

    $_http.reqPostFn('/display', param).then(function (data) {
        if(data.status === 0){
            $scope.dataList = data.data;
            console.log($scope.dataList.valve[0].states1);
        }
    }, function (data) {
       console.log(data);
    });
});
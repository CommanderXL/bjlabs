/**
 * Created by XRene on 2015/11/13.
 */
app.controller('table3Ctrl', function ($scope) {
    console.log(3);
    $scope.dataList = {
        moisture: [],
        waterAmount: [],
        voltage: [],
        valve: []
    }
    $scope.$on('to-child', function (d, data) {
        console.log(data);
        data = data.data;
        $scope.dataList.moisture = data.moisture;
        $scope.dataList.voltage = data.voltage;
        $scope.dataList.valve = data.valve;
        $scope.dataList.waterAmount = data.wateramount;
    })
})
/**
 * Created by XRene on 2015/10/19.
 */
app.controller('chooseCtrl', function ($rootScope, $scope, $_http, $_socket) {

    $scope.default = {
        area: '一号采集点',
        areaID: 1
    }
    $scope.areaList = {
        '一号采集点': 1,
        '二号采集点': 2,
        '三号采集点': 3,
        '四号采集点': 4
    };
    //选择区域
    $scope.selectArea = function (key, value) {
        $scope.default.area = key;
        $scope.default.areaID = value;
    }
    //阀门状态
    $scope.getValve = {
        one: '',
        two: '',
        three: '',
        four: '',
        switch: '',
        open: '',
        system: '',
        check: ''
    }
    $_socket.on('test', function (msg) {
        console.log(msg);
        switch (msg.key) {
            case 'time':
                $scope.getTime.year = msg.data.year;
                $scope.getTime.month = msg.data.month;
                $scope.getTime.day = msg.data.day;
                $scope.getTime.hour = msg.data.hour;
                $scope.getTime.minutes = msg.data.minute;
                $scope.getTime.seconds = msg.data.second;
                break;
            case 'KB':
                $scope.sensorParams.getK = msg.kValue;
                $scope.sensorParams.getB = msg.bValue;
                break;
            case 'TD':
                $scope.limitParams.getT = msg.tValue;
                $scope.limitParams.getD = msg.dValue;
                break;
            case 'switch':
                console.log(msg);
                break;
            case 'state':
                $scope.getValve.one = msg.status[0];
                $scope.getValve.two = msg.status[1];
                $scope.getValve.three = msg.status[2];
                $scope.getValve.four = msg.status[3];
                $scope.getValve.switch = msg.status[4];
                $scope.getValve.open = msg.status[5];
                $scope.getValve.system = msg.status[6];
                $scope.getValve.check = msg.status[7];
                break;
            case 'water':
                $scope.sensorParams.getWaterOne = msg.moisture[0];
                $scope.sensorParams.getWaterTwo = msg.moisture[1];
                $scope.sensorParams.getWaterThree = msg.moisture[2];
                $scope.sensorParams.getWaterFour = msg.moisture[3];
                break;
            case 'voltage':
                $scope.sensorParams.getVoltageOne = msg.voltage[0];
                $scope.sensorParams.getVoltageTwo = msg.voltage[1];
                $scope.sensorParams.getVoltageThree = msg.voltage[2];
                $scope.sensorParams.getVoltageFour = msg.voltage[3];
                break;
            case 'wateramount':
                $scope.waterParams.valueOne = msg.water[0];
                $scope.waterParams.valueTwo = msg.water[1];
                $scope.waterParams.valueThree = msg.water[2];
                $scope.waterParams.valueFour = msg.water[3];
                break;
            default :
                break;
        }
        alert('设置成功');
    })

    //设置时间
    $scope.timeSendFn = function () {
        var param = {
                orderNum: 1,
                operation: 'set',
                addressNum: $scope.default.areaID
            };
            param.year = $scope.setTime.year;
            param.month = $scope.setTime.month;
            param.day = $scope.setTime.day;
            param.hour = $scope.setTime.hour;
            param.minute = $scope.setTime.minutes;
            param.second = $scope.setTime.minutes;
        console.log(param);
        $_http.reqPostFn('/', param).then(function (data) {
            console.log(data);
        }, function (err) {
            console.log(err);
        });
    };
    //读取时间
    $scope.getTime = {
        year: '',
        month: '',
        day: '',
        hour: '',
        minutes: '',
        seconds: ''
    };
    $scope.timeGetFn = function () {
        var param = {
            orderNum: 1,
            operation: 'get',
            addressNum: $scope.default.areaID
        };
        $_http.reqPostFn('/', param).then(function (data) {
            console.log(data);
        }, function (err) {
            console.log(err);
        });
    };
    //设置KB值
    $scope.setKB = function (index) {
        var param = {
            orderNum: 2,
            operation: 'set',
            addressNum: $scope.default.areaID,
            index: $scope.sensorParams.num,
            kValue: $scope.sensorParams.setK,
            bValue: $scope.sensorParams.setB
        };
        $_http.reqPostFn('/', param).then(function (data) {
            console.log(data);
        }, function (err) {
            console.log(err);
        })
    };
    //读取KB值
    $scope.sensorParams = {
        getK: '',
        getB: ''
    };
    $scope.getKB = function (index) {
        var param = {
            orderNum: 2,
            operation: 'get',
            addressNum: $scope.default.areaID,
            index: $scope.sensorParams.num
        };
        $_http.reqPostFn('/', param).then(function (data) {
            console.log(data);
        }, function (err) {
            console.log(err);
        })
    }
    //设置阈值
    $scope.setTD = function (index) {
        var param = {
            orderNum: 3,
            operation: 'set',
            addressNum: $scope.default.areaID,
            index: $scope.limitParams.num,
            tValue: $scope.limitParams.getT,
            dValue: $scope.limitParams.getD
        };
        $_http.reqPostFn('/', param).then(function (data) {
            console.log(data);
        }, function (err) {
            console.log(err);
        })
    };
    //读取阈值
    $scope.limitParams = {
        getT: '',
        getD: ''
    };
    $scope.getTD = function (index) {
        var param = {
            orderNum: 3,
            operation: 'get',
            addressNum: $scope.default.areaID,
            index: $scope.limitParams.num
        };
        $_http.reqPostFn('/', param).then(function (data) {
            console.log(data);
        }, function (err) {
            console.log(err);
        })
    };
    //开关控制
    //$scope.switchValue = [0, 0, 0, 0];
    $scope.switchCtrlFn = function () {
        var switchParam = {
            orderNum: 4,
            addressNum: $scope.default.areaID,
            switchValue: [$scope.setValve.one, $scope.setValve.two, $scope.setValve.three, $scope.setValve.four]
        }
        $_http.reqPostFn('/', switchParam).then(function (data) {
            console.log(data);
        }, function (error) {
            console.log(error);
        })
    };
    //阀门状态控制
    $scope.status = {
        knobSwitch: '关',
        openSwitch: '关',
        osSwitch: '关',
        checkSwitch: '关'
    };
    $scope.getStatus = function () {
        var switchParam = {
            orderNum: 5,
            addressNum: $scope.default.areaID
        }
        $_http.reqPostFn('/', switchParam).then(function (data) {
            console.log(data);
        }, function (err) {
            console.log(err);
        })
    }
    //采集水分
    $scope.readMoisture = function (index) {
        var param = {
            orderNum: 6,
            addressNum: $scope.default.areaID,
            index: $scope.sensorParams.num
        };
        console.log(param);
        $_http.reqPostFn('/', param).then(function (data) {
            console.log(data);
        }, function (err) {
            console.log(err);
        })
    };
    //采集电压
    $scope.readVoltage = function (index) {
        var param = {
            orderNum: 7,
            addressNum: $scope.default.areaID,
            index: $scope.sensorParams.num
        };
        $_http.reqPostFn('/', param).then(function (data) {
            console.log(data);
        }, function (err) {
            console.log(err);
        })
    };
    //采集水表
    $scope.waterModuleReadFn = function (index) {
        var param = {
            orderNum: 8,
            addressNum: $scope.default.areaID,
            index: $scope.waterParams.num
        };
        $_http.reqPostFn('/', param).then(function (data) {
            console.log(data);
        }, function (err) {
            console.log(err);
        })
    };
});
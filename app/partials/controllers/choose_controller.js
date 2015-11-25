/**
 * Created by XRene on 2015/10/19.
 */
app.controller('chooseCtrl', function ($rootScope, $scope, $_http, $_socket) {

    $scope.default = {
        area: '一号采集点',
        areaID: 1
    };
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
    };
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
    };
    $scope.flags = {
        time: 0,
        KB: 0,
        TD: 0,
        switch: 0,
        status: 0,
        moisture: 0,
        voltage: 0,
        water: 0
    };
    $_socket.on('test', function (msg) {
        console.log(msg);
        switch (msg.key) {
            case 'time':
                if($scope.flags.time === 1){
                    $scope.getTime.year = msg.data.year;
                    $scope.getTime.month = msg.data.month;
                    $scope.getTime.day = msg.data.day;
                    $scope.getTime.hour = msg.data.hour;
                    $scope.getTime.minutes = msg.data.minute;
                    $scope.getTime.seconds = msg.data.second;
                    $scope.flags.time = 0;
                    alert('读取成功');
                }
                break;
            case 'KB':
                if($scope.flags.KB === 1){
                    $scope.sensorParams.getK = msg.kValue;
                    $scope.sensorParams.getB = msg.bValue;
                    $scope.flags.KB = 0;
                    alert('读取成功');
                }
                break;
            case 'TD':
                if($scope.flags.TD === 1){
                    $scope.limitParams.getT = msg.tValue;
                    $scope.limitParams.getD = msg.dValue;
                    $scope.flags.TD = 0;
                    alert('读取成功');
                }
                break;
            case 'switch':
                if($scope.flags.switch === 1) {
                    alert('设置成功');
                    $scope.flags.switch = 0;
                }
                console.log(msg);
                break;
            case 'state':
                if($scope.flags.status === 1){
                    $scope.getValve.one = msg.status[0];
                    $scope.getValve.two = msg.status[1];
                    $scope.getValve.three = msg.status[2];
                    $scope.getValve.four = msg.status[3];
                    $scope.getValve.switch = msg.status[4];
                    $scope.getValve.open = msg.status[5];
                    $scope.getValve.system = msg.status[6];
                    $scope.getValve.check = msg.status[7];
                    $scope.flags.status = 0;
                    alert('读取成功');
                }
                break;
            case 'water':
                if($scope.flags.moisture === 1){
                    $scope.sensorParams.getWaterOne = msg.moisture + '%';
                    /*$scope.sensorParams.getWaterTwo = msg.moisture[1];
                    $scope.sensorParams.getWaterThree = msg.moisture[2];
                    $scope.sensorParams.getWaterFour = msg.moisture[3];*/
                    $scope.flags.moisture = 0;
                    alert('读取成功');
                }
                break;
            case 'voltage':
                if($scope.flags.voltage === 1){
                    $scope.sensorParams.getVoltageOne = msg.voltage + 'V';
                    /*$scope.sensorParams.getVoltageTwo = msg.voltage[1];
                    $scope.sensorParams.getVoltageThree = msg.voltage[2];
                    $scope.sensorParams.getVoltageFour = msg.voltage[3];*/
                    $scope.flags.voltage = 0;
                    alert('读取成功');
                }
                break;
            case 'wateramount':
                if($scope.flags.water === 1){
                    $scope.waterParams.valueOne = msg.water;
                    /*$scope.waterParams.valueTwo = msg.water[1];
                    $scope.waterParams.valueThree = msg.water[2];
                    $scope.waterParams.valueFour = msg.water[3];*/
                    $scope.flags.water = 0;
                    alert('读取成功');
                }
                break;
            default :
                break;
        }
    });

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
        $scope.flags.time = 1;
        $_http.reqPostFn('/', param).then(function (data) {
            console.log(data);
        }, function (err) {
            console.log(err);
        });
    };
    //设置KB值
    $scope.setKB = function ( ) {
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
    $scope.getKB = function () {
        var param = {
            orderNum: 2,
            operation: 'get',
            addressNum: $scope.default.areaID,
            index: $scope.sensorParams.num
        };
        $scope.flags.KB = 1;
        $_http.reqPostFn('/', param).then(function (data) {
            console.log(data);
        }, function (err) {
            console.log(err);
        })
    };
    //设置阈值
    $scope.setTD = function () {
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
    $scope.getTD = function () {
        var param = {
            orderNum: 3,
            operation: 'get',
            addressNum: $scope.default.areaID,
            index: $scope.limitParams.num
        };
        $scope.flags.TD = 1;
        $_http.reqPostFn('/', param).then(function (data) {
            console.log(data);
        }, function (err) {
            console.log(err);
        })
    };
    //开关控制
    $scope.switchCtrlFn = function () {
        var switchParam = {
            orderNum: 4,
            addressNum: $scope.default.areaID,
            switchValue: [$scope.setValve.one, $scope.setValve.two, $scope.setValve.three, $scope.setValve.four]
        };
        $scope.flags.switch = 1;
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
        };
        $scope.flags.status = 1;
        $_http.reqPostFn('/', switchParam).then(function (data) {
            console.log(data);
        }, function (err) {
            console.log(err);
        })
    };
    //采集水分
    $scope.readMoisture = function () {
        var param = {
            orderNum: 6,
            addressNum: $scope.default.areaID,
            index: $scope.sensorParams.num
        };
        $scope.flags.moisture = 1;
        console.log(param);
        $_http.reqPostFn('/', param).then(function (data) {
            console.log(data);
        }, function (err) {
            console.log(err);
        })
    };
    //采集电压
    $scope.readVoltage = function () {
        var param = {
            orderNum: 7,
            addressNum: $scope.default.areaID,
            index: $scope.sensorParams.num
        };
        $scope.flags.voltage = 1;
        $_http.reqPostFn('/', param).then(function (data) {
            console.log(data);
        }, function (err) {
            console.log(err);
        })
    };
    //采集水表
    $scope.waterModuleReadFn = function () {
        var param = {
            orderNum: 8,
            addressNum: $scope.default.areaID,
            index: $scope.waterParams.num
        };
        $scope.flags.water = 1;
        $_http.reqPostFn('/', param).then(function (data) {
            console.log(data);
        }, function (err) {
            console.log(err);
        })
    };
});
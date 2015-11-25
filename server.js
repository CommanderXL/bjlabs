/**
 * Created by XRene on 2015/10/17.
 */
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var mysql = require('mysql');
var cookieParser = require('cookie-parser');
var route = require('./node/route/route.js');
var crc = require('crc');
var tcp = require('net').createServer();
var cluster = require('cluster');
var _ = require('underscore');
var get_float_hex = require('./node_modules/float-crc/crc.js');
var async = require('async');


//crc高低校验位
function resortCRC(BUFFER){
    var buffer = crc.crc16modbus(BUFFER).toString(16);
    if(buffer.length === 3){
        buffer = '0' + buffer;
    }

    var buf1 = buffer.substr(0, 2),
        buf2 = buffer.substr(2, 2);
        console.log(buffer);
    buf1 = Number('0x' + buf1);
    buf2 = Number('0x' + buf2);
    return new Buffer([buf2, buf1]);
};

//将十六进制数转化为十六进制字符串
function hex_to_hexString(arr){
    var str = '';
    for(var i = 0; i < arr.length ; i++){
        var temp = arr[i].toString(16);
        if(temp.length === 1){
            temp = '0' + temp;
        }
        str += temp;
    }
    return str;
}

//union转化为float数
function union_to_float(str){
    return new Float32Array(
        new Uint8ClampedArray([str.slice(0,2), str.slice(2,4), str.slice(4,6), str.slice(6,8)].map(function(a){
            return parseInt(a, 16);
            })
        ).buffer
    )[0].toFixed(2)
};


//union转化为float数
/*function union_to_float(BUFFER){
    var intData = new Uint32Array(1);
    intData[0] = parseInt(BUFFER, 16);
    return (new Float32Array(intData.buffer))[0];
};*/

//数据按id值进行分类
function classifyData(name, arr){
    var idArr = [];
    _.map(arr, function (item) {
        if(idArr.indexOf(item.id) === -1){
            idArr.push(item.id);
        }
    })
    var result = {};
    _.map(idArr, function (id) {
        result[id] = _.where(arr, {id: id})
    });
    var newResult = {};
    _.map(result, function (valueA, keyA, listA) {
        newResult[keyA] = _.map(valueA, function (valueB, keyB, listB) {
            return [listB[keyB].time, listB[keyB][name]];
        })
    });
    return newResult;
};

//取当前数据
function getRecentData(name, arr){
    var result = {
        time: '',
        categoriesAndId: [[], []]
    }
    _.map(arr, function (item) {
        result.categoriesAndId[0].push(item.id);
        result.categoriesAndId[1].push(item[name]);
    })
    result.time = arr[0].time;
    return result;
}

//获取按时间分组数据
function getGroupData(arr, name){
    var timeResults = _.groupBy(arr, 'time');
    var results = [], time = [];
    _.map(timeResults, function (timeItem, key) {
        time.push(key);
        var temp = [[], []];
        _.map(timeItem, function (item) {
            temp[0].push(item.id);
            temp[1].push(item[name]);
        });
        temp[0].push('time');
        temp[1].push(key);
        results.push(_.object(temp[0], temp[1]));
    });
    var dataList = [];
    for(var item in results){
        dataList.push(results[item]);
    }
    return dataList;
}


if(cluster.isMaster){


    var wk = cluster.fork();
    cluster.on('fork', function (worker) {
        console.log('[master]fork: work' + worker.id);
    });

    var connection = mysql.createConnection({
        host: 'senlinxunjian.mysql.rds.aliyuncs.com',
        user: 'dbadmin',
        password: 'ccbfu6233',
        database: 'bjlab'
    });

    connection.connect(function (err) {
        if(err){
            console.error('error connecting ' + err.stack);
            return ;
        }
        console.log('connected as id ' + connection.threadId);
    });



    var app = express();
    var http = require('http').Server(app);
    var io = require('socket.io')(http);
    //var server = http.createServer(app);
    http.listen(10003);

    app.use(bodyParser());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(express.static(path.join(__dirname, 'app')));   //设置静态目录

    /*app.get('/', function (req, res, next) {
        res.sendFile(path.join(__dirname, '/app/index.html'));
        next();
    });*/


    /*app.use(function (req, res, next) {
        res.sendFile(path.join(__dirname, '/app/index.html'));
        return next();
    });

    app.all('*', function (req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type");
        res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
        res.header("X-Powered-By", ' 3.2.1');
        res.header("Content-Type", "application/json;charset=utf-8");
        return next();
    });*/

    app.get('/firstPage', function(req, res){
        res.sendFile(path.join(__dirname, '/app/templ/firstPage.html'));
    });
    //联系我们
    app.get('/connect', function (req, res) {
        res.sendFile(path.join(__dirname, '/app/templ/show.html'));
    });
    //学术论文
    app.get('/achieve', function (req, res) {
        res.sendFile(path.join(__dirname, '/app/templ/achieve.html'));
    });
    //专利
    app.get('/patent', function (req, res) {
       res.sendFile(path.join(__dirname, '/app/templ/patent.html'));
    });
    //软件著作权
    app.get('/software', function (req, res) {
        res.sendFile(path.join(__dirname, '/app/templ/software.html'));
    });
    //研究成果
    app.get('/rd', function (req, res) {
        console.log('研究成果');
        res.sendFile(path.join(__dirname, '/app/templ/rd.html'));
    });
    //实验基地
    app.get('/labBase', function (req, res) {
        console.log(123);
        res.sendFile(path.join(__dirname, '/app/templ/lab-base.html'));
    });
    //主-index
    app.get('/main/index', function (req, res) {
        res.sendFile(path.join(__dirname, '/app/templ/main-home.html'));
    });
    //主-one
    app.get('/main/one', function (req, res) {
        res.sendFile(path.join(__dirname, '/app/templ/main-home-one.html'));
    });
    //主-two
    app.get('/main/two', function (req, res) {
        res.sendFile(path.join(__dirname, '/app/templ/main-home-two.html'));
    });
    //主-three
    app.get('/main/three', function (req, res) {
        res.sendFile(path.join(__dirname, '/app/templ/main-home-three.html'));
    });
    //主-four
    app.get('/main/four', function (req, res) {
        res.sendFile(path.join(__dirname, '/app/templ/main-home-four.html'));
    });
    //主-five
    app.get('/main/five', function (req, res) {
        res.sendFile(path.join(__dirname, '/app/templ/firstPage.html'));
    })

    io.on('connection', function (socket) {
        console.log("some has connected");
    })

    //接受子进程发送数据
    wk.on('message', function (msg) {
        //所有客户端接收数据
        console.log(msg);
        io.sockets.emit('test', msg)
    });

    app.post('/', function (req, res) {
        //将数据传给子进程
        wk.send(req.body);
        //返回客户端数据
        return res.send(
            {
                status: 0,
                de: '123'
            }
        );
    });
    //图表接口
    app.post('/chart', function (req, res) {
        console.log(req.body);
        var item, table, mapTable, mapQuery, sql,
            id = parseInt(req.body.area);

        switch (req.body.item) {
            case '水份':
                item = 'Moisture';
                table = 'moistureinfo';
                mapTable = 'sensormap';
                mapQuery = 'sensorid';
                break;
            case '电压':
                item = 'Voltage';
                table = 'moistureinfo';
                mapTable = 'sensormap';
                mapQuery = 'sensorid';
                break;
            case '水表':
                item = 'Amount';
                table = 'wateramount';
                mapTable = 'flowmap';
                mapQuery = 'FlowID';
                break;
            default :
                break;
        }

        //水表数据库设置
        if(req.body.item === '水份' || req.body.item === '电压'){
            sql = 'select date_format(time, "%Y-%m-%d %T") as time, ' + item + ',id from ' + table + ', ' + mapTable + ' where  moistureinfo.ID = sensormap.sensorid and loggerid = ' + id + ' and time > "'+ req.body.start_time +'" and time < "'+ req.body.end_time +'"';
        }
        else if (req.body.item === '水表'){
            sql = 'select time, ' + item + ',id from ' + table + ', ' + mapTable + ' where  wateramount.ID = flowmap.flowID and loggerid = ' + id + ' and time > "'+ req.body.start_time +'" and time < "'+ req.body.end_time +'"';
        }


        connection.query(sql, function (err, rows) {
            if(err){
                console.error(err);
                return ;
            }
            res.send({
                status: 0,
                title: req.body.item,
                data: classifyData(item, rows)
            });
        })
    });

    function tableQueryData(id, from, to, res){
        var sqlOne = 'select id,date_format(time, "%Y-%m-%d %T") as time,Moisture from moistureinfo,sensormap where moistureinfo.ID = sensormap.sensorid and loggerid = '+ (id + 1) + ' and time > "' + from + '" and time < "' + to + '" order by time desc,id',
            sqlTwo = 'select id,date_format(time, "%Y-%m-%d %T") as time,Voltage from moistureinfo,sensormap where moistureinfo.ID = sensormap.sensorid and loggerid = '+ (id + 1) + ' and time > "' + from + '" and time < "' + to + '" order by time desc,id',
            sqlThree = 'select id,date_format(time, "%Y-%m-%d %T") as time,Amount from wateramount,flowmap where wateramount.ID = flowmap.FlowID and loggerid = '+ (id + 1) + ' and time > "' + from + '" and time < "' + to + '" order by time desc,id',
            sqlFour = 'select id,date_format(time, "%Y-%m-%d %T") as time,states1,states2,states3,states4 from valve,valvemap where valve.ID = valvemap.ValveID and loggerid = '+ (id + 1) + ' and time > "' + from + '" and time < "' + to + '" order by time desc';
        async.parallel({
            moisture: function(next){
                connection.query(sqlOne, function (err, rows) {
                    //console.log(rows);
                    next(null, rows);
                })
            },
            voltage: function (next) {
                connection.query(sqlTwo, function (err, rows) {
                    //console.log(rows);
                    next(null, rows);
                })
            },
            wateramount: function (next) {
                connection.query(sqlThree, function (err, rows) {
                    next(null, rows);
                })
            },
            valve: function (next) {
                connection.query(sqlFour, function (err, rows) {
                    next(null, rows);
                })
            }
        }, function (err, results) {
            if(err){
                console.error(err);
                return ;
            }
            res.send({
                status: 0,
                data: {
                    moisture: getGroupData(results.moisture, 'Moisture'),
                    voltage: getGroupData(results.voltage, 'Voltage'),
                    wateramount: getGroupData(results.wateramount, 'Amount'),
                    valve: results.valve
                }
            })
        })
    }
    //报表接口
    app.post('/tables', function (req, res) {
        //注意这个地方的areaID必须传入数字
        tableQueryData(parseInt(req.body.areaID), req.body.from, req.body.to, res);
    })
    //展示接口
    app.post('/display', function (req, res) {
        var sql , field , area = parseInt(req.body.area);
        var sqlOne = 'SELECT * from(SELECT id,time,Moisture FROM moistureinfo,sensormap where moistureinfo.ID = sensormap.sensorid and loggerid = '+ area +' ORDER BY time desc) as temp group by id order by id asc',
            sqlTwo = 'SELECT * from(SELECT id,time,Voltage FROM moistureinfo,sensormap where moistureinfo.ID = sensormap.sensorid and loggerid = '+ area +' ORDER BY time desc) as temp group by id order by id asc',
            sqlThree = 'SELECT * from(SELECT id,time,Amount FROM wateramount,flowmap where wateramount.ID = flowmap.FlowID and loggerid = '+ area +' ORDER BY time desc) as temp group by id order by id asc',
            sqlFour = 'SELECT * from(SELECT id, time, states1, states2, states3, states4 FROM valve, valvemap where valve.ID = valvemap.ValveID and loggerid = '+ area +' ORDER BY time desc) as temp group by id order by id asc';
        async.parallel({
            moisture: function(next){
                connection.query(sqlOne, function (err, rows) {
                    next(null, rows);
                })
            },
            voltage: function (next) {
                connection.query(sqlTwo, function (err, rows) {
                    next(null, rows);
                })
            },
            wateramount: function (next) {
                connection.query(sqlThree, function (err, rows) {
                    next(null, rows);
                })
            },
            valve: function (next) {
                connection.query(sqlFour, function (err, rows) {
                    next(null, rows);
                })
            }
        }, function (err, results) {
            if(err){
                console.error(err);
                return ;
            }
            res.send({
                status: 0,
                data: {
                    moisture: getRecentData('Moisture', results.moisture),
                    voltage: getRecentData('Voltage', results.voltage),
                    wateramount: getRecentData('Amount', results.wateramount),
                    valve: results.valve
                }
            })
        })

/*        switch (req.body.name){
            case '水分':
                field = 'Moisture';
                sql = 'SELECT id,time,Moisture FROM moistureinfo,sensormap where moistureinfo.ID = sensormap.sensorid and loggerid = '+ area +' group by id order by id asc';
                break;
            case '电压':
                field = 'Voltage';
                sql = 'SELECT id,time,Voltage FROM moistureinfo,sensormap where moistureinfo.ID = sensormap.sensorid and loggerid = '+ area +' group by id order by id asc';
                break;
            case '水表':
                field = 'Amount';
                sql = 'SELECT id,time,Amount FROM wateramount,flowmap where wateramount.ID = flowmap.FlowID and loggerid = '+ area +' group by id order by id asc';
                break;
            case '阀门状态':    //有点问题
                return ;
                /!*field = '';
                sql = 'SELECT id, time, states1, states2, states3, states4 FROM valve, valvemap where valve.ID = valvemap.ValveID and loggerid = '+ area +' group by id order by id asc';
                break;*!/
            default :
                break;
        }
        connection.query(sql, function (err, rows) {
            if(err){
                console.error(err);
                return ;
            }
            res.send({
                status: 0,
                title: req.body.name,
                data: getRecentData(field, rows)
            });
        })*/
    })

} else if(cluster.isWorker){

    var wk = cluster.worker;

    var headerBuffer = new Buffer([104, 10]),
        reservedBufferTwo = new Buffer([0, 0]),
        reservedBufferOne = new Buffer([0]),
        lastBuffer = new Buffer([22]);

    function createBufferFn(_address, _order, _dataLenth, _data, reservedBuffer){
        var _checkData ;
        if(_data){
            _checkData = Buffer.concat([headerBuffer, _address, _order, _dataLenth, _data, reservedBuffer]);
        } else {
            _checkData = Buffer.concat([headerBuffer, _address, _order, _dataLenth, reservedBuffer]);
        }
        var _crc = resortCRC(_checkData);
        return Buffer.concat([_checkData, _crc, lastBuffer]);
    }

    var socketArr = [];

    tcp.on('connection', function(socket){
        console.log(socket.remoteAddress, socket.remotePort);

        socketArr.push(socket);

        if(socketArr.length >= 2){
            socketArr.shift();
        };

        socket.on('data', function(data){
            console.log(data);
            var address = data[2],
                sendData = null;

            switch (data[3]){
                case 0:
                    break;
                case 1:
                    sendData = {
                        address: address,
                        key: 'time',
                        data: {
                            year: data[5],
                            month: data[6],
                            day: data[7],
                            hour: data[8],
                            minute: data[9],
                            second: data[10]
                        }
                    }
                    break;
                case 2:
                    var bufK = hex_to_hexString(new Buffer([data[6], data[7], data[8], data[9]])),
                        bufB = hex_to_hexString(new Buffer([data[10], data[11], data[12], data[13]]));
                    sendData = {
                        address: address,
                        key: 'KB',
                        index: data[5], //传感器编号
                        kValue: union_to_float(bufK),
                        bValue: union_to_float(bufB)
                    };
                    break;
                case 3:
                    var bufT = hex_to_hexString(new Buffer([data[6], data[7], data[8], data[9]])),
                        bufD = hex_to_hexString(new Buffer([data[10], data[11], data[12], data[13]]));
                    sendData = {
                        address: address,
                        key: 'TD',
                        index: data[5],
                        tValue: union_to_float(bufT),
                        dValue: union_to_float(bufD)
                    };
                    break;
                case 4:
                    sendData = {
                        address: address,
                        key: 'switch',
                        switchValue: [data[5], data[6], data[7], data[8]]
                    }
                    break;
                case 5:
                    sendData = {
                        address: address,
                        key: 'state',
                        status: [data[5], data[6], data[7], data[8], data[9], data[10], data[11], data[12]]
                    }
                    break;
                case 6:
                    var _moisture = hex_to_hexString(new Buffer([data[6], data[7], data[8], data[9]]));
                    sendData = {
                        address: address,
                        key: 'water',
                        index: data[5],
                        moisture: union_to_float(_moisture)
                    }
                    break;
                case 7:
                    var _voltage = hex_to_hexString(new Buffer([data[6], data[7], data[8], data[9]]));
                    sendData = {
                        address: address,
                        key: 'voltage',
                        index: data[5],
                        voltage: union_to_float(_voltage)
                    }
                    break;
                case 8:
                    var _water = hex_to_hexString(new Buffer([data[6], data[7], data[8], data[9]]));
                    sendData = {
                        address: address,
                        key: 'wateramount',
                        index: data[5],
                        water: union_to_float(_water)
                    }
                    break;
                case 9:
                    break;
                default :
                    break;
            }
            wk.send(sendData);
        })
    })

    process.on('message', function(msg){
            var _address = new Buffer([msg.addressNum]),
                _order = new Buffer([msg.orderNum]), _dataLenth, _data, _checkData, _crc, _finalBuffer, unionDataOne, unionDataTwo;
            switch (msg.orderNum){
                case 0:
                    _dataLenth = new Buffer([3]);
                    break;
                case 1:
                    _dataLenth = new Buffer([8]);
                    if(msg.operation === 'set'){
                        _data = new Buffer([msg.year, msg.month, msg.day, msg.hour, msg.minute, msg.second]);
                    } else {
                        _data = new Buffer([0 ,0 ,0 ,0 ,0 ,0]);
                    }
                    _finalBuffer = createBufferFn(_address, _order, _dataLenth, _data, reservedBufferTwo);
                    break;
                case 2:
                    _dataLenth = new Buffer([10]);
                    if(msg.operation === 'set'){
                        unionDataOne = get_float_hex(msg.kValue);
                        unionDataTwo = get_float_hex(msg.bValue);
                        _data = new Buffer([msg.index, unionDataOne[0], unionDataOne[1], unionDataOne[2], unionDataOne[3], unionDataTwo[0], unionDataTwo[1], unionDataTwo[2], unionDataTwo[3]]);
                    } else {
                        _data = new Buffer([msg.index, 0, 0, 0, 0, 0, 0, 0, 0]);
                    }
                    _finalBuffer = createBufferFn(_address, _order, _dataLenth, _data, reservedBufferOne);
                    break;
                case 3:
                    _dataLenth = new Buffer([10]);
                    if(msg.operation === 'set'){
                        unionDataOne = get_float_hex(msg.tValue);
                        unionDataTwo = get_float_hex(msg.dValue);
                        //console.log(unionDataOne, unionDataTwo);
                        _data = new Buffer([msg.index, unionDataOne[0], unionDataOne[1], unionDataOne[2], unionDataOne[3], unionDataTwo[0], unionDataTwo[1], unionDataTwo[2], unionDataTwo[3]]);
                    } else {
                        _data = new Buffer([msg.index, 0, 0, 0, 0, 0, 0, 0, 0]);
                    }
                    _finalBuffer = createBufferFn(_address, _order, _dataLenth, _data, reservedBufferOne);
                    break;
                case 4:
                    _dataLenth = new Buffer([6]);
                    _data = new Buffer([msg.switchValue[0], msg.switchValue[1], msg.switchValue[2], msg.switchValue[3]]);
                    _finalBuffer = createBufferFn(_address, _order, _dataLenth, _data, reservedBufferTwo);
                    break;
                case 5:
                    _dataLenth = new Buffer([2]);
                    _finalBuffer = createBufferFn(_address, _order, _dataLenth, null, reservedBufferTwo);
                    break;
                case 6:
                    _dataLenth = new Buffer([3]);
                    _data = new Buffer([msg.index]);
                    _finalBuffer = createBufferFn(_address, _order, _dataLenth, _data, reservedBufferTwo);
                    break;
                case 7:
                    _dataLenth = new Buffer([3]);
                    _data = new Buffer([msg.index]);
                    _finalBuffer = createBufferFn(_address, _order, _dataLenth, _data, reservedBufferTwo)
                    break;
                case 8:
                    _dataLenth = new Buffer([3]);
                    _data = new Buffer([msg.index]);
                    _finalBuffer = createBufferFn(_address, _order, _dataLenth, _data, reservedBufferTwo);
                    break;
                case 9:
                    _dataLenth = new Buffer([7]);
                    //_data = new Buffer([req.]);
                    break;
                default:
                    break;
            };

            console.log(_finalBuffer);
            if(socketArr.length !== 0){
                socketArr[0].write(_finalBuffer);
            }

    })

    tcp.listen(8082, function () {
        console.log('TCP Server is on the port of 8082');
    });
}
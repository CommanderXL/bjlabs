/* 
* @Author: xl
* @Date:   2015-10-21 21:37:34
* @Last Modified by:   xl
* @Last Modified time: 2015-10-25 09:33:39
*/
var intData = new Uint32Array(1);
intData[0] = parseInt("41cc7ae1", 16);
var dataAsFloat = new Float32Array(intData.buffer);
var result = dataAsFloat[0];
//console.log(result);




function union_change_float(BUFFER){
	var intData = new Uint32Array(1);
	intData[0] = parseInt(BUFFER, 16);
	var dataAsFloat = new Float32Array(intData.buffer);
	var result = dataAsFloat[0];
	console.log(result);
}

var buf = new Buffer([1, 20, 30]);

function Bytes2Str(arr)
{
    var str = "";

    for(var i=0; i<arr.length; i++)

    {

       var tmp = arr[i].toString(16);

       if(tmp.length == 1)

       {

           tmp = "0" + tmp;

       }

       str += tmp;

    }

    console.log(str);

}

Bytes2Str(buf)
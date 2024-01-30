function hexStringToArrayBuffer(hexString) {
    //如果有空格，去除空格
    hexString = hexString.replace(/\s+/g, "");
    var buffer = new ArrayBuffer(hexString.length / 2);
    var view = new DataView(buffer);
    for (var i = 0; i < hexString.length; i += 2) {
        var high = parseInt(hexString.charAt(i), 16);
        var low = parseInt(hexString.charAt(i + 1), 16);
        view.setUint8(i / 2, (high << 4) + low);
    }
    return buffer;
}
//将buffer转换成16进制字符串
function ab2hex(buffer) {
    var hexArr = Array.prototype.map.call(
        new Uint8Array(buffer),
        function (bit) {
            return ('00' + bit.toString(16)).slice(-2)
        }
    )
    return hexArr.join('');
}
//将16进制字符串转成10进制字符串
function hexToDec(hex) {
    return parseInt(hex, 16).toString(10);
}
//将十六进制浮点数转十进制floatHexToDec
function floatHexToDec(num) {
    //将数据源转化为十六进制   
    let to016 = parseInt(num, 16);
    //转化为2进制，并补零。
    let to0b2 = to016.toString(2).padStart(32, 0)
    //截取符号位
    let s = to0b2.slice(0, 1);
    //截取幂数并转化为二进制
    let e = parseInt(to0b2.slice(1, 9), 2)
    //将幂数转化为二进制。
    let newe = e.toString(2)
    //截取9~-31的小数点的数据位
    let A = to0b2.toString().slice(newe.length + 1)
    //存贮小数值
    let sum = 0;
    for (let i = 0; i < A.length; i++) {
        //取出每个值及逆行计算
        sum += A.charAt(i) * Math.pow(2, -1 * (i + 1))
    }
    //最后利用公式生生成对应的数值
    let x = Math.pow(-1, s) * (1 + sum) * Math.pow(2, (e - 127))
    return x
}
//把字符串转换为byte数组  
function stringToBytes(str) {
    var ch, st, re = [];
    for (var i = 0; i < str.length; i++) {
        ch = str.charCodeAt(i);
        st = [];
        do {
            st.push(ch & 0xFF);
            ch = ch >> 8;
        }
        while (ch);
        re = re.concat(st.reverse());
    }
    return re;
}
//dec转hex
function decToHex(dec) {
    dec = Number(dec);
    let hex = (dec).toString(16);
    return hex.length === 2 ? hex : '0' + hex;
}
//crc16 modbus校验 传入的是16进制字符串
function hexStrToCRC16Modbus(dataHexString) {
    dataHexString = dataHexString.replace(/\s+/g, "");
    const dataBytes = [];
    for (let i = 0; i < dataHexString.length; i += 2) {
        dataBytes.push(parseInt(dataHexString.substr(i, 2), 16));
    }

    let crc = 0xFFFF;
    const polynomial = 0xA001;  // This is the polynomial x^16 + x^15 + x^2 + 1

    for (const byte of dataBytes) {
        crc ^= byte;
        for (let i = 0; i < 8; i++) {
            if (crc & 0x0001) {
                crc = ((crc >> 1) ^ polynomial) & 0xFFFF;
            } else {
                crc >>= 1;
            }
        }
    }
    // crc = crc.toString(16).toUpperCase();
    // crc = crc.substring(crc.length - 2, crc.length) + crc.substring(0, crc.length - 2);
    // return crc;
    //要确保返回的是4位，不够的话需要补0
    crc = crc.toString(16).toUpperCase();
    if (crc.length < 4) {
        crc = '0'.repeat(4 - crc.length) + crc;
    }
    crc = crc.substring(crc.length - 2, crc.length) + crc.substring(0, crc.length - 2);
    return crc;
}



//通用dec转hex函数，需要按照每两位截取，然后转换为16进制
function decToHexByLen(dec, len) {
    //转成number
    dec = Number(dec);
    let hex = (dec).toString(16);
    //不足字节数，前面补0
    while (hex.length < len * 2) {
        hex = '0' + hex;
    }
    return hex;
}

function getCs8(hex) {
    hex = hex.replace(/\s+/g, "");
    var len = 2;
    hex = hex.match(new RegExp('.{1,' + len + '}', 'g'))
    var sum = 0;
    hex.map(item => {
        sum += parseInt(item, 16);
    })
    //只要一个字节，所以取sum后两位
    var sumStr = sum.toString(16);
    sumStr = sumStr.toString().substr(sum.toString().length - 2, 2)
    return sumStr.toUpperCase();
}

//公共反转字符串
function reverseString(hex) {
    var len = 2
    hex = hex.match(new RegExp('.{1,' + len + '}', 'g'))
    hex = hex.reverse().join('')
    return hex;
}




export {
    hexStringToArrayBuffer,
    ab2hex,
    hexToDec,
    floatHexToDec,
    hexStrToCRC16Modbus,
    decToHex,
    decToHexByLen,
    getCs8,
    reverseString
}
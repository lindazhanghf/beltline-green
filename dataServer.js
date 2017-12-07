const fs = require('fs')
const SerialPort = require('serialport')
const server = require('http').createServer()
const io = require('socket.io')(server)

const SERIAL_FOLDER = '/dev'
const BAUD_RATE = 115200
// const SERIAL_ADDR = 'cu.usbmodem127'
// const SERIAL_ADDR = 'cu.usbmodem871641'
// const SERIAL_ADDR = 'cu.usbmodem2926641'
// const SERIAL_ADDR = 'ttyACM0'
const SERIAL_ADDR = 'rfcomm0'

const zillow_data = [[159200, 156700, 153650, 151150, 149400, 147700, 145650, 143550, 141550, 140450, 139550, 138900],
[138300, 137700, 137700, 137300, 136550, 137050, 139300, 141550, 143350, 144550, 145600, 146900],
[148100, 149550, 151700, 154350, 156450, 158750, 161650, 163700, 164950, 167150, 169750, 171800],
[173700, 175550, 177400, 179950, 182250, 183400, 183700, 184400, 185900, 186850, 188350, 191000]];

const tree_data = [9, 325, 449, 628];


var dataObj = {
  "year":0,
  "month":0,
  "tree": 9,
  "zillow": 0
}

function sendDataToVis() {
  if (dataObj.year > 3) {
    return;
  }
  dataObj.tree = tree_data[dataObj.year];
  dataObj.zillow = zillow_data[dataObj.year][dataObj.month];
  io.sockets.emit('newData', dataObj)
  dataObj.month = dataObj.month + 1;

  if (dataObj.month == 12) {
    dataObj.year = dataObj.year + 1;
    dataObj.month = 0;

  }
  // console.log(dataObj);
}


const SOCKET_PORT = 8088

// var serialPortAddrs = fs.readdirSync(SERIAL_FOLDER)
//   .filter(file => {
//     return file.includes(SERIAL_ADDR)
//   })
// console.log(serialPortAddrs)
// var port;
// initPort();

// var port = new SerialPort(`${SERIAL_FOLDER}/${serialPortAddrs[0]}`, {baudRate: BAUD_RATE})
// port.on('error', serialPortErrHandler)
// port.on('data', serialPortDataHandler)
// port.on('close', ()=> {
//   console.log('close')
// })
function serialPortErrHandler (err) {
  console.log(`Error: ${err.message}`)
  initPort();
}

var msgBuf = Buffer.from('')
var count = 0
function serialPortDataHandler (data) {
  console.log(`raw: ${data.toString()}`)
  msgBuf = Buffer.concat([msgBuf, data], msgBuf.length + data.length)
  var lineEndIndex = msgBuf.indexOf('\n')
  while (lineEndIndex > -1) {
    // console.log("Found line end")
    var lineBuf = msgBuf.slice(0, lineEndIndex - 1)
    msgBuf = msgBuf.slice(lineEndIndex)
    console.log(lineBuf.toString())
    var json = JSON.parse(lineBuf.toString());
    console.log(json);
    lineEndIndex = msgBuf.indexOf(Buffer.from(['\n']))



    // io.sockets.emit('newData', json)
    msgBuf = Buffer.from('');
  }

  // console.log(msgBuf.toString());
  // data = JSON.parse(data);
  // io.sockets.emit(data);

  // io.sockets.emit('newData', {
  //           msg: data.toString()
  //         })
}
function connectionHandler (socket) {
  console.log('A user connected')
  setInterval(sendDataToVis,1000);
  socket.on('disconnect', (msg) => {
    console.log(`user disconnected ${msg}`)
    initPort();
  })
}

function initPort() {
  serialPortAddrs = fs.readdirSync(SERIAL_FOLDER)
  .filter(file => {
    return file.includes(SERIAL_ADDR)
  })
  // port = new SerialPort(`${SERIAL_FOLDER}/${serialPortAddrs[0]}`, {baudRate: BAUD_RATE})
  // port.on('error', serialPortErrHandler)
  // port.on('data', serialPortDataHandler)
  // port.on('close', ()=> {
  //   console.log('close')
  //   initPort()
  // })

}


io.on('connection', connectionHandler)
server.listen(SOCKET_PORT, '0.0.0.0')

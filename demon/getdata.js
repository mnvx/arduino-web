/**
 * Сохранение в БД данных от Arduino
 */

console.log("Connect to database...");
var _getData = {
  database: {
    mongo: require('mongodb'),
    host: 'localhost',
    name: 'sqrt',
    port: null,
    db: null
  },
  arduino: {
    port: "/dev/ttyACM0",
    baudrate: 9600
  }
};
_getData.database.port = _getData.database.mongo.Connection.DEFAULT_PORT;
_getData.database.db = new _getData.database.mongo.Db(_getData.database.name, 
    new _getData.database.mongo.Server(
    _getData.database.host, _getData.database.port, {}), {safe: false});

// Соединяемся с БД
_getData.database.db.open(function(err, db) {
  console.log("Connected to database.");
  
  // Подключаемся к порту
  var serialport = require("serialport");
  var SerialPort = serialport.SerialPort;
  var serialPort = new SerialPort(_getData.arduino.port, {
    baudrate: _getData.arduino.baudrate
  });
  serialPort.on("open", function() {
    // Читаем данные из порта
    var readData = "";
    var first = true;
    console.log("Waiting for data from Arduino...");
    serialPort.on('data', function(data) {
      var dataStr = data.toString();

      // Парсим данные (делим на строки)
      for (var i = 0, l = dataStr.length; i < l; i++) {
        if (dataStr.charAt(i) != "\n" && dataStr.charAt(i) != "\r") {
          readData += dataStr.charAt(i);
        }
        else if (readData) {
          // Пропускаем первое полученное значение
          if (!first) {
            db.collection('sqrt', function(err, collection) {
              var date = new Date();

              // Сохраняем значение в базу
              collection.insert({
                time: date,
                value: readData
              });

              console.log(date + ': ' + readData + ';');
            });
          }
          else {
            first = false;
          }
          readData = "";
        }
      }
    });
  });

  //db.close();
});
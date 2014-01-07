
/*
 * GET home page.
 */

exports.get_data = function(req, res){
  // Читаем данные из БД
  var _getData = {
    database: {
      mongo: require('mongodb'),
      host: 'localhost',
      name: 'sqrt',
      port: null,
      db: null
    }
  };
  _getData.database.port = _getData.database.mongo.Connection.DEFAULT_PORT;
  _getData.database.db = new _getData.database.mongo.Db(_getData.database.name,
      new _getData.database.mongo.Server(
      _getData.database.host, _getData.database.port, {}), {safe: false});

  // Соединяемся с БД
  _getData.database.db.open(function(err, db) {

    db.collection('sqrt', function(err, collection) {

      // Выбераем из таблицы всё, что не старее 10 минут
      var dateFrom = new Date(Date.parse(new Date()) - 1000 * 60 * 10);
      collection.find({time: {'$gt': dateFrom}}).toArray(function(err, docs) {
        console.log(docs.length);
        res.send(JSON.stringify(docs));
        db.close();
      });

    });
  });

};
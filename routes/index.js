
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Get data from Arduino (example)' });
};
require('babel/register');

require('./app').then(function(app){
  var server = app.listen(require('./config').port);

  console.log('App listening at http://%s:%s', server.address().address,
              server.address().port);
});

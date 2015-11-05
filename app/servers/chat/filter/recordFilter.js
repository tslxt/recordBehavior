module.exports = function(app){
  return new Filter(app);  
};

var Filter = function(app) {
  this.app = app;
};

var fs = require('fs');

Filter.prototype.before = function(msg, session, next) {
  if (msg.content) {
    var msgObj = JSON.parse(msg.content);
    var recordPath = this.app.get('record').recordPath + '/' + msg.rid;
    if (!fs.exists(recordPath)) {
      fs.mkdir(recordPath, 0777, function(err) {
        
      });  
    }
    var ctime = new Date();
    switch (msgObj.type) {
      case 'HANDWRITING':
        var suffix = '';
        if ( msgObj.drawboardmode === 'courseWare' ) {
            suffix = 'page' + '-' + String(msgObj.index);
        }
        if ( msgObj.drawboardmode === 'exercise' ) {
            suffix = 'ex' + '-' + String(msgObj.index);
        }
        fs.appendFile(recordPath + '/' + msg.rid  + '.' + suffix, String(ctime.getTime()) + '_' + JSON.stringify(msgObj.graphy) + '\r\n', function(err) {
          if (err) throw err;
        });
        break;
      case 'PAGE':
      case 'EXERCISE':
      case 'OPERATION':
        fs.appendFile(recordPath + '/' + msg.rid  + '.act' , String(ctime.getTime()) + '_' + JSON.stringify(msgObj) + '\r\n', function(err) {
        });
        break;
    }
    
  }

  next();
};

Filter.prototype.after = function(err, msg, session, resp, next) {
  next();
};

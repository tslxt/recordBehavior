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
    var recordPath = this.app.get('record').recordPath;
    if (!fs.exists(recordPath)) {
      fs.mkdir(recordPath, 0777, function(err) {
        
      });  
    }
    if (msgObj.type === 'HANDWRITING') {
      fs.appendFile(recordPath + '/' + msg.rid + '.record', JSON.stringify(msgObj.graphy) + '\r\n', function(err) {
        if (err) throw err;
      });
    }
  }

  next();
};

Filter.prototype.after = function(err, msg, session, resp, next) {
  next();
};

var exec = require('child_process').exec;

var cb = function (error, stdout, stderr) {
  if (error !== null) {
    console.log('ERROR:', error);
  } else {
    console.log('stdout: ' + stdout, process.argv[2]);
  }
};

exec(`cp ${process.argv[2]} .env`, cb);

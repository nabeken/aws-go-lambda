var child_process = require('child_process'),
    http = require('http'),
    async = require('async');

var server = child_process.spawn('./main', [], {stdio: ['ignore', 'ignore', 'pipe']})

server.on('error', function(err) {
  console.log("lambda_server errored: " + err);
  process.exit(1);
});

server.on('exit', function(code) {
  console.log("lambda_server exited prematurely with code: "+code);
  process.exit(1);
});

server.stderr.setEncoding('utf8');
server.stderr.on('data', function(data) {
  console.log(data);
});

function new_request(event) {
  return function request(callback, results) {
    var opts = {
      socketPath: '/tmp/lambda-server.sock',
      method: 'POST',
      headers: event.headers
    }

    var req = http.request(opts, function(res) {
      var body = '';
      console.log('Response Status:', res.statusCode);
      console.log('Response Headers:', JSON.stringify(res.headers));
      res.setEncoding('utf8');
      res.on('data', function(chunk) {
        body += chunk;
      });
      res.on('end', function() {
          console.log('Successfully processed HTTP response');
          console.log('Response Body:', body);
          callback(null, body);
      });
    });
    req.on('error', function(err) {
      callback(err, null);
    });
    if (event.body) {
      req.write(JSON.stringify(event.body));
    }
    req.end();
  }
}

exports.handler = function(event, context) {
  console.log("DEBUG: " + JSON.stringify(event));
  async.retry({times: 3, interval: 200}, new_request(event), function(err, result) {
    if (err) {
      context.fail(err);
    } else {
      context.succeed(result);
    }
  });
}

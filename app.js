var http = require('follow-redirects').http;
var fs = require('fs');

var options = {
  'method': 'GET',
  'hostname': '10.1.64.119',
  'port': 6060,
  'path': '/api/v1/cube/get/dimension/?f=equipment',
  'headers': {
    'Cookie': 'sails.sid=s%3AwNXTudpGpLlFPzxv49Wg5PVfqapNkhUJ.OrNlAI9QlWqLyAzm5DogkuFRItUD0F4Jm9vYw6jozRE'
  },
  'maxRedirects': 20
};

var req = http.request(options, function (res) {
  var chunks = [];

  res.on("data", function (chunk) {
    chunks.push(chunk);
  });

  res.on("end", function (chunk) {
    var body = Buffer.concat(chunks);
    console.log(body.toString());
  });

  res.on("error", function (error) {
    console.error(error);
  });
});

req.end();
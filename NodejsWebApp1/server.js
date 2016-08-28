var http = require('http');

var port = process.env.port || 3001;
console.log("Server running on port 3001");

http.createServer(function (req, res) {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Hello World\n');
}).listen(port);
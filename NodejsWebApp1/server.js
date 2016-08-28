var crypto = require('crypto');
var http = require('http');
var express = require('express');
var mongoose = require('mongoose');

// This function creates a UUID that is nigh impossible to occur twice. (This function was taken from a previous project of Will Truscott's (9992022))
function makeId(){
    var array = new Uint8Array(16);
    var val = new Uint8Array(1);
    crypto.getRandomValues(array);
    var idx = 0;
    var shouldincrement = false;
    var uuidtemplate = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx";
    var makeuuidregex = /[xy]/g;
    
    return uuidtemplate.replace(makeuuidregex,
			function (c) {
        if (c == 'x') {
            if (!shouldincrement) {
                val[0] = array[idx] >>> 4;
            } else {
                val[0] = array[idx] << 4;
                val[0] = val[0] >>> 4;
                idx++;
            }
            shouldincrement = !shouldincrement;
            return val[0].toString(16);
        } else {
            return (0x8 + (array[idx] >>> 6)).toString(16);
        }
    });
}





var port = process.env.port || 3001;
console.log("Server running on port 3001");

http.createServer(function (req, res) {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Hello World\n');
}).listen(port);
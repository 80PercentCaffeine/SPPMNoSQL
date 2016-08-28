var crypto = require('crypto');
var http = require('http');
var express = require('express');
var mongoose = require('mongoose');
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
var request = require("request");
require('longjohn');
require("console-stamp")(console, { pattern: "dd/mm/yyyy HH:MM:ss.l" });

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

global.rootdir = __dirname + "\\" + "\client";
var rootdir = __dirname + "\\" + "\client";
var app = express();

app.use(cookieParser());
app.engine('.html', require('ejs').renderFile)	//may not be necessary? http://expressjs.com/en/api.html#app.engine
app.set("view engine", "ejs");
app.set('views', global.rootdir);

var prerouter = new express.Router()
	//logging
	.use(function (req, res, next) {
    console.log("-------------");
    console.log(req.method);
    console.log(req.url);
    console.log(req.path);
    console.log("-------------");
    next();
})
    //does some basic formatting - normalising the return from different body/cookie parsers and methods, etc.
	.use(function (req, res, next) {
    if (typeof req.body == "string") {	//seems under some cicumstances, the body is not parsed from JSON properly, so we have to do it again here. TODO: investigate.
        try {
            req.body = JSON.parse(req.body);
        } catch (e) {
				//probably just means it's a normal string instead of a JSON string
        }
    }
    if (typeof req.body !== "undefined" && Object.keys(req.body).length > 0) {
        req.query = req.body;
    }
    next();
});


var webserverrouter = new express.Router()
.all('/', function (req, res) {
    res.render("index.html", { query: req.query }, function (err, html) {
        console.log(err);
        if (err) {
            next();
        } else {
            res.send(html);
        }
    });
})
//ejs templates
.use('*.html', function (req, res, next) {
    res.render(req.baseUrl.substring(1), { query: req.query }, function (err, html) {
        if (err) {
            next();
        } else {
            res.send(html);
        }
    });
})
//other static servings
.use(express.static(rootdir))

app.use(bodyParser.json());
app.use(bodyParser.text());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.raw());

app.use("", prerouter);	//prerouter needs to come after bodyparser
app.use("", webserverrouter);


app.all(function (req, res) {
    console.log("404 redirect...", { "root": rootdir });
    res.redirect("/404.html");
});

console.log("app running on port 2089");
app.listen(2089);
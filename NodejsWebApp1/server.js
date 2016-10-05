var crypto = require('crypto');
var http = require('http');
var express = require('express');
var mongoose = require('mongoose');
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
var request = require("request");
require('longjohn');
require("console-stamp")(console, { pattern: "dd/mm/yyyy HH:MM:ss.l" });
var Item = require('./model/item.model');
var Sales = require('./model/sales.model');


// This function creates a UUID that is nigh impossible to occur twice. (This function was taken from a previous project of Will Truscott's (9992022))
function makeId() {
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

// sets the directory of the client folder in reference to the server
global.rootdir = __dirname +  "/client";
var rootdir = __dirname +  "/client";
var app = express();

// needed forejs rendering
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

// Serves html pages. Renders ejs into html.
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

// parses requests from strings to something more useful
app.use(bodyParser.json());
app.use(bodyParser.text());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.raw());

// prints to console
app.use("", prerouter);	//prerouter needs to come after bodyparser
app.use("", webserverrouter);


app.all(function (req, res) {
    console.log("404 redirect...", { "root": rootdir });
    res.redirect("/404.html");
});


//gets the item details from the form and saves it to the database
app.post('/addItem', function (req, res) {
    console.log('adding the item');
if(req.body._id==''){
    var itemData = new Item({
        id: 1111,
        name: req.body.itemTitle,
        description: req.body.itemDesc,
        price: req.body.ticketPrice,
        costprice: req.body.costPrice,
        stock: req.body.itemQuantity
    })

    itemData.save(function (err) {
        if (err) {
            return err;
        } else {
            res.send("Successfully added<script>//setTimeout('location.href=\\'/?Page=ManageItems\\'', 1000)</script>");
            console.log('item saved');
        }
    });
}else{
	Item.findOneAndUpdate(
		{_id: req.body._id},
		{
	        id: 1111,
    	    name: req.body.itemTitle,
        	description: req.body.itemDesc,
	        price: req.body.ticketPrice,
    	    costprice: req.body.costPrice,
        	stock: req.body.itemQuantity
		},
		function(){
            res.send("Successfully updated<script>//setTimeout('location.href=\\'/?Page=ManageItems\\'', 1000)</script>");
            console.log('item saved');

		}
	);
}

});

app.get('/viewItem', function (req, res) {
    console.log('getting all items');
    Item.find({}).exec(function (err, result) {
        if (err) {
            res.send('error has occured');
        } else {
            console.log(result);
            //var jsonObj = JSON.parse(result);
            res.send(result);
        }
    });
});


//connecting to the database
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://SPPMnoSQL:swinburne@ds019866.mlab.com:19866/sppmnosql', function (err, db) {
    if (!err) {
        console.log("We are connected");
    } else {
        console.log("Database not connected");
    }
});


console.log("app running on port 2089");
app.listen(2089);
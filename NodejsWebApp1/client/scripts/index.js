var lowOnStockItems = [];

function checkLowStock(items) {
	for (var i = 0; i < items.length; i++) {
		if (items[i].stock < items[i].minimumstock) {
			console.log(items[i].name + " is low on stock.");
			lowOnStockItems.push(items[i]);
		}
	}

	var alertElement = document.getElementById("stockLowAlert");
	if (lowOnStockItems.length > 0) {
		alertElement.hidden = false;
	}
	else {
		alertElement.hidden = true;
	}

	var alertElement = document.getElementById("lowStockNotificationDisplay");
	for (var i = 0; i < lowOnStockItems.length; i++) {
		alertElement.innerHTML += lowOnStockItems[i].name + " only has " + lowOnStockItems[i].stock + " in stock.<br>";
	}
}

function showLowStockItems() {
	var alertElement = document.getElementById("lowStockNotificationDisplay");
	alertElement.hidden = false;
}

function hideLowStockItems() {
	var alertElement = document.getElementById("lowStockNotificationDisplay");
	alertElement.hidden = true;
}

function initIndex() {
	checkLowStock(fakeItemsDatabaseIndex);
}

var fakeItemsDatabaseIndex = [
	{ "UUID": 1, "stock": 2, "minimumstock":2, "name": "hi", "price": 10, "costprice": 5 },
    { "UUID": 2, "stock": 4, "minimumstock":2, "name": "hello", "price": 20, "costprice": 10 },
	{ "UUID": 3, "stock": 6, "minimumstock":2, "name": "hello2", "price": 11, "costprice": 5 },
	{ "UUID": 4, "stock": 8, "minimumstock":5, "name": "aaaa", "price": 11, "costprice": 5 }
]
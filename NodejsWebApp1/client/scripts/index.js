function checkLowStock(items) {
	var lowOnStockItems = [];
	for (var i = 0; i < items.length; i++) {
		if (items[i].stock < items[i].minimumstock) {
			console.log(items[i].name + " is low on stock.");
			lowOnStockItems.push(items[i]);
		}
	}
}

function initIndex() {
	checkLowStock(fakeItemsDatabaseIndex);
}

var fakeItemsDatabaseIndex = [
	{ "UUID": 1, "stock": 2, "minimumstock":5, "name": "hi", "price": 10, "costprice": 5 },
    { "UUID": 2, "stock": 4, "minimumstock":5, "name": "hello", "price": 20, "costprice": 10 },
	{ "UUID": 3, "stock": 6, "minimumstock":5, "name": "hello2", "price": 11, "costprice": 5 },
	{ "UUID": 4, "stock": 8, "minimumstock":5, "name": "aaaa", "price": 11, "costprice": 5 }
]
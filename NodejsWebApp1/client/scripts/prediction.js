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

// list of items to fill sales with
var itemList = [];
// List of sales to predict things with
var salesList = [];
const ONE_DAY = 86400000;

function incomeBetween(start, end) {
	var salesThisPeriod = [];
	var totalIncomeThisPeriod = 0;
	var profitIncomeThisPeriod = 0;
	var averageSaleThisWeek = 0;

	for (var i = 0; i < salesList.length; i++) {
		if (salesList[i].timestamp > start && salesList[i].timestamp < end) {
			salesThisPeriod.push(salesList[i]);
		}
	}
	for (var i = 0; i < salesThisPeriod.length; i++) {
		totalIncomeThisPeriod += salesThisPeriod[i].total;
		profitIncomeThisPeriod += salesThisPeriod[i].totalprofit;
	}
	return {
		"total": salesThisPeriod.length,
		"income": totalIncomeThisPeriod,
		"profit": profitIncomeThisPeriod,
		"averageIncome": totalIncomeThisPeriod / salesThisPeriod.length,
		"averageProfit": profitIncomeThisPeriod / salesThisPeriod.length
	}
}

function addReport(period, report, tableId) {
	var reportTable = document.getElementById(tableId);
    var tr = document.createElement("tr");
    var td = document.createElement("td");
	td.innerHTML = period;
    tr.appendChild(td);
	td = document.createElement("td");
	td.innerHTML = report.total;
    tr.appendChild(td);
	td = document.createElement("td");
	td.innerHTML = report.income;
    tr.appendChild(td);
	td = document.createElement("td");
	td.innerHTML = report.profit;
    tr.appendChild(td);
	if (report.averageIncome != undefined && report.averageIncome != NaN) {
		td = document.createElement("td");
		td.innerHTML = report.averageIncome;
		tr.appendChild(td);
		td = document.createElement("td");
		td.innerHTML = report.averageProfit;
		tr.appendChild(td);
	}
	reportTable.appendChild(tr);
}

function addReportFromRange() {
	var minDateValue = document.getElementById("minDate").value;
	var maxDateValue = document.getElementById("maxDate").value;
	var minDate = new Date(minDateValue).valueOf();
	var maxDate = new Date(maxDateValue).valueOf();

	addReport(minDateValue + " to " + maxDateValue, incomeBetween(minDate, maxDate), "reportDisplay");
}

function weeklyReport() {
	var timeNow = Date.now();
	addReport("Last 7 days", incomeBetween(timeNow - (ONE_DAY * 7), timeNow), "reportDisplay");
}

function monthlyReport() {
	var timeNow = Date.now();
	addReport("Last 30 days", incomeBetween(timeNow - (ONE_DAY * 30), timeNow), "reportDisplay");
}

function allTimeReport() {
	var timeNow = Date.now();
	addReport("All time", incomeBetween(0, timeNow), "reportDisplay");
}

function monthlyPrediction() {

}

function weeklyPrediction() {

}

function addItemSpecifficReportFromRange() {
	var dropdownValue = document.getElementById("itemDropdown").value;
	var minDateValue = document.getElementById("itemMinDate").value;
	var maxDateValue = document.getElementById("itemMaxDate").value;
	var minDate = new Date(minDateValue).valueOf();
	var maxDate = new Date(maxDateValue).valueOf();

	var salesThisPeriod = [];
	var totalIncomeThisPeriod = 0;
	var profitIncomeThisPeriod = 0;
	var averageSaleThisWeek = 0;
	var itemPointer;

	for (var i = 0; i < salesList.length; i++) {
		if (salesList[i].timestamp > minDate && salesList[i].timestamp < maxDate) {
			salesThisPeriod.push(salesList[i]);
		}
	}
	for (var i = 0; i < itemList.length; i++) {
		if (dropdownValue == itemList[i].UUID) {
			itemPointer = itemList[i];
		}
	}
	var itemSaleTotal = 0;
	for (var i = 0; i < salesThisPeriod.length; i++) {
		for (var j = 0; j < salesThisPeriod[i].items.length; j++) {
			if (salesThisPeriod[i].items[j].UUID == itemPointer.UUID) {
				itemSaleTotal++;
			}
		}

	}

	addReport(itemPointer.name + " " + minDateValue + " to " + maxDateValue,
		{
			"total": itemSaleTotal,
			"income": (itemPointer.price) * itemSaleTotal,
			"profit": (itemPointer.price - itemPointer.costprice) * itemSaleTotal,
			"averageIncome": undefined,
			"averageProfit": undefined
		},
		"itemReportDisplay");
}

function itemSpecificReport(UUID) {
	var itemToDisplay;
	for (var i = 0; i < itemList.length; i++) {
		if (itemList[i].UUID == UUID) {
			itemToDisplay = itemList[i];
		}
	}

}

function downloadCsv(tableName) {
	var reportTable = document.getElementById(tableName);
	console.log(reportTable);
	console.log(reportTable.childNodes);
	var exportString = "";
	for (var i = 0; i < reportTable.childNodes.length; i++) {
		for (var j = 0; j < reportTable.childNodes[i].childNodes.length; j++) {
			exportString += reportTable.childNodes[i].childNodes[j].innerHTML + ",";
		}
		exportString += "\n";
	}
	var csvContent = "data:text/csv;charset=utf-8,";
	csvContent += exportString;

	var encodedUri = encodeURI(csvContent);
	var link = document.createElement("a");
	link.setAttribute("href", encodedUri);
	link.setAttribute("download", reportTable.childNodes[reportTable.childNodes.length - 1].childNodes[0].innerHTML + ".csv");
	document.body.appendChild(link); // Required for FF
	
	link.click(); // This will download the data file named "my_data.csv".
}

function sortItemsByProfit30(a, b) {
	if (a.totalSalesThisMonth * (a.price - a.costprice) < b.totalSalesThisMonth * (b.price - b.costprice)) {
		return 1;
	}
	else {
		return -1;
	}
}

function sortItemsByProfitAllTime(a, b) {
	if (a.totalSalesAllTime * (a.price - a.costprice) < b.totalSalesAllTime * (b.price - b.costprice)) {
		return 1;
	}
	else {
		return -1;
	}
}

function setupPage(docsSales) {
	salesList = docsSales;

	// report list
	var reportTable = document.getElementById("reportDisplay");
    reportTable.innerHTML = "";
    var tr = document.createElement("tr");
    var td = document.createElement("td");
    tr.appendChild(td);
	td = document.createElement("td");
	td.innerHTML = "Total sales";
    tr.appendChild(td);
	td = document.createElement("td");
	td.innerHTML = "Total income";
    tr.appendChild(td);
	td = document.createElement("td");
	td.innerHTML = "Total profit";
    tr.appendChild(td);
	td = document.createElement("td");
	td.innerHTML = "Average income";
    tr.appendChild(td);
	td = document.createElement("td");
	td.innerHTML = "Average profit";
    tr.appendChild(td);
	reportTable.appendChild(tr);

	// item specific report list
	var reportTable = document.getElementById("itemReportDisplay");
    reportTable.innerHTML = "";
    tr = document.createElement("tr");
    td = document.createElement("td");
    tr.appendChild(td);
	td = document.createElement("td");
	td.innerHTML = "Total sales";
    tr.appendChild(td);
	td = document.createElement("td");
	td.innerHTML = "Total income";
    tr.appendChild(td);
	td = document.createElement("td");
	td.innerHTML = "Total profit";
    tr.appendChild(td);
	reportTable.appendChild(tr);

	var profitTable = document.getElementById("itemProfitDisplay");
	profitTable.innerHTML = "";
    tr = document.createElement("tr");
    td = document.createElement("td");
	td.innerHTML = "Item name";
    tr.appendChild(td);
	td = document.createElement("td");
	td.innerHTML = "Total sales";
    tr.appendChild(td);
	td = document.createElement("td");
	td.innerHTML = "Total income";
    tr.appendChild(td);
	td = document.createElement("td");
	td.innerHTML = "Total profit";
    tr.appendChild(td);
	profitTable.appendChild(tr);

	var profitTable = document.getElementById("itemProfitDisplayAllTime");
	profitTable.innerHTML = "";
    tr = document.createElement("tr");
    td = document.createElement("td");
	td.innerHTML = "Item name";
    tr.appendChild(td);
	td = document.createElement("td");
	td.innerHTML = "Total sales";
    tr.appendChild(td);
	td = document.createElement("td");
	td.innerHTML = "Total income";
    tr.appendChild(td);
	td = document.createElement("td");
	td.innerHTML = "Total profit";
    tr.appendChild(td);
	profitTable.appendChild(tr);

	var now = Date.now().valueOf();
	var thirtyDaysAgo = now - (ONE_DAY * 30);
	var salesThisPeriod = [];
	var salesAllTime = [];
	for (var i = 0; i < salesList.length; i++) {
		for (var j = 0; j < salesList[i].items.length; j++) {
			for (var k = 0; k < itemList.length; k++) {
				if (salesList[i].items[j] == itemList[k].UUID) {
					salesList[i].items[j] = itemList[k];
				}
			}
		}
		if (salesList[i].timestamp > thirtyDaysAgo && salesList[i].timestamp < now) {
			salesThisPeriod.push(salesList[i]);
		}
		salesAllTime.push(salesList[i]);
	}
	for (var i = 0; i < itemList.length; i++) {
		itemList[i].totalSalesThisMonth = 0;
		itemList[i].totalSalesAllTime = 0;
	}
	for (var i = 0; i < salesThisPeriod.length; i++) {
		for (var j = 0; j < salesThisPeriod[i].items.length; j++) {
			for (var k = 0; k < itemList.length; k++) {
				if (salesThisPeriod[i].items[j].UUID == itemList[k].UUID) {
					itemList[k].totalSalesThisMonth++;
				}
			}
		}
		
	}
	for (var i = 0; i < salesAllTime.length; i++) {
		for (var j = 0; j < salesAllTime[i].items.length; j++) {
			for (var k = 0; k < itemList.length; k++) {
				if (salesAllTime[i].items[j].UUID == itemList[k].UUID) {
					itemList[k].totalSalesAllTime++;
				}
			}
		}
	}

	itemList.sort(sortItemsByProfit30);
	var profitTable = document.getElementById("itemProfitDisplay");
	for (var i = 0; i < itemList.length; i++) {
		if (i > 10) {
			break;
		}
		tr = document.createElement("tr");
		td = document.createElement("td");
		td.innerHTML = itemList[i].name;
		tr.appendChild(td);
		td = document.createElement("td");
		td.innerHTML = itemList[i].totalSalesThisMonth;
		tr.appendChild(td);
		td = document.createElement("td");
		td.innerHTML = itemList[i].totalSalesThisMonth * itemList[i].price;
		tr.appendChild(td);
		td = document.createElement("td");
		td.innerHTML = itemList[i].totalSalesThisMonth * (itemList[i].price - itemList[i].costprice);
		tr.appendChild(td);
		profitTable.appendChild(tr);
	}

	itemList.sort(sortItemsByProfitAllTime);
	var profitTable = document.getElementById("itemProfitDisplayAllTime");
	for (var i = 0; i < itemList.length; i++) {
		if (i > 10) {
			break;
		}
		tr = document.createElement("tr");
		td = document.createElement("td");
		td.innerHTML = itemList[i].name;
		tr.appendChild(td);
		td = document.createElement("td");
		td.innerHTML = itemList[i].totalSalesAllTime;
		tr.appendChild(td);
		td = document.createElement("td");
		td.innerHTML = itemList[i].totalSalesAllTime * itemList[i].price;
		tr.appendChild(td);
		td = document.createElement("td");
		td.innerHTML = itemList[i].totalSalesAllTime * (itemList[i].price - itemList[i].costprice);
		tr.appendChild(td);
		profitTable.appendChild(tr);
	}

	weeklyReport();
	monthlyReport();
	allTimeReport();
}

function setupItems(docsItems) {
	itemList = docsItems;
	var dropdown = document.getElementById("itemDropdown");
	for (var i = 0; i < itemList.length; i++) {
		var dropdownOption = document.createElement("Option");
		dropdownOption.innerHTML = itemList[i].name;
		dropdownOption.value = itemList[i].UUID;
		dropdown.appendChild(dropdownOption);
	}
	setupPage(fakeSalesDatabase)
}

function init() {
	setupItems(fakeItemsDatabase);
}

var fakeItemsDatabase = [
	{ "UUID": makeId(), "name": "hi", "price": 10, "costprice": 5 },
    { "UUID": makeId(), "name": "hello", "price": 20, "costprice": 10 },
	{ "UUID": makeId(), "name": "hello2", "price": 11, "costprice": 5 },
	{ "UUID": makeId(), "name": "aaaa", "price": 11, "costprice": 5 }
]

var fakeSalesDatabase = [
	{
		"UUID": makeId(),
		"items": [
			fakeItemsDatabase[0].UUID,
			fakeItemsDatabase[0].UUID,
			fakeItemsDatabase[0].UUID,
			fakeItemsDatabase[0].UUID,
			fakeItemsDatabase[2].UUID,
			fakeItemsDatabase[1].UUID
		],
		"total": 71,
		"totalprofit": 35,
		"timestamp": 10
	},
	{
		"UUID": makeId(),
		"items": [
			fakeItemsDatabase[2].UUID,
			fakeItemsDatabase[1].UUID
		],
		"total": 31,
		"totalprofit": 15,
		"timestamp": 1474521020219
	},
	{
		"UUID": makeId(),
		"items": [
			fakeItemsDatabase[2].UUID,
			fakeItemsDatabase[1].UUID
		],
		"total": 31,
		"totalprofit": 15,
		"timestamp": 1474521010218
	},
	{
		"UUID": makeId(),
		"items": [
			fakeItemsDatabase[2].UUID,
			fakeItemsDatabase[1].UUID
		],
		"total": 31,
		"totalprofit": 15,
		"timestamp": 1474521010218 - (ONE_DAY * 8)
	},
	{
		"UUID": makeId(),
		"items": [
			fakeItemsDatabase[0].UUID,
			fakeItemsDatabase[0].UUID
		],
		"total": 20,
		"totalprofit": 10,
		"timestamp": 1474521080000
	}
]
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

function incomeBetween(start, end){
	var salesThisPeriod = [];
	var totalIncomeThisPeriod = 0;
	var profitIncomeThisPeriod = 0;
	var averageSaleThisWeek = 0;
	
	for(var i = 0; i < salesList.length; i++){
		if(salesList[i].timestamp > start && salesList[i].timestamp < end){
			salesThisPeriod.push(salesList[i]);
		}
	}
	for(var i = 0; i < salesThisPeriod.length; i++){
		totalIncomeThisPeriod += salesThisPeriod[i].total;
		profitIncomeThisPeriod += salesThisPeriod[i].totalprofit;
	}
	return{
		"total": salesThisPeriod.length,
		"income": totalIncomeThisPeriod,
		"profit": profitIncomeThisPeriod,
		"averageIncome": totalIncomeThisPeriod / salesThisPeriod.length,
		"averageProfit": profitIncomeThisPeriod / salesThisPeriod.length
	}
}

function addReport(period, report){
	var reportTable = document.getElementById("reportDisplay");
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
	td = document.createElement("td");
	td.innerHTML = report.averageIncome;
    tr.appendChild(td);
	td = document.createElement("td");
	td.innerHTML = report.averageProfit;
    tr.appendChild(td);
	reportTable.appendChild(tr);
}

function addReportFromRange(){
	var minDateValue = document.getElementById("minDate").value;
	var maxDateValue = document.getElementById("maxDate").value;
	var minDate = new Date(minDateValue).valueOf();
	var maxDate = new Date(maxDateValue).valueOf();
	console.log(minDate);
	console.log(maxDate);
	addReport(minDateValue + " to " + maxDateValue, incomeBetween(minDate, maxDate));
}

function weeklyReport(){
	var timeNow = Date.now();
	addReport("Last 7 days", incomeBetween(timeNow - (ONE_DAY * 7), timeNow));
}

function monthlyReport(){
	var timeNow = Date.now();
	addReport("Last 30 days", incomeBetween(timeNow - (ONE_DAY * 30), timeNow));
}

function monthlyPrediction(){
	
}

function weeklyPrediction(){
	
}

function itemSpecificPrediction(UUID){
	
}

function salesSpecificPrediction(UUID){
	
}

function setupPage(docsSales){
	salesList = docsSales;
	
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
	
	weeklyReport();
	monthlyReport();
}

function setupItems(docsItems){
	itemList = docsItems;
	setupPage(fakeSalesDatabase)
}

function init(){
	setupItems(fakeItemsDatabase);
}

var fakeItemsDatabase = [
	{ "UUID": makeId(), "name": "hi", "price": "10", "costprice": "5" }, 
    { "UUID": makeId(), "name": "hello", "price": "20", "costprice": "10" }, 
	{ "UUID": makeId(), "name": "hello2", "price": "11", "costprice": "5" }
]

var fakeSalesDatabase = [
	{
		"UUID":makeId(),
		"items":[
			fakeItemsDatabase[0],
			fakeItemsDatabase[0],
			fakeItemsDatabase[0],
			fakeItemsDatabase[0],
			fakeItemsDatabase[2],
			fakeItemsDatabase[1]
		],
		"total":71,
		"totalprofit": 35,
		"timestamp": 10
	},
	{
		"UUID":makeId(),
		"items":[
			fakeItemsDatabase[2],
			fakeItemsDatabase[1]
		],
		"total":31,
		"totalprofit": 15,
		"timestamp": 1474521020219
	},
	{
		"UUID":makeId(),
		"items":[
			fakeItemsDatabase[2],
			fakeItemsDatabase[1]
		],
		"total":31,
		"totalprofit": 15,
		"timestamp": 1474521010218
	},
	{
		"UUID":makeId(),
		"items":[
			fakeItemsDatabase[2],
			fakeItemsDatabase[1]
		],
		"total":31,
		"totalprofit": 15,
		"timestamp": 1474521010218 - (ONE_DAY*8)
	},
	{
		"UUID":makeId(),
		"items":[
			fakeItemsDatabase[0],
			fakeItemsDatabase[0]
		],
		"total":20,
		"totalprofit": 10,
		"timestamp": 1474521080000
	}
]
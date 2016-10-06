function init() {
    var xhr = new XMLHttpRequest();
	xhr.open("get", "/viewSale");
	xhr.onload= function(resp){
		var salesArray = JSON.parse(resp.target.response);
		console.log(salesArray);
	
		var table = "<table><tr><th>Items</th><th>Total</th><th>Total Profit</th><th>date</th></tr>";
	
		for (var i = 0; i < salesArray.length; i++) {
			var dateObject = new Date(salesArray[i].timestamp);
			var itemSummary = ""
			for (var j = 0; j < salesArray[i].items.length; j++) {
				itemSummary += salesArray[i].items[j] + "<br>";
			}
			table += "<tr><td>" + itemSummary + "</td><td>$" + salesArray[i].total + "</td><td>$" + salesArray[i].totalprofit + "</td><td>" + dateObject.toString() + "</td></tr>";
		}
		table += "</table>";
		
		document.getElementById("salesRecords").innerHTML = table;
	}
	xhr.send();
}

window.onload = init;
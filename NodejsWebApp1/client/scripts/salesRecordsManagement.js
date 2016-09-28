function init() {
    var salesObj = {
            "items" : "panadol",
            "total" : 100,
            "totalprofit" : 200
        },

        salesObj2 = {
            "items" : "panadol2",
            "total" : 100,
            "totalprofit" : 200
        },

        salesObj3 = {
            "items" : "panadol3",
            "total" : 100,
            "totalprofit" : 200
        },

        salesObj4 = {
            "items" : "panadol4",
            "total" : 100,
            "totalprofit" : 200
        },

        salesObj5 = {
            "items" : "panadol5",
            "total" : 100,
            "totalprofit" : 200
        };

    var name = salesObj.items;

    var salesArray = [salesObj, salesObj2, salesObj3, salesObj4, salesObj5];

    var table = "<table><tr><th>Item</th><th>Total</th><th>Total Profit</th></tr>";

    for (var i = 0; i < salesArray.length; i++) {
        table += "<tr><td>" + salesArray[i].items + "</td><td>" + salesArray[i].total + "</td><td>" + salesArray[i].totalprofit + "</td></tr>";
    }
    table += "</table>";
    
    document.getElementById("salesRecords").innerHTML = table;
}

window.onload = init;
function setupTable(docs){
    docs = [
        { "UUID": 1, "name": "hi",     "price": "$10" }, 
        { "UUID": 2, "name": "hello",  "price": "$20" }, 
        { "UUID": 3, "name": "hello2", "price": "$11" }
    ];
    var itemTable = document.getElementById("itemDisplay");
    var tr = document.createElement("tr");
    var td = document.createElement("td");
    td.innerHTML = "Name";
    tr.appendChild(td);
    var td = document.createElement("td");
    td.innerHTML = "Price";
    tr.appendChild(td);
    itemTable.appendChild(tr);

    for (var i = 0; i < docs.length; i++) {
        var tr = document.createElement("tr");
        console.log(docs[i].name)
        var td = document.createElement("td");
        td.innerHTML = docs[i].name;
        tr.appendChild(td);
        var td = document.createElement("td");
        td.innerHTML = docs[i].price;
        tr.appendChild(td);
        tr.onclick = (function (UUID) {
            return function () {
                displayItem(UUID)
            }
        })(docs[i].UUID);
        itemTable.appendChild(tr);
    }
}

function displayItem(UUID){
    console.log(UUID);
}

function addItem() {
    console.log(UUID);
}

function deleteItem(UUID) {
    console.log(UUID);
}

// TODO: replace with db call.
function init(){
	setupTable("");
}
var items = [];

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

function setupTable(docs){
    items = docs;
    var itemTable = document.getElementById("itemDisplay");
    itemTable.innerHTML = "";
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
    for (var i = 0; i < items.length; i++) {
        if (items[i].UUID == UUID) {
            var toDisplay = items[i];
            console.log(items[i].name);
        }
    }
}

function addItem() {
    console.log(makeId());
    items.push({ "UUID": makeId(), "name": "", "price": "$0" });
    setupTable(items);
}

function deleteItem(UUID) {
    console.log(UUID);
}

// TODO: replace with db call.
function init(){
	setupTable([
        { "UUID": makeId(), "name": "hi", "price": "$10" }, 
        { "UUID": makeId(), "name": "hello", "price": "$20" }, 
        { "UUID": makeId(), "name": "hello2", "price": "$11" }
    ]);
}
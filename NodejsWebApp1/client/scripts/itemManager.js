var items = [];
var activeItem;

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
    //delete button
    var td = document.createElement("td");
    tr.appendChild(td);
    //name
    var td = document.createElement("td");
    td.innerHTML = "Name";
    tr.appendChild(td);
    //price
    var td = document.createElement("td");
    td.innerHTML = "Price";
    tr.appendChild(td);
    itemTable.appendChild(tr);

    for (var i = 0; i < docs.length; i++) {
        var tr = document.createElement("tr");
        var td = document.createElement("td");
        var deleteButton = document.createElement("img");
        deleteButton.src = "images/deleteButton.png";
        deleteButton.onclick = (function (UUID) {
            return function () {
                deleteItem(UUID);
            }
        })(docs[i].UUID);
        td.appendChild(deleteButton);
        tr.appendChild(td);
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
            activeItem = items[i];
        }
    }

    document.getElementById("itemTitle").value = activeItem.name;
    document.getElementById("itemDesc").value = activeItem.description;
    document.getElementById("itemPrice").value = activeItem.price;
    document.getElementById("itemCostPrice").value = activeItem.costprice;
    document.getElementById("itemStock").value = activeItem.stock;
}

function addItem() {
    items.push({ "UUID": makeId(), "name": "", "description": "desc", "price": "$0", "costprice": "$0", "stock":5 });
    // add to db
    setupTable(items);
}

function deleteItem(UUID) {
    var itemIndex = -1;
    for (var i = 0; i < items.length; i++) {
        if (items[i].UUID == UUID) {
            itemIndex = i;
            // remove from db
        }
    }
    if (itemIndex > -1) {
        items.splice(itemIndex, 1);
        setupTable(items);
    }
}

function updateItem(){
    activeItem.name = document.getElementById("itemTitle").value;
    activeItem.description = document.getElementById("itemDesc").value;
    activeItem.price = document.getElementById("itemPrice").value;
    activeItem.costprice = document.getElementById("itemCostPrice").value;
    activeItem.stock = document.getElementById("itemStock").value;

    //Update in db

    setupTable(items);
}

// TODO: replace with db call.
function init(){
	setupTable([
        { "UUID": makeId(), "name": "hi", "price": "$10" }, 
        { "UUID": makeId(), "name": "hello", "price": "$20" }, 
        { "UUID": makeId(), "name": "hello2", "price": "$11" }
    ]);
}
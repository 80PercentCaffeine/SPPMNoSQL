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
	td.onclick = (function () {
		return function () {
			sortImages("name");
		}
	})();
    tr.appendChild(td);
    //price
    var td = document.createElement("td");
    td.innerHTML = "Price";
	td.onclick = (function () {
		return function () {
			sortImages("price");
		}
	})();
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
	
	if(activeItem.name != undefined){
		document.getElementById("itemTitle").value = activeItem.name;
	}
	if(activeItem.description != undefined){
		document.getElementById("itemDesc").value = activeItem.description;
	}
	if(activeItem.price != undefined){
		document.getElementById("itemPrice").value = activeItem.price;
	}
	if(activeItem.costprice != undefined){
		document.getElementById("itemCostPrice").value = activeItem.costprice;
	}
	if(activeItem.stock != undefined){
		document.getElementById("itemStock").value = activeItem.stock;
	}
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
	if(document.getElementById("itemTitle").value != undefined){
		activeItem.name = document.getElementById("itemTitle").value;
	}
	if(document.getElementById("itemDesc").value != undefined){
		activeItem.description = document.getElementById("itemDesc").value;
	}
	if(document.getElementById("itemPrice").value != undefined){
		activeItem.price = document.getElementById("itemPrice").value;
	}
	if(document.getElementById("itemCostPrice").value != undefined){
		activeItem.costprice = document.getElementById("itemCostPrice").value;
	}
	if(document.getElementById("itemStock").value != undefined){
		activeItem.stock = document.getElementById("itemStock").value;
	}

    //Update in db
    setupTable(items);
}

function searchItems(){
    var searchBar = document.getElementById("searchBar");
	if(searchBar.value != undefined &&searchBar.value != ""){
		var matchesQuery = [];
		for(var i = 0; i < fakeDatabase.length; i++){
			if(fakeDatabase[i].name.indexOf(searchBar.value) > -1){
				matchesQuery.push(fakeDatabase[i]);
			}
		}
		setupTable(matchesQuery);
	}
	else{
		setupTable(fakeDatabase);
	}
}

function sortImages(sortType){
	if(sortType == "name"){
		items.sort(function sortName(a,b){
			if(a.name > b.name){
				return 1;
			}
			return -1;
		})
	}
	else if(sortType == "price"){
		items.sort(function sortName(a,b){
			if(a.price > b.price){
				return 1;
			}
			return -1;
		})
	}
	setupTable(items);
}

// TODO: replace with db call.
function init(){
	setupTable(fakeDatabase);
}

var fakeDatabase = [
    { "UUID": makeId(), "name": "hi", "price": "10", "costprice": "5" }, 
    { "UUID": makeId(), "name": "hello", "price": "20", "costprice": "10" }, 
	{ "UUID": makeId(), "name": "hello2", "price": "11", "costprice": "5" }
]

$(document).ready(function(){
	$('body').on('click', '.editItem', function(){
//		console.log(this.parentNode.parentNode)
		tr=this.parentNode.parentNode;
		console.log(tr)
		$('#itemTitle')    .val(tr.childNodes[1].innerText);
		$('#itemPrice')    .val(tr.childNodes[5].innerText);
		$('#itemCostPrice').val(tr.childNodes[7].innerText);
		$('#itemStock')    .val(tr.childNodes[9].innerText);
		$('#itemDesc')     .val(tr.childNodes[3].innerText);
		$('#_id')          .val(this.dataset['id'])
	})
	
	$('body').on('click', '.deleteItem', function(){
//		console.log(this.parentNode.parentNode)
		console.log("Hello?");
		tr=this.parentNode.parentNode;
		tr.remove();
		var xhr = new XMLHttpRequest();
		xhr.open("post", "/addItem");
		xhr.send(JSON.stringify({"_id":this.dataset['id'], "hidden":true}));
		//console.log(tr)
		//$('#itemTitle')    .val(tr.childNodes[1].innerText);
		//$('#itemPrice')    .val(tr.childNodes[5].innerText);
		//$('#itemCostPrice').val(tr.childNodes[7].innerText);
		//$('#itemStock')    .val(tr.childNodes[9].innerText);
		//$('#itemDesc')     .val(tr.childNodes[3].innerText);
		//$('#_id')          .val(this.dataset['id'])
	})
/*	$('body').on('click', '#addItemSubmit', function(){
		$.ajax({
		    type: "POST",
		    url: "/addItem",
	    	data: $('#addItemForm').serialize(),
//		    dataType: "json",
		    success: function(data) {
        	//var obj = jQuery.parseJSON(data); if the dataType is not specified as json uncomment this
	        // do what ever you want with the server response
		    },
	    	error: function() {
		        alert('An error has occured while updating the item');
	    }
});
	})*/
})
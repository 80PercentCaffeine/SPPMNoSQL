function setupTable(docs){
    docs = [{ "UUID": 1, "name": "hi" }, { "UUID": 2, "name": "hello" }, { "UUID": 3, "name": "hello2" }];
    var itemTable = document.getElementById("itemDisplay");
    console.log(docs);
    for (var i = 0; i < docs.length; i++) {
        var tr = document.createElement("tr");
        console.log(docs[i].name)
        var td = document.createElement("td");
        td.innerHTML = docs[i].name;
        tr.appendChild(td);
        tr.onclick = function (UUID){
            return displayItem(UUID);
        }(docs[i].UUID);
        itemTable.appendChild(tr);
    }
}

function displayItem(UUID){
    console.log(UUID);
}

// TODO: replace with db call.
function init(){
	setupTable("");
}
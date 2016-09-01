

function setupTable(docs){
    docs = [{ "name": "hi" }, { "name": "hello" }];
    var itemTable = document.getElementById("itemDisplay");
    console.log(docs);
    for (var i = 0; i < docs.length; i++) {
        var tr = document.createElement("tr");
        console.log(docs[i].name)
        var td = document.createElement("td");
        td.innerHTML = docs[i].name;
        tr.appendChild(td);
        itemTable.appendChild(tr);
    }
}
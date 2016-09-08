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

var fakeItemsDatabase = {
	{ "UUID": makeId(), "name": "hi", "price": "10", "costprice": "5" }, 
    { "UUID": makeId(), "name": "hello", "price": "20", "costprice": "10" }, 
	{ "UUID": makeId(), "name": "hello2", "price": "11", "costprice": "5" }
}

var fakeSalesDatabase = {
	{
		"UUID":makeId(),
		"items":{
			fakeItemsDatabase[0],
			fakeItemsDatabase[0],
			fakeItemsDatabase[0],
			fakeItemsDatabase[0],
			fakeItemsDatabase[2],
			fakeItemsDatabase[1]
		},
		"total":71,
		"totalprofit": 35
	},
	{
		"UUID":makeId(),
		"items":{
			fakeItemsDatabase[2],
			fakeItemsDatabase[1]
		},
		"total":31,
		"totalprofit": 15
	}
	{
		"UUID":makeId(),
		"items":{
			fakeItemsDatabase[0],
			fakeItemsDatabase[0]
		},
		"total":31,
		"totalprofit": 15
	}
}

var monthlyPrediction(){
	
}

var weeklyPrediction(){
	
}

var itemSpecificPrediction(UUID){
	
}

var monthlyProfits(){
	
}

var weeklyProfits(){
	
}

var salesSpecificPrediction(UUID){
	
}
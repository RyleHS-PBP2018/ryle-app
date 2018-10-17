
var arrItems = []; //The array that will store the json values

$.getJSON("ExtensionGrid.json", function (data) { 
	$.each(data, function (index, value) 
		{ arrItems.push(value); })
});


function GetInfoByRN(){	
	
	document.getElementById("ToRoomRNumber").innerHTML = arrItems[0]["Last Names"];
	document.getElementById("ToRoomTeacher").innerHTML = "Paragraph changed.";
	document.getElementById("ToRoomWebsite").innerHTML = "Paragraph changed.";
	document.getElementById("ToRoomEmail").innerHTML = "Paragraph changed.";
	
}

function GetInfoByTeacher() {
   document.getElementById("demo").innerHTML = "Paragraph changed.";
}


function readTextFile(file, callback) {
    var rawFile = new XMLHttpRequest();
    rawFile.overrideMimeType("application/json");
    rawFile.open("GET", file, true);
    rawFile.onreadystatechange = function() {
        if (rawFile.readyState === 4 && rawFile.status == "200") {
            callback(rawFile.responseText);
        }
    }
    rawFile.send(null);
}


function GetInfoByRN(FromTo){
	let e = document.getElementById("ClassPeriod");
	let period = e.options[e.selectedIndex].value;
	
	let roomnumber = parseInt(document.getElementById(FromTo + "RoomNumber").value);
	
	let iterator = 0;
	let DBRoomNumber = "";
	
	//TODO Clean up logic errors (changes display to last index if room not found or teacher does not have [period])
	while (iterator < database.data.length - 1) {
		DBRoomNumber = database.data[iterator][period];
		if (DBRoomNumber == null) { iterator++; continue }
		DBRoomNumber = DBRoomNumber.replace(/\D/g,'');
		
		if (DBRoomNumber == roomnumber) {
			console.log("GetInfoByRN: Room Data located!");
			break;
		}
		
		else { iterator++; }
	}
	
	document.getElementById(FromTo + "RoomRNumber").innerHTML = "Room " + database.data[iterator][period];
	document.getElementById(FromTo + "RoomTeacher").innerHTML = database.data[iterator]["Last Names"];
	
}

function GetInfoByTeacher() {
   document.getElementById("demo").innerHTML = "Paragraph changed.";
}

// --------------- Seperation Between function definitions and actual scripts ----------------

var database = {
    data:undefined,
	logData : function() { console.log(this.data); }
}

readTextFile("Scripts/ExtensionGrid.json", function(text){
	var data = JSON.parse(text);
	database["data"] = data;
	console.log(database.data);
}); 

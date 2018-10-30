

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


function GetInfoByRN(FromTo){ //TODO Handle room numbers that have letters in them, and add band, gym, and library compatibility.
	let e = document.getElementById("ClassPeriod");
	let period = e.options[e.selectedIndex].value;
	let roomnumber = parseInt(document.getElementById(FromTo + "RoomNumber").value);
	let index = GetRoomIndex(roomnumber, period, FromTo);
	
	if (index["errmsg"] != null) {
		document.getElementById(FromTo + "ErrorLogContent").innerHTML = index["errmsg"];
		document.getElementById(FromTo + "ErrorLogContent").style.display = "block";
	}
	else { 
		document.getElementById(FromTo + "ErrorLogContent").style.display = "none";
		document.getElementById(FromTo + "RoomRNumber").innerHTML = "Room " + database.data[index["iterator"]][period];
		document.getElementById(FromTo + "RoomTeacher").innerHTML = database.data[index["iterator"]]["Last Names"];
	}
}


function GetInfoByTeacher() {
   document.getElementById("demo").innerHTML = "Paragraph changed.";
}


function GetRoomIndex(roomnumber, period, FromTo) {
	let iterator = 0;
	let DBRoomNumber = "";
	let errmsg = null;
	
	if (isNaN(roomnumber)) {
		console.log(FromTo + " room number is NaN");
		errmsg =("Please enter a \"" + FromTo + "\" room number.");
		return {
			iterator,
			errmsg,
		};
	}
	
	while (iterator < database.data.length - 1) {

		DBRoomNumber = database.data[iterator][period]; //Set DBRoomNumber to the next .json index
		if (DBRoomNumber == null) { iterator++; continue; } //If the room does not have a class at specified period, continue.
		DBRoomNumber = DBRoomNumber.replace(/\D/g,''); //Remove the wing letter(s) from the resultant database value
		
		if (DBRoomNumber == roomnumber) {
			console.log("GetInfoByRN: Room Data located!");
			break;
		}
		else if (iterator == database.data.length - 2) { //Catches invalid room numbers (late catch for characters, NaN values, and decimals)
			errmsg =("Invalid \"" + FromTo + "\" room number, or room " + roomnumber + " does not have a class at this period.\n");
			break;
		}
		else { iterator++; }
	}
	return {
		iterator,
		errmsg,
	};
}


function CheckErrorBoxes() {
	if ( document.getElementById("ToErrorLogContent").style.display == "none" && document.getElementById("FromErrorLogContent").style.display == "none") {
		document.getElementById("UserErrorLog").style.display = "none";
	}
	else { document.getElementById("UserErrorLog").style.display = "block"; }
	
	if ( document.getElementById("ToErrorLogContent").style.display != "none" && document.getElementById("FromErrorLogContent").style.display != "none") {
		document.getElementById("ErrorBreak").style.display = "block";
	}
	else { document.getElementById("ErrorBreak").style.display = "none"; }
}


function SwitchTab(ElementID) {
	//If element specified is not already visible
	if (document.getElementById(ElementID + "LookupTab").style.display != "block") {
		
		//Hide all elements based on a class
		tabs = document.getElementsByClassName("SelectionTab");
		for (i = 0; i < tabs.length; i++) {
			tabs[i].style.display = "none";
		}
		
		//Show specified element
		document.getElementById(ElementID + "LookupTab").style.display = "block";
		
		//Show all button borders
		document.getElementById("DirectionsButton").style.borderBottom = "1px solid black";
		document.getElementById("TeacherButton").style.borderBottom = "1px solid black";
		document.getElementById("RoomButton").style.borderBottom = "1px solid black";
		
		//Hide selected border
		document.getElementById(ElementID + "Button").style.borderBottom = "none";
		return true;
		
	} else { return false; }
}

// --------------- Seperation Between function definitions and actual scripts ----------------

var database = {
    data:undefined,
}

readTextFile("Scripts/ExtensionGrid.json", function(text){
	var data = JSON.parse(text);
	database["data"] = data;
}); 

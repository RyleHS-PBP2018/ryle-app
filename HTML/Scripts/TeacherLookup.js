
//Reads external files into the script
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


//Displays info for users based on specified room number in HTML text boxes
function DisplayInfoForDirections(FromTo){ //TODO Handle room numbers that have letters in them, and add band, gym, and library compatibility.
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


//Displays info in the TeacherLookup Utility based on a specified teacher name
function DisplayInfoByTeacher() {
	let namestring = document.getElementById("TeacherLookupInput").value;
	namestring = namestring.split(", "); // ["Last Name", "First Name"]
	let iterator = 0;
	while (iterator < database.data.length - 1) {
		
		if (database.data[iterator]["Last Names"] == namestring[0] && database.data[iterator]["First Names"] == namestring[1]) {
			//If the specified teacher object is found
			//Make sure display div is visible
			if (document.getElementById("TeacherLookupDisplay").style.display == "none") {
				document.getElementById("TeacherLookupDisplay").style.display = "block";
			}
			
			//Display teacher name
			document.getElementById("TLDisplayName").innerHTML = document.getElementById("TeacherLookupInput").value;
			
			//Display room info
			document.getElementById("TLPeriod1").innerHTML = "1st: " + GetValidRoomInfo(iterator, "1st");
			document.getElementById("TLPeriod2").innerHTML = "2nd: " + GetValidRoomInfo(iterator, "2nd");
			document.getElementById("TLPeriod3").innerHTML = "3rd: " + GetValidRoomInfo(iterator, "3rd");
			document.getElementById("TLPeriodRAP").innerHTML = "RAP: " + GetValidRoomInfo(iterator, "RAP");
			document.getElementById("TLPeriod4").innerHTML = "4th: " + GetValidRoomInfo(iterator, "4th");
			document.getElementById("TLPeriod5").innerHTML = "5th: " + GetValidRoomInfo(iterator, "5th");
			document.getElementById("TLPeriod6").innerHTML = "6th: " + GetValidRoomInfo(iterator, "6th");
			return true;
		}
		iterator++;
	}
	return false;
}


//Displays which teachers are in which room throughout the day
function DisplayInfoByRN() {
	let roomnumber = document.getElementById("RoomLookupInput").value;
	if (roomnumber != "") {
		document.getElementById("RoomLookupContent").style.display = "block";
		document.getElementById("RLRoomNumber").innerHTML = "Room " + roomnumber;
		document.getElementById("RLPeriod1").innerHTML = "1st: " + GetTeacherNameByRoomPeriod(roomnumber, "1st");
		document.getElementById("RLPeriod2").innerHTML = "2nd: " + GetTeacherNameByRoomPeriod(roomnumber, "2nd");
		document.getElementById("RLPeriod3").innerHTML = "3rd: " + GetTeacherNameByRoomPeriod(roomnumber, "3rd");
		document.getElementById("RLPeriodRAP").innerHTML = "RAP: " + GetTeacherNameByRoomPeriod(roomnumber, "RAP");
		document.getElementById("RLPeriod4").innerHTML = "4th: " + GetTeacherNameByRoomPeriod(roomnumber, "4th");
		document.getElementById("RLPeriod5").innerHTML = "5th: " + GetTeacherNameByRoomPeriod(roomnumber, "5th");
		document.getElementById("RLPeriod6").innerHTML = "6th: " + GetTeacherNameByRoomPeriod(roomnumber, "6th");
	}
}


//Returns a teacher name for a specified room number and period, or N/A if the room is unoccupied or invalid
function GetTeacherNameByRoomPeriod(room, period) {
	let comparisonNumber = "";
	for (i = 0; i < database.data.length; i++) {
		if (database.data[i][period] != undefined) {
			comparisonNumber = database.data[i][period].replace(/\D/g,'');
			if (comparisonNumber == room) { return database.data[i]["Last Names"]; }
		} else continue;
	}
	return "N/A";
}


//Returns a room number for a specified teacher and period using a database iterator, or N/A if the teacher doesn't have a class.
//TODO Rename this function and above to better reflect function usage
function GetValidRoomInfo(iterator, period) {
	if (database.data[iterator][period] != undefined) {
		return database.data[iterator][period];
	} else return "N/A";
}


//Returns the iterator for a specified room number, and returns an error message along with the iterator if something went wrong
function GetRoomIndex(roomnumber, period, FromTo) {
	let iterator = 0;
	let DBRoomNumber = "";
	let errmsg = null;
	
	if (isNaN(roomnumber)) {
		console.log(FromTo + " room number is NaN");
		errmsg =("Please enter a \"" + FromTo + "\" room number.");
		return {
			"iterator":iterator,
			"errmsg":errmsg,
		};
	}
	
	while (iterator < database.data.length - 1) {

		DBRoomNumber = database.data[iterator][period]; //Set DBRoomNumber to the next .json index
		if (DBRoomNumber == null) { iterator++; continue; } //If the room does not have a class at specified period, continue.
		DBRoomNumber = DBRoomNumber.replace(/\D/g,''); //Remove the wing letter(s) from the resultant database value
		
		if (DBRoomNumber == roomnumber) {
			console.log("DisplayInfoForDirections: Room Data located!");
			break;
		}
		else if (iterator == database.data.length - 2) { //Catches invalid room numbers (late catch for characters, NaN values, and decimals)
			errmsg =("Invalid \"" + FromTo + "\" room number, or room " + roomnumber + " does not have a class at this period.\n");
			break;
		}
		else { iterator++; }
	}
	return {
		"iterator":iterator,
		"errmsg":errmsg,
	};
}


//Checks to see if GetRoomIndex returned an error message, and changes error box visibility respectively
function CheckErrorBoxes(type) {
	if (type == "Directions") {
		if ( document.getElementById("ToErrorLogContent").style.display == "none" && document.getElementById("FromErrorLogContent").style.display == "none") {
			document.getElementById("UserErrorLog").style.display = "none";
		}
		else { document.getElementById("UserErrorLog").style.display = "block"; }
		
		if ( document.getElementById("ToErrorLogContent").style.display != "none" && document.getElementById("FromErrorLogContent").style.display != "none") {
			document.getElementById("ErrorBreak").style.display = "block";
		}
		else { document.getElementById("ErrorBreak").style.display = "none"; }
	}
}


//Switches the visibility of the Utility tabs when each one is clicked
function SwitchTab(ElementID) { //TODO Hide ErrorLog and reset its content when switching tabs
	//If element specified is not already visible
	if (document.getElementById(ElementID + "LookupTab").style.display != "block") {
		
		//Hide all elements based on a class, and the error log
		tabs = document.getElementsByClassName("SelectionTab");
		for (i = 0; i < tabs.length; i++) {
			tabs[i].style.display = "none";
		}
		document.getElementById("UserErrorLog").style.display = "none";
		
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


//Freeware from W3Schools.com. Adds autocomplete functionality to a specified text box based on a database
function AddAutocomplete(inp, arr) {
  /*the autocomplete function takes two arguments,
  the text field element and an array of possible autocompleted values:*/
  var currentFocus;
  /*execute a function when someone writes in the text field:*/
  inp.addEventListener("input", function(e) {
      var a, b, i, val = this.value;
      /*close any already open lists of autocompleted values*/
      closeAllLists();
      if (!val) { return false;}
      currentFocus = -1;
      /*create a DIV element that will contain the items (values):*/
      a = document.createElement("DIV");
      a.setAttribute("id", this.id + "autocomplete-list");
      a.setAttribute("class", "autocomplete-items");
      /*append the DIV element as a child of the autocomplete container:*/
      this.parentNode.appendChild(a);
      /*for each item in the array...*/
      for (i = 0; i < arr.length; i++) {
        /*check if the item starts with the same letters as the text field value:*/
        if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
          /*create a DIV element for each matching element:*/
          b = document.createElement("DIV");
          /*make the matching letters bold:*/
          b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
          b.innerHTML += arr[i].substr(val.length);
          /*insert a input field that will hold the current array item's value:*/
          b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
          /*execute a function when someone clicks on the item value (DIV element):*/
              b.addEventListener("click", function(e) {
              /*insert the value for the autocomplete text field:*/
              inp.value = this.getElementsByTagName("input")[0].value;
              /*close the list of autocompleted values,
              (or any other open lists of autocompleted values:*/
              closeAllLists();
          });
          a.appendChild(b);
        }
      }
  });
  /*execute a function presses a key on the keyboard:*/
  inp.addEventListener("keydown", function(e) {
      var x = document.getElementById(this.id + "autocomplete-list");
      if (x) x = x.getElementsByTagName("div");
      if (e.keyCode == 40) {
        /*If the arrow DOWN key is pressed,
        increase the currentFocus variable:*/
        currentFocus++;
        /*and and make the current item more visible:*/
        addActive(x);
      } else if (e.keyCode == 38) { //up
        /*If the arrow UP key is pressed,
        decrease the currentFocus variable:*/
        currentFocus--;
        /*and and make the current item more visible:*/
        addActive(x);
      } else if (e.keyCode == 13) {
        /*If the ENTER key is pressed, prevent the form from being submitted,*/
        e.preventDefault();
        if (currentFocus > -1) {
          /*and simulate a click on the "active" item:*/
          if (x) x[currentFocus].click();
        }
      }
  });
  function addActive(x) {
    /*a function to classify an item as "active":*/
    if (!x) return false;
    /*start by removing the "active" class on all items:*/
    removeActive(x);
    if (currentFocus >= x.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = (x.length - 1);
    /*add class "autocomplete-active":*/
    x[currentFocus].classList.add("autocomplete-active");
  }
  function removeActive(x) {
    /*a function to remove the "active" class from all autocomplete items:*/
    for (var i = 0; i < x.length; i++) {
      x[i].classList.remove("autocomplete-active");
    }
  }
  function closeAllLists(elmnt) {
    /*close all autocomplete lists in the document,
    except the one passed as an argument:*/
    var x = document.getElementsByClassName("autocomplete-items");
    for (var i = 0; i < x.length; i++) {
      if (elmnt != x[i] && elmnt != inp) {
      x[i].parentNode.removeChild(x[i]);
    }
  }
}
/*execute a function when someone clicks in the document:*/
document.addEventListener("click", function (e) {
    closeAllLists(e.target);
});
} 


//Adds ENTER key functionality to text boxes for smoother user experience
function appendEnterHandlers(itemid) {
	let buttonid = undefined;
	let ele = document.getElementById(itemid);
	
	switch(itemid) {
		case "FromRoomNumber":
		case "ToRoomNumber":
			buttonid = "DirectionsSubmitButton";
		break;
		
		case "TeacherLookupInput":
			buttonid = "TeacherLookupSubmitButton";
		break;
		
		case "RoomLookupInput":
			buttonid = "RoomLookupSubmitButton";
		break;
		
		default:
			console.log(item.id + " does not have an assigned submit button!");
			return false;
		break;
	}
	
	
	ele.addEventListener("keyup", 
	function(event) {
		event.preventDefault();
		// Number 13 is the "Enter" key on the keyboard
		if (event.keyCode === 13) {
			// Trigger the button element with a click
			document.getElementById(buttonid).click();
		}
	}); 
}


//Resizes a canvas element to the size of its parent element
function ResizeCanvas(canvasElement,img, imgOrigin) {
	let ele = document.getElementById(canvasElement);
	let parent = ele.parentElement;
	let ctx = ele.getContext("2d");
	ele.width = parent.clientWidth;
	ele.height = parent.clientHeight;
	ctx.drawImage(
		img, //Image variable
		imgOrigin.x, //X position
		imgOrigin.y, //Y position
		ele.width*MAP_SCALE, //Width
		ele.width*MAP_SCALE //Height
		);
}


// --------------- Seperation Between function definitions and actual scripts ----------------

//Constants Declarations
	//Specifies the percent of the width of the canvas elements that the maps will take up. (0.01 < MAP_SCALE < 1.00)
	var MAP_SCALE = 0.8;
	
//End of Constants Declarations


//Initialize database that will hold .json data such as room numbers, teachers, and class periods.
var database = {
    data:undefined, //Holds teacher info (which room they're in throughout the day)
	RNdata:undefined, //Holds room coordinate information
	Halldata:undefined, //Holds hallway coordinate information
	teachernames: [], //This array is used exclusively as an input for autocomplete
	
	//Initializes the teachernames array on file load
	FillTeacherNames: function() {
		for (i = 0; i < this.data.length; i++) {
			this.teachernames.push(this.data[i]["Last Names"] + ", " + this.data[i]["First Names"]);
		}
	}
}


//Will eventually be the main object that holds all directions data and information to draw directions to the canvas
var directionsData = {
	toRoom:undefined,
	fromRoom:undefined,
	imgSize:undefined,
	
	linesToDraw:[], //Will specify which lines are being drawn on the canvas
	
	
	StartPathfinding : function() {
		this.fromRoom = document.getElementById("FromRoomNumber").value;
		this.toRoom = document.getElementById("ToRoomNumber").value;
		this.ClearPaths();
		this.AddNewPath(this.fromRoom, this.toRoom);
	},
	
	
	//TODO Add actual errors to be thrown, then throw them and catch them in the containing function
	calculateEntryLine: function(room) {
		//Get coordinates of room in percentage
		//try { database.RNdata[room]["RoomX"]; }
		//catch { console.log("Room " + room + " is an invalid room number."); return false; }
		//Revert coordinates of room to pixel coordinates
		let point = [database.RNdata[room]["RoomX"], database.RNdata[room]["RoomY"]];
		point[0] = parseFloat(point[0])*this.imgSize;
		point[1] = parseFloat(point[1])*this.imgSize;
		
		//Create a line that has a length = 5% of imgSize in the direction of ExitDirection
		let intersectLine = undefined;
		switch(database.RNdata[room]["ExitDirection"]) {
			case "Up":
				intersectLine = [point[0], point[1], point[0], point[1] - this.imgSize*0.1];
				break;
			
			case "Right":
				intersectLine = [point[0], point[1], point[0] + this.imgSize*0.1, point[1]];
				break;
			
			case "Down":
				intersectLine = [point[0], point[1], point[0], point[1] + this.imgSize*0.1];
				break;
				
			case "Left":
				intersectLine = [point[0], point[1], point[0] - this.imgSize*0.1, point[1]];
				break;
			
			default:
				console.log("Exit Direction undefined!");
				return false;
				break;
		}
		
		
		//Loop to find which hallway line is being intersected and get intersection point
		for (var i = 0; i < database.Halldata.length; i++) {
			//For each hallway, set up this object, which holds coordinates in pixel measurements
			let objectCoords = {"X1":undefined, "Y1":undefined, "X2":undefined, "Y2":undefined};
			
			objectCoords["X1"] = parseFloat(database.Halldata[i]["X1"])*this.imgSize;
			objectCoords["Y1"] = parseFloat(database.Halldata[i]["Y1"])*this.imgSize;
			objectCoords["X2"] = parseFloat(database.Halldata[i]["X2"])*this.imgSize;
			objectCoords["Y2"] = parseFloat(database.Halldata[i]["Y2"])*this.imgSize;
			
			//intersectPoint will be:
			//If the line intersects: an object in the form of {"x": pixel coordinate, "y": pixel coordinate}
			//Else: false
			let intersectPoint = this.getIntersect(
			intersectLine[0], intersectLine[1],
			intersectLine[2], intersectLine[3],
			objectCoords["X1"], objectCoords["Y1"],
			objectCoords["X2"], objectCoords["Y2"]);
			
			//If the intersectPoint is not false, the intersect has been found
			if (intersectPoint) {
				//Return the line that spans from the room coordinate to the intersect coordinate, but in percentage coordinates
				return {
					"X1": point[0]/this.imgSize,
					"Y1": point[1]/this.imgSize,
					"X2": intersectPoint["x"]/this.imgSize,
					"Y2": intersectPoint["y"]/this.imgSize
					};
			}
		}
		//If the line has not intersected a hallway line, something has gone wrong on the script side.
		console.log("Entry Line for room " + room + " could not be found.");
		return false;
	},
	
	
	getIntersect: function intersect(x1, y1, x2, y2, x3, y3, x4, y4) {
		// Check if none of the lines are of length 0
		if ((x1 === x2 && y1 === y2) || (x3 === x4 && y3 === y4)) {
			return false; //I never liked geometry
		}

		denominator = ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1));

		// Lines are parallel
		if (denominator === 0) {
			return false; //Geometry is the worst
		}

		let ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denominator;
		let ub = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / denominator;
		//Good luck trying to figure out what that did.

		// is the intersection along the segments
		if (ua < 0 || ua > 1 || ub < 0 || ub > 1) {
			//They say good code is self-documenting. This is not good code. It is efficient. glhf.
			return false;
		}

		// Return an object with the x and y coordinates of the intersection
		let x = x1 + ua * (x2 - x1);
		let y = y1 + ua * (y2 - y1);
		//More magic maths

		return {x, y};
	},
	
	
	AddNewPath: function(roomA, roomB) {
		//Convert room number strings into percentage coordinates
		//Still don't know if we need these lines, I'm keeping them cuz they're tedious to type.
		//let pointA = [database.RNdata[roomA]["RoomX"], database.RNdata[roomA]["RoomY"]];
		//let pointB = [database.RNdata[roomB]["RoomX"], database.RNdata[roomB]["RoomY"]];
		
		//Calculate the line to be from the point coordinate to the intersect coordinate
		//TODO Handle when the calculateEntryLine function returns false
		let intersectLineA = this.calculateEntryLine(roomA);
		let intersectLineB = this.calculateEntryLine(roomB);
		
        //Add the resultant lines to the directionsData["linesToDraw"]
		this.linesToDraw.push(intersectLineA);
		this.linesToDraw.push(intersectLineB);

		//---- At this point, there should be two line segments drawn into the hallway, from room A and from room B.

		//Starting with the hallway line that pointA intersects:
		
		//If the two rooms share the same hallway line
			//Just draw a line to the two intersect points, add to directionsData["linesToDraw"]
		//Else, See which endpoint of the line is closer to pointB's hallway line endpoints
		//Add the shortest line (between intersect and hallway end) to the directionsData["linesToDraw"]
		//Repeat (?)
	},
	
	
	DrawDirections: function(canvasElement, img, imgOrigin) {
		let ele = document.getElementById(canvasElement);
		let ctx = ele.getContext("2d");
		let imgSize = ele.width*MAP_SCALE;
		this.imgSize = imgSize
		
		//Draws a red box on the "from" room
		ctx.fillStyle = 'red';
		if (this.fromRoom != undefined) {
			try {
				ctx.fillRect((imgOrigin.x + database.RNdata[this.fromRoom]["RoomX"]*this.imgSize), (imgOrigin.y + database.RNdata[this.fromRoom]["RoomY"]*this.imgSize), 6, 6);
			}
			catch(err) {
				console.log(err.message);
			}
		}
		
		//Draws a green box on the "to" room
		ctx.fillStyle = 'green';
		if (this.toRoom != undefined) {
			try {
				ctx.fillRect(imgOrigin.x + database.RNdata[this.toRoom]["RoomX"]*this.imgSize, imgOrigin.y + database.RNdata[this.toRoom]["RoomY"]*this.imgSize, 6, 6);
			}
			catch(err) {
				console.log(err.message);
			}
		}
		
		ctx.lineWidth = 3;
		ctx.strokeStyle="#FF8000";
		ctx.beginPath();
		//For each line in directionsData.linesToDraw
		for (var i = 0; i < this.linesToDraw.length; i++) {
			//Add the line to the path
			ctx.moveTo(imgOrigin.x + this.linesToDraw[i]["X1"]*this.imgSize, imgOrigin.y + this.linesToDraw[i]["Y1"]*this.imgSize);
			ctx.lineTo(imgOrigin.x + this.linesToDraw[i]["X2"]*this.imgSize, imgOrigin.y + this.linesToDraw[i]["Y2"]*this.imgSize);
		}
		//Draw the path
		ctx.stroke();
	},
	
	ClearPaths: function() { this.linesToDraw = []; },
	
	//Setters
	setToRoom: function(RN) { this.toRoom = RN; },
	setFromRoom: function(RN) { this.fromRoom = RN; },
	setFromToRoomsFromInput: function() {
		this.fromRoom = document.getElementById("FromRoomNumber").value;
		this.toRoom = document.getElementById("ToRoomNumber").value;
	}
}

//Asynchronously read the database file then return the result to the database object.
readTextFile("Scripts/ExtensionGrid.json", function(text){
	let data = JSON.parse(text);
	database["data"] = data;
	database.FillTeacherNames();
	AddAutocomplete(document.getElementById("TeacherLookupInput"), database.teachernames);
	
	//Assign event handlers to each Text Input Box to submit inputs on an ENTER keypress
	//This section should be moved to the window.onload function
	let InputBoxList = document.getElementsByClassName("TextInputBox");

	appendEnterHandlers(InputBoxList.ToRoomNumber.id);
	appendEnterHandlers(InputBoxList.FromRoomNumber.id);
	appendEnterHandlers(InputBoxList.TeacherLookupInput.id);
	appendEnterHandlers(InputBoxList.RoomLookupInput.id);
}); 

readTextFile("Scripts/RoomCoordinates.json", function(text){
	let data = JSON.parse(text);
	database["RNdata"] = data;
});

readTextFile("Scripts/HallwayCoordinates.json", function(text){
	let data = JSON.parse(text);
	database["Halldata"] = data;
});


//When the page loads, do this:
window.onload = function() {
    var canvas = document.getElementById("Map1Canvas");
    var ctx = canvas.getContext("2d");
	ctx.boxSizing = "border-box";
		
    var img = new Image;
	img.src = 'Images/1stFloorMap.png'
	
    img.onload = function() {
		ctx.imageSmoothingEnabled = false;
		
		window.setInterval(function() {
			let imgOrigin = {
				x: canvas.width / 2 - (canvas.width*MAP_SCALE) / 2,
				y: canvas.height / 2 - (canvas.width*MAP_SCALE) / 2
			}
			
			ResizeCanvas("Map1Canvas", img, imgOrigin);
			ResizeCanvas("Map2Canvas", img, imgOrigin);
			directionsData.DrawDirections("Map1Canvas", img, imgOrigin);
			directionsData.DrawDirections("Map2Canvas", img, imgOrigin);
		}, 250);
	};	
}; 


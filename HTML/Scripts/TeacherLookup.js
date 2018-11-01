

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


function DisplayInfoByRN(FromTo){ //TODO Handle room numbers that have letters in them, and add band, gym, and library compatibility.
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


function DisplayInfoByTeacher() {
	let namestring = document.getElementById("TeacherNameInput").value;
	namestring = namestring.split(", "); // ["Last Name", "First Name]
	let iterator = 0;
	while (iterator < database.data.length - 1) {
		//If the specified teacher object is found
		if (database.data[iterator]["Last Names"] == namestring[0] && database.data[iterator]["First Names"] == namestring[1]) {
			//Display teacher name
			document.getElementById("TLDisplayName").innerHTML = document.getElementById("TeacherNameInput").value;
			
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


function GetValidRoomInfo(iterator, period) {
	if (database.data[iterator][period] != undefined) {
		return database.data[iterator][period];
	} else return "N/A";
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
			console.log("DisplayInfoByRN: Room Data located!");
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


// --------------- Seperation Between function definitions and actual scripts ----------------

var database = {
    data:undefined,
	teachernames: [],
	
	FillTeacherNames: function() {
		for (i = 0; i < this.data.length; i++) {
			this.teachernames.push(this.data[i]["Last Names"] + ", " + this.data[i]["First Names"]);
		}
	}
}

readTextFile("Scripts/ExtensionGrid.json", function(text){
	var data = JSON.parse(text);
	database["data"] = data;
	database.FillTeacherNames();
	AddAutocomplete(document.getElementById("TeacherNameInput"), database.teachernames);
}); 

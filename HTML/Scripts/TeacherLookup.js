function loadFile(filePath) {
  var result = null;
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.open("GET", filePath, false);
  xmlhttp.send();
  if (xmlhttp.status==200) {
    result = xmlhttp.responseText;
  }
  return result;
}



function GetInfoByRN(){

	var data = loadFile("file://ExtensionGrid.json");
	
	document.getElementById("ToRoomRNumber").innerHTML = data[0]["Last Names"];
	document.getElementById("ToRoomTeacher").innerHTML = "Paragraph changed.";
	document.getElementById("ToRoomWebsite").innerHTML = "Paragraph changed.";
	document.getElementById("ToRoomEmail").innerHTML = "Paragraph changed.";
	
}

function GetInfoByTeacher() {
   document.getElementById("demo").innerHTML = "Paragraph changed.";
}
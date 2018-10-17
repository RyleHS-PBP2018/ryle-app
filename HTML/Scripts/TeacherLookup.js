

function GetInfoByRN(data){	
	
	document.getElementById("ToRoomRNumber").innerHTML = data[0]["Last Names"];
	document.getElementById("ToRoomTeacher").innerHTML = "Paragraph changed.";
	document.getElementById("ToRoomWebsite").innerHTML = "Paragraph changed.";
	document.getElementById("ToRoomEmail").innerHTML = "Paragraph changed.";
	
}

function GetInfoByTeacher() {
   document.getElementById("demo").innerHTML = "Paragraph changed.";
}
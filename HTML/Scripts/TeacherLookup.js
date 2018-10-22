

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


function GetInfoByRN(arr){
	//document.getElementById("ToRoomRNumber").innerHTML = arr[0]["Last Names"];
	document.getElementById("ToRoomTeacher").innerHTML = "Paragraph changed.";
	document.getElementById("ToRoomWebsite").innerHTML = "Paragraph changed.";
	document.getElementById("ToRoomEmail").innerHTML = "Paragraph changed.";
	
}

function GetInfoByTeacher() {
   document.getElementById("demo").innerHTML = "Paragraph changed.";
}

<!DOCTYPE html>

<html>
	<head>
        <title>Ryle Maps</title>
		<meta charset="UTF-8"> 
		<link rel="shortcut icon" href="Images/Ryle Crest.jpeg"/>
		<link rel= "stylesheet" type= "text/css" href="Styles/Style.css"/>
	
		<script src="Scripts/TeacherLookup.js"></script>
		
		<?php
			echo '<script>';
			echo 'var data =' . json_encode(file_get_contents("Scripts/ExtensionGrid.json")) . ';'; 
			echo 'console.log(data);';
			echo '</script>';
		?>
		
		
	</head>
	
	<body style="background-color: #011627;">
		
		<div style="width: 1280px; height: 768px; border: 1px solid black; background-color: #2a2b2a;" align="center">
		
			<div class="bordered-div" style="height: 100%; width: 250px; float: left; margin-left: 20px; background-color: #ff8000;">
			
				<div align="center" style="box-sizing: border-box; width:250px; height: 135px; background-image: url(Images/RHSAerial.jpg); background-size: 100% 135px; background-repeat: no-repeat; pointer-events: none;">
					<p id="this" style="font-family: Athletic; font-size: 250%; color: #ff9900; margin: 0px; padding: 40px 0px;">Ryle Maps</p>
				</div>
				
				
				
				<div class="sidebar" style="padding: 5px;">
					<form>
					From Room:
					<input id="FromRoomForm" type="text" size="10" maxlength="4" placeholder="101"/>
					<br/>
					To Room:
					<input id="ToRoomForm" type="text" size="10" maxlength="4" placeholder="102"/>
					<img src="Images/TooltipQuestionMark.png" height="20" width="20" style="vertical-align: text-bottom;"
					title="Room numbers such as Room 116-A should be entered as 116a or 116A"/>
					
					<button type="button" onclick="GetInfoByRN(data)">Submit</button>
					</form>
				</div>
		
				<div id="ToRoomInfo" class="sidebar" style="text-align: center;">
					<p id="ToRoomRNumber">Room 101</p>
					<p id="ToRoomTeacher">Mrs.Stropko</p>
					
					<a id="ToRoomWebsite" href="https://www.boone.kyschools.us/olc/872">Teacher Website</a><br/>
					<a id="ToRoomEmail" href="mailto:jennifer.stropko@boone.kyschools.us">Teacher Email</a>
				</div>
				
				
				<div id="FromRoomInfo" class="sidebar" style="text-align: center;">
					<p id="FromRoomRNumber">Room 101</p>
					<p id="FromRoomTeacher">Mrs.Stropko</p>
					
					<a id="FromRoomWebsite" href="https://www.boone.kyschools.us/olc/872">Teacher Website</a><br/>
					<a id="FromRoomEmail" href="mailto:jennifer.stropko@boone.kyschools.us">Teacher Email</a>
				</div>
				
			</div>
			
			<div class="bordered-div" style="float: left; width: 1010px; height: 100%; padding: 0px;">
				<div class="bordered-div" style="margin: 0px auto; height: 384px; width: 1030px;" align="center">
					<img src="Images/Temp1stFloor.jpg" height="384px" width="682px">
				</div>
				<div class="bordered-div" style="margin: 0px auto; height: 384px; width: 1030px;" align="center">
					<img src="Images/Temp1stFloor.jpg" height="384px" width="682px">
				</div>
			</div>
		</div>
	</body>
</html>
function openGrade(evt, gradeName) {
  // Declare all variables
  var i, tabcontent, tablinks;

  // Get all elements with class="tabcontent" and hide them
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }

  // Get all elements with class="tablinks" and remove the class "active"
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }

  // Show the current tab, and add an "active" class to the button that opened the tab
  document.getElementById(gradeName).style.display = "block";
  evt.currentTarget.className += " active";
}

function openLinksIC()
{
  window.open("https://kyede13.infinitecampus.org/campus/portal/boone.jsp");
}

function openLinksCanvas()
{
  window.open("https://boone.instructure.com/login/saml")
}

function openLinksOffice()
{
  window.open("https://www.office.com/?auth=2")
}
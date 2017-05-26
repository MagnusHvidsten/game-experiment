// JavaScript file for project
var MyGame = {
  upgrades: {
    technicians: 0
  }
}
var pattyCount;

var pattyClick = function() {
  pattyCount++;
  document.getElementsByClassName('pattyCount')[0].innerHTML = document.cookie;
}

var resetGame = function() {
  pattyCount = 0;
  MyGame.upgrades.technicians = 0;
  document.getElementsByClassName('pattyCount')[0].innerHTML = pattyCount;
}

var setValuesFromCookie = function() {
  if(document.cookie.length < 1) {
    pattyCount = 0;
  } else {
    pattyCount = parseInt(document.cookie);
  }
  document.getElementsByClassName('pattyCount')[0].innerHTML = pattyCount;
}

var addTechnician = function() {
  if(pattyCount >= 50) {
    MyGame.upgrades.technicians++;
    pattyCount = pattyCount - 50;
    document.getElementsByClassName('pattyCount')[0].innerHTML = pattyCount;
  }
}

var setEventListeners = function() {
  //reset 
  var resetButton = document.getElementById('resetGame');
  resetButton.addEventListener("click", resetGame, false);

  //purchase technician 
  var resetButton = document.getElementById('addTechnician');
  resetButton.addEventListener("click", addTechnician, false);
  
}

var autoPattyInterval = window.setInterval(autoPatty, 500);

function autoPatty() {
  for(var i = 0; i < MyGame.upgrades.technicians; i++) {
    pattyCount++;
  }
    document.getElementsByClassName('pattyCount')[0].innerHTML = pattyCount;
}

//ensure cookies, event listeners and such are setup on pageload
var onPageLoad = function () {
  setValuesFromCookie();
  setEventListeners();
}
onPageLoad();

var update = function() {
  document.cookie = pattyCount;
}


function mainLoop() {
    update();
    //draw();
    requestAnimationFrame(mainLoop);
}
// Start things off
requestAnimationFrame(mainLoop);
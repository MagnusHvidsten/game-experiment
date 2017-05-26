// JavaScript file for project

// Global constants
const technicianCost = 50;

// Global variables
var upgradeTechnician = 0;

// Game variable
var MyGame = {
  saved: 0,
  pattyCount: 0,
  upgrades: {
    technicians: {
      technicianArray: [],
      level: 1,
      techInterval: 1000
    }
  }
}

var pattyCount;

var pattyClick = function() {
  pattyCount++;
  document.getElementsByClassName('pattyCount')[0].innerHTML = pattyCount;
}

var resetGame = function() {
  pattyCount = 0;
  //clear all auto patty intervals
  MyGame.upgrades.technicians.technicianArray.forEach(function(interval) {
    clearInterval(interval);
  });
  MyGame.upgrades.technicians.technicianArray = [];
  MyGame.upgrades.technicians.level = 1;
  document.getElementsByClassName('pattyCount')[0].innerHTML = pattyCount;
}

var setValuesFromCookie = function() {
  if(document.cookie === "") {
    pattyCount = 0;
  } else {
    MyGame = JSON.parse(document.cookie);
    pattyCount = MyGame.pattyCount;
    //start auto patty generation again
    techArrLength = MyGame.upgrades.technicians.technicianArray.length;
    MyGame.upgrades.technicians.technicianArray = [];
    techLevel = MyGame.upgrades.technicians.level;
    techInterval = MyGame.upgrades.technicians.techInterval;
    for(var i = 0; i < techArrLength; i++) {
      MyGame.upgrades.technicians.technicianArray.push(window.setInterval(function(){autoPatty(techLevel)}, techInterval));
    }
  }
  document.getElementsByClassName('pattyCount')[0].innerHTML = pattyCount;
}

var addTechnician = function() {
  if(pattyCount >= technicianCost) {
    pattyCount = pattyCount - technicianCost;
    //update the remaining patties the user sees immediately
    document.getElementsByClassName('pattyCount')[0].innerHTML = pattyCount;
    //add technician to MyGame 
    techLevel = MyGame.upgrades.technicians.level;
    techInterval = MyGame.upgrades.technicians.techInterval;
    MyGame.upgrades.technicians.technicianArray.push(window.setInterval(function(){autoPatty(techLevel)}, techInterval));
  }
}

var upgradeTechnician = function() {
  //set global variable to inform on upgrade next time interval is executed
  var upgradeTechnician = MyGame.upgrades.technicians.technicianArray.length;
  // double the tech level
  MyGame.upgrades.technicians.level *= 2;
}

var setEventListeners = function() {
  //reset 
  var resetButton = document.getElementById('resetGame');
  resetButton.addEventListener("click", resetGame, false);

  //purchase technician 
  var resetButton = document.getElementById('addTechnician');
  resetButton.addEventListener("click", addTechnician, false);

  //upgrade technician
  var resetButton = document.getElementById('upgradeTechnician');
  resetButton.addEventListener("click", upgradeTechnician, false);
  
}

// adds automatic patties from upgrades. Called from intervals
function autoPatty(amountToAdd) {
  // upgrade intervals if purchased
  // done in autoPatty to maintain the pattern of intervals so they all don't 
  // occur at the same time
  if(upgradeTechnician > 0) {
    techArr = MyGame.upgrades.technicians.technicianArray;
    //clear interval
    clearInterval(techArr[upgradeTechnician]);
    //remove from array
    techArr.splice(upgradeTechnician, 1);
    upgradeTechnician--;
    //create new interval with upgraded techLevel
    techLevel = MyGame.upgrades.technicians.level;
    techInterval = MyGame.upgrades.technicians.techInterval;
    techArr.push(window.setInterval(function(){autoPatty(techLevel)}, techInterval));

  }
  pattyCount = pattyCount + amountToAdd;
  document.getElementsByClassName('pattyCount')[0].innerHTML = pattyCount;
}

//ensure cookies, event listeners and such are setup on pageload
var onPageLoad = function () {
  setValuesFromCookie();
  setEventListeners();
}
onPageLoad();

var update = function() {
  MyGame.pattyCount = pattyCount;
  MyGame.saved = 1;
  document.cookie = JSON.stringify(MyGame);
}


function mainLoop() {
    update();
    //draw();
    requestAnimationFrame(mainLoop);
}
// Start things off
requestAnimationFrame(mainLoop);
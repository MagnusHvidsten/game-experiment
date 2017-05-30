// JavaScript file for project

// Global constants
const technicianCost = 50;
const technicianInterval = 1000;

// Global variables
var upgradeTechnicianCount = 0;
var technicianUpgradeCost = 1000;

// Game variable
var MyGame = {
  saved: 0,
  pattyCount: 0,
  upgrades: {
    technicians: {
      technicianArray: [],
      level: 1,
      prodRate: 1,
      techInterval: 1000,
      technicianUpgradeCost: 1000
    }
  }
}

var pattyCount;

var pattyClick = function() {
  pattyCount++;
  document.getElementsByClassName('pattyCount')[0].innerHTML = pattyCount;
}

var resetGame = function() {
  var techObj = MyGame.upgrades.technicians;
  pattyCount = 0;
  upgradeTechnicianCount = 0;
  technicianUpgradeCost = 1000;
  //clear all intervals
  techObj.technicianArray.forEach(function(interval) {
    clearInterval(interval);
  });
  techObj.technicianArray = [];
  techObj.level = 1;
  techObj.prodRate = 1;
  techObj.technicianUpgradeCost = 1000;
  document.getElementsByClassName('pattyCount')[0].innerHTML = pattyCount;
  document.getElementById("technicianUpgradeCost").innerHTML = technicianUpgradeCost/1000;
}

var setValuesFromCookie = function() {
  if(document.cookie === "") {
    pattyCount = 0;
  } else {
    MyGame = JSON.parse(document.cookie);
    pattyCount = MyGame.pattyCount;
    technicianUpgradeCost = MyGame.upgrades.technicians.technicianUpgradeCost;
    //start auto patty generation again
    var techObj = MyGame.upgrades.technicians;
    var techArrLength = techObj.technicianArray.length;
    techObj.technicianArray = [];
    var amount = techObj.prodRate;
    var techInterval = techObj.techInterval;
    for(var i = 0; i < techArrLength; i++) {
      techObj.technicianArray.push(window.setInterval(function(){autoPatty(amount)}, techInterval));
    }
    syncAutoCount();
  }
  document.getElementsByClassName('pattyCount')[0].innerHTML = pattyCount;
  document.getElementById("technicianUpgradeCost").innerHTML = technicianUpgradeCost/1000;
}

var syncAutoCount = function() {
  var techObj = MyGame.upgrades.technicians;
  var numbOfTechs = techObj.technicianArray.length;
  var amount = techObj.prodRate;
  var techInterval = techObj.techInterval;
  techObj.technicianArray.forEach(function(el) {
    clearInterval(el);
  });
  techObj.technicianArray = [];
  
  for(var i = 0; i < numbOfTechs; i++) {
    window.setTimeout(function() {
      techObj.technicianArray.push(window.setInterval(function(){autoPatty(amount)}, techInterval));
    }, technicianInterval/numbOfTechs*i);
  }
}

var addTechnician = function() {
  if(pattyCount >= technicianCost) {
    pattyCount = pattyCount - technicianCost;
    //update the remaining patties the user sees immediately
    document.getElementsByClassName('pattyCount')[0].innerHTML = pattyCount;
    //add technician to MyGame 
    var techObj = MyGame.upgrades.technicians;
    var amount = techObj.prodRate;
    var techInterval = techObj.techInterval;
    techObj.technicianArray.push(window.setInterval(function(){autoPatty(amount)}, techInterval));
    syncAutoCount();
  }
}

var upgradeTechnician = function() {
  if(pattyCount > technicianUpgradeCost) {
    // set global variable to inform on upgrade next time interval is executed
    var techObj = MyGame.upgrades.technicians;
    upgradeTechnicianCount = techObj.technicianArray.length;
    // double the tech level
    techObj.level += 1;
    techObj.prodRate *= 2;
    // deduct cost
    pattyCount -= technicianUpgradeCost;
    // increse cost
    var cost = Math.ceil(5*Math.pow(techObj.level, 1.2));
    technicianUpgradeCost = cost;
    techObj.technicianUpgradeCost = cost*1000;
    document.getElementById("technicianUpgradeCost").innerHTML = cost;
    syncAutoCount();
  }
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
  if(upgradeTechnicianCount > 0) {
    // reference variable
    techObj = MyGame.upgrades.technicians;
    //clear interval
    clearInterval(techObj.technicianArray[upgradeTechnicianCount - 1]);
    //remove from array
    techObj.technicianArray.splice(upgradeTechnicianCount - 1, 1);
    upgradeTechnicianCount--;
    //create new interval with upgraded techLevel
    prodRate = techObj.prodRate;
    techInterval = techObj.techInterval;
    techObj.technicianArray.push(window.setInterval(function(){autoPatty(prodRate)}, techInterval));
    syncAutoCount();

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
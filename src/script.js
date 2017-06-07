// JavaScript file for project

// Global constants
const INTERVAL = 1000;

// Global variables
var upgradeTechnicianCount = 0;

// Game variable
var MyGame = {
  saved: 0,
  pattyCount: 0,
  upgrades: {
    cursor: {
      upgradeCursorCost: 15,
      cursorClickValue: 1
    },
    technicians: {
      technicianArray: [],
      level: 1,
      prodRate: 1,
      techInterval: 1000,
      technicianCost: 50,
      technicianUpgradeCost: 1000
    }
  }
}

var pattyClick = function() {
  MyGame.pattyCount += MyGame.upgrades.cursor.cursorClickValue;
  document.getElementsByClassName('pattyCount')[0].innerHTML = MyGame.pattyCount;
}

var resetGame = function() {
  MyGame.pattyCount = 0;
  //technicians
  var techObj = MyGame.upgrades.technicians;
  upgradeTechnicianCount = 0;
  //clear all intervals
  techObj.technicianArray.forEach(function(interval) {
    clearInterval(interval);
  });
  techObj.technicianArray = [];
  techObj.level = 1;
  techObj.prodRate = 1;
  techObj.technicianUpgradeCost = 1000;
  techObj.technicianCost = 50;
  //cursor
  var cursObj = MyGame.upgrades.cursor;
  cursObj.cursorClickValue = 1;
  cursObj.upgradeCursorCost = 15;
  
  document.getElementsByClassName('pattyCount')[0].innerHTML = MyGame.pattyCount;
  document.getElementById("technicianUpgradeCost").innerHTML = techObj.technicianUpgradeCost;
  document.getElementById('cursorUpgradeCost').innerHTML = cursObj.upgradeCursorCost;
  document.getElementById('technicianCost').innerHTML = techObj.technicianCost;
}

var setValuesFromCookie = function() {
  if(document.cookie !== "") {
    MyGame = JSON.parse(document.cookie);
    //start auto patty generation again
    var techObj = MyGame.upgrades.technicians;
    var techArrLength = techObj.technicianArray.length;
    techObj.technicianArray = [];
    var techInterval = techObj.techInterval;
    for(var i = 0; i < techArrLength; i++) {
      techObj.technicianArray.push(window.setInterval(function(){autoPatty(techObj.prodRate)}, techInterval));
    }
    syncAutoCount();
  }
  var cursObj = MyGame.upgrades.cursor;
  document.getElementsByClassName('pattyCount')[0].innerHTML = MyGame.pattyCount;
  document.getElementById("technicianUpgradeCost").innerHTML = techObj.technicianUpgradeCost;
  document.getElementById("cursorUpgradeCost").innerHTML = cursObj.upgradeCursorCost;
}

var syncAutoCount = function() {
  var techObj = MyGame.upgrades.technicians;
  var numbOfTechs = techObj.technicianArray.length;
  var amount = techObj.prodRate;
  var techInterval = techObj.techInterval;
  var placeHolderTechnicianArray = techObj.technicianArray;
  techObj.technicianArray = [];

  for(var i = 0; i < numbOfTechs; i++) {
    window.setTimeout(function() {
      techObj.technicianArray.push(window.setInterval(function(){autoPatty(amount)}, techInterval));
    }, INTERVAL/numbOfTechs*i);
    //only stop old invervals after new has been created to not create a gap in production
    window.setTimeout(function() {
      placeHolderTechnicianArray.forEach(function(el) {
        clearInterval(el);
      });
    }, INTERVAL);
  }
}

var addTechnician = function() {
  var techObj = MyGame.upgrades.technicians;
  if(MyGame.pattyCount >= techObj.technicianCost) {

    //update the remaining patties the user sees immediately
    MyGame.pattyCount -= techObj.technicianCost;
    document.getElementsByClassName('pattyCount')[0].innerHTML = MyGame.pattyCount;

    //increase cost
    techObj.technicianCost = Math.ceil(techObj.technicianCost*1.5);
    document.getElementById('technicianCost').innerHTML = techObj.technicianCost;

    //add technician to MyGame 
    var amount = techObj.prodRate;
    var techInterval = techObj.techInterval;
    techObj.technicianArray.push(window.setInterval(function(){autoPatty(amount)}, techInterval));
    syncAutoCount();
  }
}

var upgradeTechnician = function() {
  var techObj = MyGame.upgrades.technicians;
  if(MyGame.pattyCount >= techObj.technicianUpgradeCost) {
    // set global variable to inform on upgrade next time interval is executed
    upgradeTechnicianCount = techObj.technicianArray.length;
    // double the tech level
    techObj.level += 1;
    techObj.prodRate *= 2;
    // deduct cost
    MyGame.pattyCount -= techObj.technicianUpgradeCost;
    // increase cost
    techObj.technicianUpgradeCost = Math.ceil(techObj.technicianUpgradeCost*1.5);
    document.getElementById("technicianUpgradeCost").innerHTML = techObj.technicianUpgradeCost;
    syncAutoCount();
  }
}

var upgradeCursor = function() {
  var cursObj = MyGame.upgrades.cursor
  if(MyGame.pattyCount >= cursObj.upgradeCursorCost) {
    //deduct cost
    MyGame.pattyCount -= cursObj.upgradeCursorCost;
    //double the effect by clicking on patty
    cursObj.cursorClickValue *= 2;
    //raise the cost of upgrade
    cursObj.upgradeCursorCost = Math.ceil(cursObj.upgradeCursorCost*1.5);
    //update UI
    document.getElementById("cursorUpgradeCost").innerHTML = cursObj.upgradeCursorCost;
    document.getElementsByClassName('pattyCount')[0].innerHTML = MyGame.pattyCount;
  }
}

var setEventListeners = function() {
  //reset 
  document.getElementById('resetGame').addEventListener("click", resetGame, false);

  //upgrade cursor
  document.getElementById('upgradeCursor').addEventListener("click", upgradeCursor, false);

  //purchase technician 
  document.getElementById('addTechnician').addEventListener("click", addTechnician, false);

  //upgrade technician
  document.getElementById('upgradeTechnician').addEventListener("click", upgradeTechnician, false);
  
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
  MyGame.pattyCount += amountToAdd;
  document.getElementsByClassName('pattyCount')[0].innerHTML = MyGame.pattyCount;
}

//ensure cookies, event listeners and such are setup on pageload
var onPageLoad = function () {
  setValuesFromCookie();
  setEventListeners();
}
onPageLoad();

var update = function() {
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
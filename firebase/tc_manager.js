MODULENAME = "tc_manager.js";
console.log('%c' + MODULENAME + ': ', 'color: blue;');

/*dbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdb*/
// database variables
const DETAILS = "userDetails";      //<=============== INSERT YOUR FIREBASE PATH NAME HERE

var loginStatus = ' ';
var readStatus  = ' ';
var writeStatus = ' ';

var userDetails = {
  uid:      '',
  email:    '',
  name:     '',
  photoURL: '',
  flappyBird: ''
};

var highScore = {
  name: '',
  recentScore: '',
  highScore: '',
  uid: ''
}

var dbArray = [];
/*dbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdb*/

/**************************************************************/
// tc_createBtns(_x, _y)
// Called by setup
// Create buttons starting at position _x, _y
// Input:  x & y co-ords of 1st element
/**************************************************************/
function tc_createBtns(_x, _y) {  
  console.log("%ctc_createBtns: x = " + _x + ",  y = " + _y, 'color: brown;');
    
  const BTNCOL   = 'rgb(0, 204, 0)';
  const BTNW     = 100;
  const BTNH     = 70;
  const GAP      = 15;
  const FONTSIZE = '18px';

  // create leaderBoard button
  btnReadAll = createButton('read LB');
  btnReadAll.position(_x + 120, _y);
  btnReadAll.size(BTNW, BTNH);
  btnReadAll.style('background-color', color(BTNCOL));
  btnReadAll.style('font-size', FONTSIZE);
  btnReadAll.mousePressed(tc_lB);
  
  // create LOGIN button
  btnLogin = createButton('login');
  btnLogin.position(_x, _y);
  btnLogin.size(BTNW, BTNH);
  btnLogin.style('background-color', color(BTNCOL));
  btnLogin.style('font-size', FONTSIZE);
  btnLogin.mousePressed(tc_login);
}

/**************************************************************/
// tc_login()
// Input event; called when user clicks LOGIN button
// Logs user into firebase using Google login
// Input:
// Return:
/**************************************************************/
function tc_login() {
  console.log('%ctc_login: ', 'color: brown;');
  
  fb_login(userDetails, highScore);
}

/**************************************************************/
// tc_upload()
// Input event; called when user clicks WRITE A RECORD button
// Write a record to firebase
// Input:
// Return:
/**************************************************************/
function tc_upload(_score) {
  console.log('%ctc_upload: ', 'color: brown;');
  
  if (userDetails.uid != '') {
    highScore.recentScore = _score;
    
    // CALL YOUR WRITE A RECORD FUNCTION    <=================
    
    fb_upload(DETAILS, userDetails.uid, userDetails, highScore.recentScore);
  }
  else {
    dbScore     = '';
    writeStatus = '';
    loginStatus = 'not logged in';
  }
}

/**************************************************************/
// tc_lB()
// Input event; called at setup
// Read all flappy Bird scores
// Input:
// Return:
/**************************************************************/
function tc_lB() {
  console.log('%ctc_readAll: ', 'color: brown;');
  
  // CALL YOUR READ ALL FUNCTION        <=================
  fb_lB(DETAILS, dbArray);
}
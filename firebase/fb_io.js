/**************************************************************/
// fb_io.js
// Skeleton written by ???   2023
// v1 firebase DB testing write AND read to firebase
// v2 add Google login
// v2 use pop up for login
// v3 add console.logs
/**************************************************************/
MODULENAME = "fb_io.js";
console.log('%c' + MODULENAME + ': ', 'color: blue;');

/**************************************************************/
// fb_initialise()
// Called by setup
// Initialize firebase
// Input:  n/a
// Return: n/a
/**************************************************************/

function fb_initialise() {
  console.log('%cfb_initialise: ', 'color: brown;');

  
  // PLACE YOUR CONFIG FROM THE FIREBASE CONSOLE BELOW <========
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const FIREBASECONFIG = {
    apiKey: "AIzaSyD4vJluWCuYTQ4-N5jnHZ55PUrkYS9W3n0",
    authDomain: "comp-2023-william-li.firebaseapp.com",
    databaseURL: "https://comp-2023-william-li-default-rtdb.firebaseio.com",
    projectId: "comp-2023-william-li",
    storageBucket: "comp-2023-william-li.appspot.com",
    messagingSenderId: "819139211509",
    appId: "1:819139211509:web:ac17ea36b9cad4e76b15bc",
    measurementId: "G-F8EERYNHDD"
  
  };
  // Check if firebase already initialised
  if (!firebase.apps.length) {
    firebase.initializeApp(FIREBASECONFIG);
    database = firebase.database();
  }
  
}

/**************************************************************/
// fb_login(_save)
// Called by setup
// Login to Firebase
// Input:  object for login data to save to
// Return: n/a
/**************************************************************/
function fb_login(_save, _highScore) {
  console.log('%cfb_login: ', 'color: brown;');
  
  firebase.auth().onAuthStateChanged(newLogin);

  /*-----------------------------------------*/
  // newLogin(user)
  /*-----------------------------------------*/
  function newLogin(user) {
    console.log("new user login");
    if (user) {
      // user is signed in, so save Google login details
      loginStatus       = 'logged in';
      _save.uid      = user.uid;
      _save.email    = user.email;
      _save.name     = user.displayName;
      _save.photoURL = user.photoURL;
      _highScore.name = user.displayName;
      _highScore.uid = user.uid;
    } 
    else {
      // user NOT logged in, so redirect to Google login
      loginStatus = 'logged out';
          console.log('fb_login: logged out');

      var provider = new firebase.auth.GoogleAuthProvider();
      firebase.auth().signInWithPopup(provider).then(function(result) {
           console.log('fb_login: logged in via popup');

        loginStatus    = 'logged in via popup';
        _save.uid      = user.uid;
        _save.email    = user.email;
        _save.name     = user.displayName;
        _save.photoURL = user.photoURL;
      })
      // Catch errors
      .catch(function(error) {
        if(error) {
          if (user == null ) {
            console.log('fb_login: user not currently logged in');
          }
          else {
            loginStatus = 'failed';
            console.log('%cfb_login: ' + error.code + ', ' + 
                        error.message, 'color: red;');
          }
        }
      });
    }
  }
}

/**************************************************************/
// fb_upload(_score)
// Called by if function inside draw
// Upload Users recent score to firebase
// Input:  The totalScore of player
// Return: n/a
/**************************************************************/
//DETAILS, userDetails.uid, userDetails, userDetails.flappyBird
function fb_upload(_path, _key, _data, _score){

// Writes the most recent score to userDetails/key by writing the entire object in again
  firebase.database().ref(_path + '/' + _key ).set(_data);

//Wr
  firebase.database().ref('/highScores/Bird/' + _key).set(highScore);

//Reads the path userDetails/highScores/Bird/Name for the highest score of the user
  firebase.database().ref(_path + '/highScores/Bird/' + _key).once("value", newHighScore);

//If there is no highscore return no record. 
//Otherwise if the most recent score is higher than the old high score, write the new score
  function newHighScore(snapshot){
    if (snapshot.val() == null){
        console.log("newHighScore = null");
      } else if(_score > snapshot.val()){
        firebase.database().ref('/highScores/Bird/' + _key ).set(highScore);
    }
  }
}
/**************************************************************/
// fb_writeRec(_path, _key, _data)
// Write a specific record & key to the DB
// Input:  path to write to, the key and the data to write
// Return: 
/**************************************************************/
function fb_writeRec(_path, _key, _data) { 
  console.log('%cfb_WriteRec: path= ' + _path + '  key= ' + _key +
              '  data= ' + _data.name + '/' + _data.score, 
              'color: brown;');
  writeStatus = 'Waiting';
  firebase.database().ref(_path + '/' + _key).set(_data, 
  function(error) {
    if (error){
      writeStatus = 'Failed';
      console.log(error);
    } else {
      writeStatus = 'Successful';
    }
  });
  console.log("fb_writeRec: exit");
}

/**************************************************************/
// fb_lB(_path, _data)
// Read all DB records for the path
// Input:  path to read from and where to save the data
// Return:
/**************************************************************/
//            DETAILS,dbArray
function fb_lB(_path, _data) {
  console.log('%cfb_readAll: path= ' + _path, 'color: brown;');
  readStatus = 'Waiting';
  console.log("Reading Most Recent Scores of Users");
  firebase.database().ref(_path + "/highScores/Bird").orderByValue().limitToLast(3).once("value", gotRecord, readErr);

  function gotRecord(snapshot){
    if (snapshot.val() == null){
      readStatus = 'No Record';
    } else {
      snapshot.forEach(showLB);

      
      /* JS vers Object Sorter
      readStatus = 'Successful';
      let dbData = snapshot.val();
      console.log(dbData);
      
      //We put the name value pairs name into a array called dbKeys using object.keys
      //Object.keys is a constructor method
      let dbScores = Object.keys(dbData);
      
      
      //For Loop Goes Through dbKeys array to extract the name and score of every player and displays it
      for(i=0; i < dbScores.length; i++){
        let key = dbScores[i];
        _data.push({
          name: dbData[key].name,
          score: dbData[key].flappyBird
        });
        console.log(dbArray[i].name);
        console.log(dbArray[i].score);
      }
     */
    }
  }

  function readErr(error){
    readStatus = 'Failed';
    console.log(error);
  }

  function showLB(child){
    console.log(child.val());
  }
}


//Hacking database injection code
// firebase.database().ref("/").once("value", (snapshot)=> {console.log(snapshot.val())});

//firebase.database().ref("/YOUGOTPWNED").set("Hello You Got Hacked By William");





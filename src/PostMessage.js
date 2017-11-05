import * as firebase from 'firebase';
import config from './config/default';
import postFbMessage from './FacebookPost';
import uuid from 'js-uuid';
import {addPublishMessages} from './UserProfile';



function validateFile(file) {
  if (! file) {
    console.log("file not exist: " + file); 
    return false;    
  }

  if(!file.type.match('image.*')) {
    console.log("File is not image:" + file);
    var data = {
      message: 'You can only share images',
      timeout: 2000
    };
    //TODO: call snackbar
    //this.signInSnackbar.MaterialSnackbar.showSnackbar(data);
    return false;
  }
  return true;
};

function uploadImage(data, file) {

  var auth = firebase.auth();
  var currentUser = auth.currentUser;
//  var Jimp = require("jimp");
  var filePath = currentUser.uid + '/' + data.key + '/' + file.name;
  var storage = firebase.storage();

/*
  return Jimp.read(file.name).then(function (image) {
      var smallPicName = 'small' + file.name;
      image.resize(960, Jimp.AUTO, Jimp.RESIZE_BICUBIC).write(smallPicName); // save 
      var smallPic = new File(smallPicName);
      return storage.ref(filePath).put(smallPic);
  }).catch(function (err) {
      console.error(err);
      return storage.ref(filePath).put(file);                
  })
*/
  return storage.ref(filePath).put(file);                
};

function updateData(data, snapshot) {
  var fullPath = snapshot.metadata.fullPath;
  return data.update({imageUrl: firebase.storage().ref(fullPath).toString()});
};


function postMessage(message, file, tags, geolocation, start, duration, interval, link) {
  // Check if the file is an image.

  //var loadingImageUrl = "https://www.google.com/images/spin-32.gif";
  var auth = firebase.auth();
  var currentUser = auth.currentUser;       
  var messagesRef = firebase.database().ref(config.messageDB);
  var now = Date.now();
  console.log("Start: " + start + " Duration: " + duration + " Interval: " + interval + " Link: " + link);
  if(start === "")
  {
    start = null;
    duration = null;
    interval = null;
  }
  var key = uuid.v4();
  return messagesRef.push({
    name: currentUser.displayName,
    //imageUrl: loadingImageUrl,
    text: message,
    photoUrl: currentUser.photoURL || '/images/profile_placeholder.png',
    latitude: geolocation.latitude,
    longitude: geolocation.longitude,
    tag: tags,
    createdAt: now,
    key: key,
    fbpost: 'fbpost',    
    start: start,
    duration: duration,
    interval: interval,
    link: link
  }).then((data) => {
    addPublishMessages(currentUser,key).then(() => {
      var fbpostmessage = message;
      if (! validateFile(file)) {
        console.log("Invalid file.");
        postFbMessage(fbpostmessage, geolocation, '', tags, data);
      }
      else
      {    
        uploadImage(data, file).then(
          (snapshot) =>  {
            return updateData(data, snapshot).then(() =>
              {
                postFbMessage(fbpostmessage, geolocation, snapshot, tags,data);
              });
          });
      }
    })
  });  
};

export default postMessage;

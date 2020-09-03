import * as React from "react";
import firebase from "firebase";

const firebaseConfig = {
    apiKey: "<The API key>",
    authDomain: "<auth Domain>",
    databaseURL: "<database URL>",
    projectId: "<project Id>",
    storageBucket: "<storage Bucket>",
    appId: "<app Id>",
  };
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  };
export const LOCATION_TASK_NAME = 'background-location-task';
export const AuthContext = React.createContext();
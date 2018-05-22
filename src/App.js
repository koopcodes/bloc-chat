import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import * as firebase from "firebase";
import RoomList from "./components/RoomList.js";
import MessageList from "./components/MessageList.js";

var config = {
  apiKey: "AIzaSyAKGIi6kUifZBMmKS5C3b7zt0d9FirZO1k",
  authDomain: "koop-chat.firebaseapp.com",
  databaseURL: "https://koop-chat.firebaseio.com",
  projectId: "koop-chat",
  storageBucket: "koop-chat.appspot.com",
  messagingSenderId: "337124092066",
};
firebase.initializeApp(config);

/* var provider = new firebase.auth.GoogleAuthProvider();
firebase.auth().signInWithRedirect(provider);
firebase.auth().getRedirectResult().then(function(result) {
  if (result.credential) {
    // This gives you a Google Access Token. You can use it to access the Google API.
    var token = result.credential.accessToken;
    // ...
  }
  // The signed-in user info.
  var user = result.user;
}).catch(function(error) {
  // Handle Errors here.
  var errorCode = error.code;
  var errorMessage = error.message;
  // The email of the user's account used.
  var email = error.email;
  // The firebase.auth.AuthCredential type that was used.
  var credential = error.credential;
  // ...
}); */

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { activeRoom: null };
  }

  pickActiveRoom(room) {
		this.setState({ activeRoom: room });
  }

  render() {

    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Koop Chat</h1>
        </header>
        <aside id="sidebar">
          <div id="logo" />
          <div id="slogan">Chat Rooms</div>
          <RoomList firebase={firebase} activeRoom={this.state.activeRoom} pickActiveRoom={this.pickActiveRoom.bind(this)} />
          <nav />
        </aside>
        <span id="main">
				<MessageList firebase={firebase} activeRoom={this.state.activeRoom} />
				</span>
      </div>
    );
  }
}

export default App;

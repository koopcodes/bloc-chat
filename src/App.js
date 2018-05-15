import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import * as firebase from "firebase";
import RoomList from "./components/RoomList.js";

var config = {
  apiKey: "AIzaSyAKGIi6kUifZBMmKS5C3b7zt0d9FirZO1k",
  authDomain: "koop-chat.firebaseapp.com",
  databaseURL: "https://koop-chat.firebaseio.com",
  projectId: "koop-chat",
  storageBucket: "koop-chat.appspot.com",
  messagingSenderId: "337124092066",
};
firebase.initializeApp(config);

this.state = {
  rooms: [],
};

this.roomsRef = this.props.firebase.database().ref("rooms");

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Koop Chat</h1>
        </header>
        <span id="main">
          <p>
            linke to RoomList Route
            <Route path="/roomlist" component={RoomList} />
          </p>
        </span>
      </div>
    );
  }
}

export default App;

import React, { Component } from "react";
// import { Route, Link } from "react-router-dom";
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

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      null: null,
    };
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
          <RoomList firebase={firebase} />
          <nav />
        </aside>
        <span id="main">Stuff goes here</span>
      </div>
    );
  }
}

export default App;

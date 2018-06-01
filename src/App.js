import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import * as firebase from "firebase";
import RoomList from "./components/RoomList.js";
import MessageList from "./components/MessageList.js";
import User from "./components/User.js";
import Presence from "./components/Presence.jsx";
// import defaultUserImage from "./img/defaultUser100.png";

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
			activeRoom: null,
			user: null
		};
		this.pickActiveRoom = this.pickActiveRoom.bind(this);
		this.setUser = this.setUser.bind(this);
	}

	pickActiveRoom(room) {
		this.setState({ activeRoom: room });
		// const userRef = firebase.database().ref("presence/" + this.state.user.username);
		// const roomKey = room === "" ? "" : room.key;
		// const roomName = room === "" ? "" : room.name;
		// userRef.update({ currentRoom: roomKey, roomName: roomName });
	}

	setUser(user) {
		this.setState({ user: user });
	}

	render() {
		return (
			<div className="App">
				<header className="App-header">
					<span id="user">
						<User firebase={firebase} setUser={this.setUser.bind(this)} user={this.state.user} />
					</span>
					<img src={logo} className="App-logo" alt="logo" />
					<h1 className="App-title">Koop Chat</h1>
				</header>
				<aside id="sidebar">
					<div id="logo" />
					<Presence firebase={firebase} user={this.state.user} />
					<div id="slogan">Chat Rooms</div>
					<RoomList
						firebase={firebase}
						activeRoom={this.state.activeRoom}
						pickActiveRoom={this.pickActiveRoom.bind(this)}
						user={this.state.user}
					/>
					<nav />
				</aside>
				<span id="main">
					<MessageList firebase={firebase} activeRoom={this.state.activeRoom} user={this.state.user} />
				</span>
			</div>
		);
	}
}

export default App;

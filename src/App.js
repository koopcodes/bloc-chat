import React, { Component } from 'react';
import logo from './logo.svg';
import RoomList from './components/RoomList.js';
import MessageList from './components/MessageList.js';
import User from './components/User.js';
import './App.css';
import * as firebase from 'firebase';
// import defaultUserImage from "./img/defaultUser100.png";

var config = {
	apiKey: 'AIzaSyAKGIi6kUifZBMmKS5C3b7zt0d9FirZO1k',
	authDomain: 'koop-chat.firebaseapp.com',
	databaseURL: 'https://koop-chat.firebaseio.com',
	projectId: 'koop-chat',
	storageBucket: 'koop-chat.appspot.com',
	messagingSenderId: '337124092066',
};
firebase.initializeApp(config);

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			activeRoom: null,
			user: null,
		};
		this.pickActiveRoom = this.pickActiveRoom.bind(this);
		this.setUser = this.setUser.bind(this);
	}

	pickActiveRoom(room) {
		this.setState({ activeRoom: room });
	}

	setUser(user) {
		this.setState({ user: user });
	}

	render() {
		return (
			<div className="App">
				<div className="App-header">
					<img src={logo} className="App-logo" alt="logo" />
					<h1 className="App-title">Koop Chat</h1>
					<p>
						A proof-of-concept chat app built with React using Google
						Authorization and a NoSQL Firebase database
					</p>
					<a
						href="https://github.com/koopdev/bloc-chat"
						alt="Link to Source Code"
						target="_blank"
						rel="noopener noreferrer"
						className="github-link">
						Source Code
					</a>
				</div>
				<div id="user">
					<User
						firebase={firebase}
						setUser={this.setUser.bind(this)}
						user={this.state.user}
					/>
				</div>
				<div id="sidebar">
					<RoomList
						firebase={firebase}
						activeRoom={this.state.activeRoom}
						pickActiveRoom={this.pickActiveRoom}
						user={this.state.user}
					/>
					<nav />
				</div>
				<div id="main">
					<MessageList
						firebase={firebase}
						activeRoom={this.state.activeRoom}
						user={this.state.user}
					/>
				</div>
			</div>
		);
	}
}

export default App;

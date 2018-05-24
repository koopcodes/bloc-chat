import React, { Component } from 'react';
import './User.css';
import defaultUserImage from './../img/defaultUser100.png';

class User extends Component {
	constructor(props) {
		super(props);
		this.signIn = this.signIn.bind(this);
		this.signOut = this.signOut.bind(this);
	}
	componentDidMount() {
		this.props.firebase.auth().onAuthStateChanged(user => {
			this.props.setUser(user);
			const isOnline = this.props.firebase.database().ref('.info/connected');
			if (user) {
				const userRef = this.props.database().ref('presence/' + user.uid);
				isOnline.on('value', snapshot => {
					if (snapshot.val()) {
						userRef.update({ user: user.displayName, isOnline: true });
						userRef.onDisconnect().update({ isOnline: false, activeRoom: '' });
					}
				});
			}
		});
	}

	signIn() {
		const provider = new this.props.firebase.auth.GoogleAuthProvider();
		this.props.firebase.auth().signInWithPopup(provider).then(result => {
			const user = result.user;
			this.props.setUser(user);
		});
	}

	signOut() {
		this.props.firebase.auth().onAuthStateChanged(user => {
			if (user !== null) {
				const userRef = this.props.firebase.database().ref('presence/' + user.uid);
				userRef.update({isOnline: false, activeRoom: '', roomName: ''});
			}
		});
		this.props.firebase.auth().signOut().then(() => {
			this.props.setUser(null);
		});
	}

	render() {
		return (
			<span id="user-display">
				<p id="avatar">
					<img src={this.props.user ? this.props.user.photoURL : defaultUserImage} alt="user" />
				</p>
				<p id="user-name">{this.props.user ? this.props.user.displayName.split(' ')[0] : 'Guest'}</p>
				<p id="sign-in-out">
					<input
						type="button"
						value={this.props.user ? 'Sign Out' : 'Sign In'}
						onClick={this.props.user ? this.signOut : this.signIn }
					/>
				</p>
			</span>
		);
	}
}

export default User;

import React, { Component } from 'react';
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
		});
	}

	signIn() {
		const provider = new this.props.firebase.auth.GoogleAuthProvider();
		this.props.firebase
			.auth()
			.signInWithPopup(provider)
			.then(result => {
				const user = result.user;
				this.props.setUser(user);
			});
	}

	signOut() {
		this.props.firebase
			.auth()
			.signOut()
			.then(() => {
				this.props.setUser(null);
			});
	}

	render() {
		return (
			<span id="user-display">
				<div id="avatar">
					<img src={this.props.user ? this.props.user.photoURL : defaultUserImage} alt="user" />
				</div>
				<div id="user-name">{this.props.user ? 'Welcome ' + this.props.user.displayName.split(' ')[0] + '!' : 'Guest'}</div>
				<div id="sign-in-out">
					<input
						type="button"
						value={this.props.user ? 'Sign Out' : 'Sign In to Create or Delete'}
						onClick={this.props.user ? this.signOut : this.signIn}
					/>
				</div>
			</span>
		);
	}
}

export default User;

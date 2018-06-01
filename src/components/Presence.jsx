import React, { Component } from 'react';
import * as firebase from 'firebase';

export class Presence extends Component {
	constructor(props) {
		super(props);
		this.state = {
			usersOnline: [],
			isOpen: true,
			user: 'Anonymous'
		};
		this.toggleUsers = this.toggleUsers.bind(this);
	}

	componentDidMount() {
		var amOnline = this.props.firebase.database().ref('.info/connected');
		var userRef = this.props.firebase.database().ref('presence/' + this.state.user);
		var sessionRef = this.props.firebase
			.database()
			.ref('sessions/' + this.state.user)
			.push();
		amOnline.on('value', function(snapshot) {
			if (snapshot.val()) {
				userRef.onDisconnect().set('☆ offline');
				userRef.set('★ online');
				sessionRef
					.child('ended')
					.onDisconnect()
					.set(Date());
				sessionRef.child('began').set(Date());
				document.onIdle = function() {
					userRef.set('☆ idle');
				};
				document.onAway = function() {
					userRef.set('☄ away');
				};
				document.onBack = function(isIdle, isAway) {
					userRef.set('★ online');
				};
			}
		});
	}

	toggleUsers() {
		this.setState = prevState => ({
			isOpen: !prevState.isOpen,
		});
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.activeRoom !== this.props.activeRoom) {
			const userRef = this.props.firebase.database().ref('presence/');
			userRef
				.orderByChild('currentRoom')
				.equalTo(nextProps.activeRoom)
				.on('value', snapshot => {
					const participantChanges = [];
					if (snapshot.val()) {
						snapshot.forEach(participant => {
							participantChanges.push({
								key: participant.key,
								username: participant.val().username,
								isTyping: participant.val().isTyping,
							});
						});
					}
					this.setState({ participants: participantChanges });
				});
		}
	}

	render() {
		// var userRef = this.props.firebase.database().ref('presence/');

		// userRef.on('value', function(snapshot) {
		// 	if (snapshot.val() === true) {
		// 		// User is online, update UI.
		// 	} else {
		// 		// User logged off at snapshot.val() - seconds since epoch.
		// 	}
		// });

		return (
			<div>
				<p className="participants-heading">
					Room Participants |
					<span className="cursor-color-change" onClick={this.toggleList}>
						{this.state.isOpen ? ' Hide' : ' Show'}
					</span>
				</p>
				{this.state.isOpen ? this.state.usersOnline : null}
			</div>
		);
	}
}

export default Presence;

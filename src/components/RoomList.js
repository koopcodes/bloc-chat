import React, { Component } from 'react';
import './RoomList.css';
import defaultUserImage from './../img/defaultUser100.png';

class RoomList extends Component {
	constructor(props) {
		super(props);
		this.state = {
			rooms: [],
			newRoomName: '',
		};
		this.roomsRef = this.props.firebase.database().ref('rooms');
	}



	componentDidMount() {
		this.roomsRef.on('child_added', snapshot => {
			const room = snapshot.val();
			room.key = snapshot.key;
			this.setState({ rooms: this.state.rooms.concat(room) });
			if(this.state.rooms.length === 1){this.props.pickActiveRoom(room);}
		});
	}

	addNewRoom(newRoomName) {
		if (this.validateRoomName(newRoomName)) {
			this.roomsRef.push({
				name: newRoomName,
				createdOn: Date(),
				roomId: this.props.activeRoom.key,
				creator: this.props.user ? this.props.user.displayName : 'Anonymous',
				email: this.props.user ? this.props.user.email : '',
				displayName: this.props.user ? this.props.user.displayName : 'Anonymous',
				photoURL: this.props.user ? this.props.user.photoURL : defaultUserImage,

			});
			this.setState({ newRoomName: '' });
		}
	}

	handleChange(e) {
		e.preventDefault();
		this.setState({ newRoomName: e.target.value });
	}

	validateRoomName(newRoomName) {
		const newRoomLength = newRoomName.trim().length;
		if (newRoomLength > 0) {
			return true;
		} else {
			return false;
		}
	}

	render() {
		return (
			<section id="room-component">
				<ul id="room-list">
					{this.state.rooms.map((room) => (
						<li key={room.key} className={this.props.activeRoom && this.props.activeRoom.key === room.key ? 'active' : 'not-active' }>
							<input type="button" onClick={ () => this.props.pickActiveRoom(room)} className="room-name" value= {room.name} />
						</li>
					))}
				</ul>
				<form id="addRoomForm" onSubmit={ (e) => {e.preventDefault(); this.addNewRoom(this.state.newRoomName); } } >
					<fieldset>
						<legend>Create New Chat Room</legend>
						<input type="text" value={ this.state.newRoomName } name="newRoomName" placeholder="New Room Name" onChange={ this.handleChange.bind(this) } />
						<input type="submit" value="+" />
					</fieldset>
				</form>
			</section>
		);
	}
}

export default RoomList;

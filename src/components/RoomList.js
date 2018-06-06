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
		});
	}

	addNewRoom(newRoomName) {
		if (this.validateRoomName(newRoomName)) {
			this.roomsRef.push({
				name: newRoomName,
				createdOn: Date(),
				createdBy: this.props.user ? this.props.user.displayName : 'Guest',
			});
			this.setState({ newRoomName: '' });
		}
	}

	deleteRoom(roomKey) {
		const room = this.props.firebase.database().ref('rooms/' + roomKey);
		const roomMessages = this.props.firebase.database().ref('messages/' + roomKey);
		room.remove();
		roomMessages.remove();
		this.props.activeRoom('');
	}

	handleChange(e) {
		e.preventDefault();
		this.setState({
			[e.target.name]: e.target.value,
			createdBy: this.props.user.displayName,
		});
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
				<div id="active-room-diplay">Current Room: {this.props.activeRoom ? this.props.activeRoom.name : ''}</div>
				<form
					id="addRoomForm"
					onSubmit={e => {
						e.preventDefault();
						this.addNewRoom(this.state.newRoomName);
					}}>
					<fieldset>
						<legend>Create New Chat Room</legend>
						<input
							type="text"
							value={this.state.newRoomName}
							name="newRoomName"
							placeholder="New Room Name"
							onChange={this.handleChange.bind(this)}
						/>
						<input type="submit" value="+" />
					</fieldset>
				</form>
				<ul id="room-list">
					{this.state.rooms.map(room => (
						<li
							key={room.key}
							className={this.props.activeRoom && this.props.activeRoom.key === room.key ? 'active' : 'not-active'}>
							<input
								type="button"
								onClick={() => this.props.pickActiveRoom(room)}
								className="room-name"
								value={room.name}
							/>
						</li>
					))}
				</ul>
			</section>
		);
	}
}

export default RoomList;

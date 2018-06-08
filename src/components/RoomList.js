import React, { Component } from 'react';
import './RoomList.css';

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
		this.roomsRef.on('child_removed', snapshot => {
			this.setState({ rooms: this.state.rooms.filter(room => room.key !== snapshot.key) });
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

	deleteRoom(activeRoom) {
		const roomToDelete = this.props.firebase.database().ref('rooms/' + activeRoom.key);
		roomToDelete.remove();
		this.setState({ activeRoom: null });
		console.log(activeRoom);
		//const messagesToDelete = this.props.firebase.database().ref('messages/');
		// for (var i = 0; i < messagesToDelete.length; i++) {
		// 	if (messagesToDelete[i].roomId === activeRoom.key) {
		// 		console.log(messagesToDelete[i]);
		// 		messagesToDelete[i].remove();
		// 	}
		// }
	}

	handleChange(e) {
		e.preventDefault();
		this.setState({
			[e.target.name]: e.target.value,
			createdBy: this.props.user ? this.props.user.displayName : 'Guest',
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
				<div id="active-room-diplay">
					<div>Current Room: {this.props.activeRoom ? this.props.activeRoom.name : 'Select a Room'}</div>
					{this.props.user !== null ? (
						<button type="submit" onClick={() => this.deleteRoom(this.props.activeRoom)}>
							Delete Room
						</button>
					) : (
						<div className="no-delete" />
					)}
				</div>
				<ul id="room-list">
					{this.state.rooms.map(room => (
						<ul
							key={room.key}
							className={this.props.activeRoom && this.props.activeRoom.key === room.key ? 'active' : 'not-active'}>
							<input
								type="button"
								onClick={() => this.props.pickActiveRoom(room)}
								className="room-name"
								value={room.name}
							/>
						</ul>
					))}
				</ul>
				{this.props.user !== null ? (
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
				) : (
					<div className="no-create" />
				)}
			</section>
		);
	}
}

export default RoomList;

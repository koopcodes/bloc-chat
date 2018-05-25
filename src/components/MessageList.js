import React, { Component } from 'react';
import './MessageList.css';
import defaultUserImage from './../img/defaultUser.png';

class MessageList extends Component {
	constructor(props) {
		super(props);
		this.state = {
			messages: [],
			activeRoomMessages: [],
			newMessageText: '',
		};
		this.messagesRef = this.props.firebase.database().ref('messages');
	}

	activeRoomMessages(activeRoom) {
		if (!activeRoom) { return; }
		this.setState({ activeRoomMessages: this.state.messages.filter( message => message.roomId === activeRoom.key ) }, () => this.scrollToBottom() );
	}

	componentDidMount() {
		this.messagesRef.on('child_added', snapshot => {
			const message = snapshot.val();
			message.key = snapshot.key;
			this.setState({ messages: this.state.messages.concat(message) }, () => {
				this.activeRoomMessages(this.props.activeRoom);
				this.scrollToBottom();
			});
		});
		this.messagesRef.on('child_removed', snapshot => {
			this.setState({ messages: this.state.messages.filter(message => message.key !== snapshot.key) }, () => {
				this.updateDisplayedMessages(this.props.activeRoom);
			});
		});
	}

	componentWillReceiveProps(nextProps) {
		this.activeRoomMessages(nextProps.activeRoom);
	}

	scrollToBottom() {
		this.bottomOfMessages.scrollIntoView();
	}

	createMessage() {
		if (!this.props.activeRoom || !this.state.newMessageText) {
			return;
		}
		this.messagesRef.push({
			content: this.state.newMessageText,
			sentAt: Date.now(),
			roomId: this.props.activeRoom.key,
			username: this.props.user
				? { email: this.props.user.email, displayName: this.props.user.displayName, photoURL: this.props.user.photoURL }
				: { email: null, displayName: 'Guest', photoURL: defaultUserImage },
		});
		this.setState({ newMessageText: '' });
	}

	handleChange(event) {
		this.setState({ newMessageText: event.target.value });
	}

	removeMessage(room) {
		this.messagesRef.child(room.key).remove();
	}

	render() {
		return (
			<table id="message-component">
				<caption className="active-room">Room: {this.props.activeRoom ? this.props.activeRoom.name : ''}</caption>
				<tbody id="message-list">
					<tr>
						<th>User</th>
						<th>Message</th>
						<th>Sent</th>
					</tr>
					{this.state.activeRoomMessages.map(message => (
						<tr key={message.key}>
							<td className="user-name">{message.username}</td>
							<td className="content">{message.content}</td>
							<td className="sentAt">{message.sentAt}</td>
						</tr>
					))}
					<div ref={thisDiv => (this.bottomOfMessages = thisDiv)} />
				</tbody>
			</table>
		);
	}
}
export default MessageList;

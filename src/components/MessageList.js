import React, { Component } from 'react';
import './MessageList.css';
import defaultUserImage from './../img/defaultUser100.png';

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
		if (!activeRoom) {return;}
		this.setState(
			{ activeRoomMessages: this.state.messages.filter(message => message.roomId === activeRoom.key) },
			() => this.scrollToBottom()
		);
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

	createMessage(newMessageText) {
		if (!this.props.activeRoom || !newMessageText) { return; }
		this.messagesRef.push({
			content: newMessageText,
			sentAt: Date(),
			roomId: this.props.activeRoom.key,
			username: this.props.user ? this.props.user.displayName : 'Guest',
			email: this.props.user ? this.props.user.email : '',
			displayName: this.props.user ? this.props.user.displayName : 'Guest',
			photoURL: this.props.user ? this.props.user.photoURL : defaultUserImage,
		});
		this.setState({ newMessageText: '' });
	}

	handleChange(event) {
		this.setState({newMessageText: event.target.value });
	}

	scrollToBottom() {
		this.bottomOfMessages.scrollIntoView();
	}

	removeMessage(room) {
		this.messagesRef.child(room.key).remove();
	}

	render() {
		return (
			<table id="message-component">
				<tbody id="message-list">
					<tr>
						<th id='user-message-header'>User</th>
						<th id='message-message-header'>Message</th>
						<th id='sent-message-header'>Sent</th>
					</tr>
					{this.state.activeRoomMessages.map(message => (
						<tr key={message.key}>
							<td className="user-name">
								<img src={ message.photoURL ? message.photoURL : defaultUserImage } alt="user" />{message.username ? message.username : 'Anonymous' }</td>
							<td className='content'>{message.content} </td>
							<td className="sentAt">{message.sentAt}</td>
						</tr>
					))}
				</tbody>
				<form id="create-message" onSubmit={ (e) => { e.preventDefault(); this.createMessage(this.state.newMessageText); } }>
					<textarea autoFocus required rows="3" cols="40" form="create-message" value={ this.state.newMessageText } onChange={ this.handleChange.bind(this) }  name="newMessageText" placeholder="What's on your mind?" id='message-box' />
					<input type='submit' id='message-submit'/>
				</form>
				<div ref={thisDiv => (this.bottomOfMessages = thisDiv)} />
			</table>
		);
	}
}
export default MessageList;

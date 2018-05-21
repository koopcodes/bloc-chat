import React, { Component } from "react";
import "./MessageList.css";

class MessageList extends Component {
	constructor(props) {
		super(props);
		this.state = {
			messages: [],
			activeRoomMessages: [],
		};
		this.messagesRef = this.props.firebase.database().ref("messages");
	}

	activeRoomMessages(activeRoom) {
		if (!activeRoom) {
			return;
		}
		this.setState(
			{ activeRoomMessages: this.state.messages.filter(message => message.roomId === activeRoom.key) },
			() => this.scrollToBottom()
		);
	}

	componentDidMount() {
		this.messagesRef.on("child_added", snapshot => {
			const message = snapshot.val();
			message.key = snapshot.key;
			this.setState({ messages: this.state.messages.concat(message) }, () => {
				this.activeRoomMessages(this.props.activeRoom);
				this.scrollToBottom();
			});
		});
	}

	componentWillReceiveProps(nextProps) {
		this.activeRoomMessages(nextProps.activeRoom);
	}

	scrollToBottom() {
		this.bottomOfMessages.scrollIntoView();
	}

	render() {
		return (
			<table id="message-component">
				<caption className="active-room">Room: {this.props.activeRoom ? this.props.activeRoom.name : ""}</caption>
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

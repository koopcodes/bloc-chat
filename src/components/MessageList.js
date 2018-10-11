import React, { Component } from "react";
import defaultUserImage from "./../img/defaultUser100.png";

class MessageList extends Component {
	constructor(props) {
		super(props);
		this.state = {
			messages: [],
			activeRoomMessages: [],
			newMessageText: "",
		};
		this.messagesRef = this.props.firebase.database().ref("messages");
	}

	activeRoomMessages(activeRoom) {
		if (!activeRoom) {
			return;
		}
		this.setState(
			{ activeRoomMessages: this.state.messages.filter(message => message.roomId === activeRoom.key) },
			() => this.scrollToBottom(),
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
		this.messagesRef.on("child_removed", snapshot => {
			this.setState({ messages: this.state.messages.filter(message => message.key !== snapshot.key) }, () => {
				this.updateDisplayedMessages(this.props.activeRoom);
			});
		});
	}

	componentWillReceiveProps(nextProps) {
		this.activeRoomMessages(nextProps.activeRoom);
	}

	createMessage(newMessageText) {
		if (!this.props.activeRoom || !newMessageText) {
			return;
		}
		this.messagesRef.push({
			content: newMessageText,
			sentAt: `${this.getDate()} ${this.getTime()}`,
			roomId: this.props.activeRoom.key,
			username: this.props.user ? this.props.user.displayName : "Guest",
			email: this.props.user ? this.props.user.email : "",
			displayName: this.props.user ? this.props.user.displayName : "Guest",
			photoURL: this.props.user ? this.props.user.photoURL : defaultUserImage,
		});
		this.setState({ newMessageText: "" });
	}

	getDate() {
		var currentDate = new Date();
		var months = [
			"January",
			"February",
			"March",
			"April",
			"May",
			"June",
			"July",
			"August",
			"September",
			"October",
			"November",
			"December",
		];
		var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

		var dayOfWeek = days[currentDate.getDay()];
		var month = months[currentDate.getMonth()];
		var dayOfMonth = currentDate.getDate();
		var year = currentDate.getFullYear();

		return dayOfWeek + ", " + month + " " + dayOfMonth + ", " + year;
	}

	getTime() {
		var time = new Date();
		var hour = time.getHours();
		var minute = time.getMinutes();
		minute = minute < 10 ? "0" + minute : minute;
		var amPm = hour >= 12 ? "PM" : "AM";
		if (hour === 0) {
			hour = 12;
		} else if (hour > 12) {
			hour = hour % 12;
		}
		return `${hour}:${minute} ${amPm}`;
	}

	handleChange(event) {
		this.setState({ newMessageText: event.target.value });
	}

	scrollToBottom() {
		this.bottomOfMessages.scrollIntoView();
	}

	removeMessage(room) {
		this.messagesRef.child(room.key).remove();
	}

	render() {
		return (
			<div>
				<table id="message-component">
					<tbody id="message-list">
						<tr>
							<th id="user-message-header">User</th>
							<th id="message-message-header">Message</th>
							<th id="sent-message-header">Sent</th>
						</tr>
						{this.state.activeRoomMessages.map(message => (
							<tr key={message.key}>
								<td className="user-name">
									<img src={message.photoURL ? message.photoURL : defaultUserImage} alt="user" />
									{message.username ? message.username : "Anonymous"}
								</td>
								<td className="content">{message.content} </td>
								<td className="sentAt">{message.sentAt}</td>
							</tr>
						))}
					</tbody>
				</table>
				<div>
					<form
						id="create-message"
						onSubmit={e => {
							e.preventDefault();
							this.createMessage(this.state.newMessageText);
						}}>
						<textarea
							autoFocus
							required
							form="create-message"
							value={this.state.newMessageText}
							onChange={this.handleChange.bind(this)}
							name="newMessageText"
							placeholder="What's on your mind?"
							id="message-box"
						/>
						<input type="submit" id="message-submit" />
					</form>
					<div ref={thisDiv => (this.bottomOfMessages = thisDiv)} />
				</div>
			</div>
		);
	}
}
export default MessageList;

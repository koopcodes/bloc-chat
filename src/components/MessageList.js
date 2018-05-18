import React, { Component } from 'react';
import "./MessageList.css";

class MessageList extends Component {
	constructor(props) {
		super(props);
		this.state = {
			selectedRoom : "",
			messages : {
					message : {
						content: "",
						name: "",
						sentAt: "",
					}
			},
			selectedMessage: "",
		};
	}

	addNewMessage(e) {
		e.preventDefault();
		if (this.valiadateMessage(this.state.newMessage)) {
			this.messagesRef.push({ message: this.state.newMessage });
			console.log("New Message Added!");
			this.setState({ newMessage: "" });
		}
	}

	componentDidMount() {
			this.messageRef.on('child_added', snapshot => {
    	const message = snapshot.val();
    	message.key = snapshot.key;
    	this.setState({ messages: this.state.messages.concat(message) })
  		});
      console.log(this.state.message)
  }




render() {
	// const messageList = this.state.messages.map((message) =>
	return(
		<section id="message-component">
			<ul id="message-list">
			{ MessageList }
			</ul>
		</section>
	)}
}
export default MessageList;

import React, { Component } from "react";
import './RoomList.css';

class RoomList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rooms: [],
    };
    this.roomsRef = this.props.firebase.database().ref("rooms");
  }

  componentDidMount() {
    this.roomsRef.on("child_added", snapshot => {
      console.log(snapshot);
      const room = snapshot.val();
      room.key = snapshot.key;
      this.setState({ rooms: this.state.rooms.concat(room) })
    });
  }

  render() {
    return (
      <section id="room-component">
        <ul id="room-list">
          {this.state.rooms.map((data, index) => (
            <li key={index} className="room-name">
			        {data.name}
            </li>
          ))}
        </ul>
				<form id="addRoomForm" action="" target="">
    			<fieldset>
						<legend>Create New Chat Room</legend>
    				<input type="text" name="newRoomName" value="New Room Name" />
    		    <input type="submit" value="+"/>
					</fieldset>
				</form>
      </section>
    );
  }
}

export default RoomList;

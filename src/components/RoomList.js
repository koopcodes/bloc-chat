import React, { Component } from "react";
import "./RoomList.css";

class RoomList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rooms: [],
      newRoomName: "",
    };
    this.roomsRef = this.props.firebase.database().ref("rooms");
    this.addNewRoom = this.addNewRoom.bind(this);
  }

  addNewRoom(e) {
    e.preventDefault();
    if (this.validateRoomName(this.state.newRoomName)) {
      this.roomsRef.push({ name: this.state.newRoomName });
      console.log("New Room Added!");
      this.setState({ newRoomName: "" });
    }
  }

  componentDidMount() {
    this.roomsRef.on("child_added", snapshot => {
      console.log(snapshot);
      const room = snapshot.val();
      room.key = snapshot.key;
      this.setState({ rooms: this.state.rooms.concat(room) });
    });
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
          {this.state.rooms.map((room, index) => (
            <li key={index} className="roomname">
              {room.name}
            </li>
          ))}
        </ul>
        <form id="addRoomForm" onSubmit={e => this.addNewRoom(e)}>
          <fieldset>
            <legend>Create New Chat Room</legend>
            <input type="text" name="newRoomName" placeholder="New Room Name" onChange={e => this.handleChange(e)} />
            <input type="submit" value="+" />
          </fieldset>
        </form>
      </section>
    );
  }
}

export default RoomList;

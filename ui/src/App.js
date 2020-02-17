import React from 'react';
import logo from './logo.svg';
import './App.css';

class App extends React.Component {
  state = {
    socket_connected: false,
    messages: [],
    last_message: null
  }

  constructor(props) {
    super(props);
    this.socket = new WebSocket('ws://localhost:8080');
    this.socket.onopen = () => {
      this.setState({socket_connected: true});
    }
    this.socket.onmessage = (event) => {
      this._onMessage(JSON.parse(event.data));
    };
  }

  _onMessage(message) {
    console.log(message);
    let newMessages = this.state.messages;
    if (message != null) {
      newMessages.push(message.message[0]);
    }
    this.setState({messages: newMessages, last_message: message});
  }

  render() {
    return <div className='App'>
      <h1>Auto TA</h1>
      {!this.state.socket_connected
      ? <span>Connecting to RStudio session...</span>
      : <span>{
        this.state.last_message != null
        ? this.generateChat(this.state.messages)
        : <span>No error yet</span>
      }</span>}
    </div>;
  }

  generateChat(messages, uid=0) {
    return <span>
        {messages.map((msg) => this.generateMessage(msg, uid))}
      </span>;
  }

  generateMessage(message, uid=0) {
    return <div className={"container " + (uid == 1? "darker": "")}>
      <img src={uid == 1? "/sad-baby.png" : "/kawaii-robot-ta.png"}
        alt="Avatar" className={uid == 1? "right" : ""}></img>
      <p>{message}</p>
      </div>;
  }
}

export default App;

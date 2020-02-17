import React from 'react';
import logo from './logo.svg';
import './App.css';

class App extends React.Component {
  state = {
    socket_connected: false,
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
    this.setState({last_message: message});
  }

  render() {
    return <div className='App'>
      <h1>Auto TA</h1>
      {!this.state.socket_connected
      ? <span>Connecting to RStudio session...</span>
      : <span>{
        this.state.last_message != null
        ? <span>{this.state.last_message.message[0]}</span>
        : <span>No error yet</span>
      }</span>}
    </div>;
  }
}

export default App;

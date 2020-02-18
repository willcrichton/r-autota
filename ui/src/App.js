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
    this.setState({last_message: message});
  }

  render() {
    return <div className='App'>
      <h1>Auto TA</h1>
      {!this.state.socket_connected
      ? <div>Connecting to RStudio session...</div>
      : <div>{
        this.state.last_message != null
        ? <div>
          <div>You got the error: <span className='code-error'>{this.state.last_message.message[0]}</span></div>
          {this.state.last_message.matches.length > 0
          ? <div>
            Did you mean one of these functions?
            <ul>{
              this.state.last_message.matches.map((match, i) =>
                <li key={i}>{match}</li>
              )
            }</ul>
          </div>
          : <div>I don't know how to solve this!</div>}
        </div>
        : <div>No error yet</div>
      }</div>}
    </div>;
  }
}

export default App;

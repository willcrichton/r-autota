import React from 'react';
import logo from './logo.svg';
import './App.css';

class App extends React.Component {
  state = {
    socket_connected: false,
    messages: [],
    last_message: null
  }

  hardcoded_msgs = ["I see that you're running into this error quite often!"]

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
    console.log('Received message', message);
    this.setState({last_message: message});
  }

  render() {
    const newPage = <div className='App'>
      <h1>Auto TA</h1>
      {!this.state.socket_connected
      ? <div>Connecting to RStudio session...</div>
      : <div>{
        this.state.last_message != null
        ? this.generateChat(this.state.last_message)
        : <div>No error yet</div>
      }</div>}
    </div>;
    return newPage;
  }

  /*handles all the log saving for prev messages */
  generateChat(last_message, uid=0) {
    // steps: parse last_message, append to messages state, print all messages
    const lastMsgJsx = this.generateLastMessage();
    this.last = lastMsgJsx;
    let messages = this.state.messages;
    messages.push(lastMsgJsx);
    let jsxElem = <span>
        {messages.map((msg) => msg)}
      </span>;
    if (this.messagesEnd)
    this.messagesEnd.scrollIntoView({ behavior: "smooth" });
    return jsxElem;
  }

  /*uid == 0 => TA; ==1 => user */
  /*input: string, output: jsx elem*/
  generateLastMessage(uid=0) {
    const message = this.state.last_message.message[0];
    return <div className={"container " + (uid == 1? "darker": "")}>
      <img src={uid == 1? "/sad-baby.png" : "/kawaii-robot-ta.png"}
        alt="Avatar" className={uid == 1? "right" : ""}></img>
      <p>You got the error: <span className='code-error'>{message}</span></p>
      {this.state.last_message.matches.length > 0 && this.state.last_message.kind == 'no_function'
          ? <div>
            Did you mean one of these functions?
            <ul>{
              this.state.last_message.matches.map((match, i) =>
                <li key={i}>{match}</li>
              )
            }</ul>
          </div>
          : <div>Hmm, I'm not sure how to help with this one yet...</div>}
      </div>;
  }
}

export default App;

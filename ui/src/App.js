import React from 'react';
import logo from './logo.svg';
import './App.css';

class NotFoundError extends React.Component {
  render() {
    const matches = this.props.matches;
    const packages = this.props.packages;
    return <div className='error-help'>
      <div className='explanation block'>
        <div className='block-header'>Explanation</div>
        <div>This error means you tried to use a variable called "<code>{this.props.missing_obj}</code>" that R couldn't find.</div>
      </div>
      <div className='causes block'>
        <div className='block-header'>Possible causes</div>
        <ol className='cause-list'>
          <li>
            <div><strong>Did you make a typo writing the name?</strong></div>
            {matches.length > 0
              ? <div>
                <span>I found some similar names in your program and imported packages that you could have intended:</span>
                <ul>{matches.map((match) => <li><code>{match}</code></li>)}</ul>
              </div>
              : null
            }
          </li>
          <li>
            <span><strong>Did you forget to import a package?</strong> &nbsp;</span>
            {packages.length > 0
              ? <div>
                <span>I found the name you're looking for in the following packages that are installed but not imported:</span>
                <ul>{packages.map((pkg) => <li><code>{pkg}</code></li>)}</ul>
              </div>
              : null
            }
          </li>
        </ol>
      </div>
    </div>;
  }
}

class SyntaxError extends React.Component {
  render() {
    return <div className='error-help'>
      <div className='explanation block'>
        <div className='block-header'>Explanation</div>
        <div>This error means that R couldn't understand the syntax of your program, specifically in the phrase "<code>{this.props.bad_expr}</code>".</div>
      </div>
      <div className='causes block'>
        <div className='block-header'>Possible causes</div>
        <ol className='cause-list'>
        </ol>
      </div>
    </div>;
  }
}

class App extends React.Component {
  state = {
    socket_connected: false,
    messages: [],
    last_message: null
  }

  errors = {
    'obj_not_found': NotFoundError,
    'no_function': NotFoundError,
    'syntax_error': SyntaxError
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
    console.log('Received message', message);
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
              <div className='error-message block'>
                <div className='block-header'>Error message:</div>
                <pre className='code-error'>{this.state.last_message.message}</pre>
              </div>
              {React.createElement(
                this.errors[this.state.last_message.kind],
                this.state.last_message)}
            </div>
            : <div>No error yet</div>
        }</div>}
    </div>;
  }
}

export default App;

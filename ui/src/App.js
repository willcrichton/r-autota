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
                <span>I found some similar names in your program that you maybe meant:</span>
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

let convert_text = (s) => {
  const html = s.replace(/ /g, '&nbsp;').replace(/\n/g, '<br />');
  return <span dangerouslySetInnerHTML={{__html: html}} />;
};

let ParseInfo = ({bad_expr, parse_info}) => {
  let coord_map = {};
  let row = 0;
  let col = 0;
  for (let i = 0; i < bad_expr.length; ++i) {
    if (bad_expr.charAt(i) == '\n') {
      row += 1;
      col = 0;
    } else {
      if (!coord_map[row]) { coord_map[row] = {}; }
      coord_map[row][col] = i;
      col += 1;
    }
  }

  let parts = [];
  let last_end = 0;
  parse_info.forEach((parse_obj, i) => {
    let start = coord_map[parse_obj.line1-1][parse_obj.col1-1];
    let end = coord_map[parse_obj.line2-1][parse_obj.col2-1]+1;
    console.log(start, end, parse_obj.token);
    console.log(bad_expr.substring(last_end, start));
    parts.push(<span>{convert_text(bad_expr.substring(last_end, start))}</span>);
    const last_obj = i == parse_info.length - 1;
    const cls_name = `token stx-${parse_obj.token} ${last_obj ? "last-token" : ""}`;
    parts.push(<span className={cls_name}>
      {convert_text(bad_expr.substring(start, end))}</span>);
    last_end = end;
  });

  return <div className='parse-info'>{parts}</div>;
};

class SyntaxError extends React.Component {
  render() {
    return <div className='error-help'>
      <div className='explanation block'>
        <div className='block-header'>Explanation</div>
        <div>This error means that R couldn't understand the syntax of your program. While reading left-to-right through your program, R found a "<code>{this.props.syntax_kind}</code>" that R wasn't expecting. The unexpected <code>{this.props.syntax_kind}</code> is highlighted in red below.</div>
        {this.props.parse_info != null
          ? <ParseInfo {...this.props} />
          : null}
      </div>
      <div className='causes block'>
        <div className='block-header'>Possible causes</div>
        <ol className='cause-list'>
          <li>
            <div><strong>Did you forget a comma, parenthesis, quote, or other symbol?</strong></div>
            <div>For example, if you wanted to write <code>1 + 2</code> and instead wrote <code>1 2</code>, R would say "unexpected numeric constant" because R found a 2 when it was expecting a plus sign. More exampls:</div>
            <ul>
              <li><emph>Missing comma:</emph> writing <code>f(1 2)</code> instead of <code>f(1, 2)</code></li>
              <li><emph>Missing parenthesis:</emph> writing <code>f 1</code> instead of <code>f(1)</code></li>
              <li><emph>Missing quote:</emph> writing <code>f("a,1)</code> instead of <code>f("a",1)</code></li>
            </ul>
          </li>
          <li>
            <div><strong>Are your parentheses and quotes balanced?</strong></div>
            TODO
          </li>
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

/* eslint jsx-a11y/anchor-is-valid: "off" */
import React from 'react';
import ReactTooltip from 'react-tooltip';

import './App.css';

let tooltip_id = 0;
let Tooltip = ({children, text}) => {
  tooltip_id += 1;
  const id = `tooltip${tooltip_id}`;
  return <span className='tooltip' data-tip data-for={id}>
    {text}<sup>(?)</sup>
    <ReactTooltip effect="solid" id={id}>{children}</ReactTooltip>
  </span>
};

let themes = ['theme-default', 'theme-friendly'];

let common_tips = {
  'syntax': (<Tooltip text="syntax">Syntax means the order and kind of characters in a program. For example, we would say <code>f(a, b)</code> is the "syntax" for a function call in R.</Tooltip>),
  'variable': (<Tooltip text="variable">Variable means a name that stands in for a number, string, function, or other R object. Variables are defined by the <code>x &lt;- 1</code> syntax.</Tooltip>),
  'package': (<Tooltip text="package">Package means a collection of functions, data, and compiled code that often serves some purpose. For example, the <code>tidyverse</code> package was designed for data science.</Tooltip>),
  'script': (<Tooltip text="script">Script means a series of instructions, or code, that is meant to be carried out in a specific order. For example, a script might include initialization by assigning a variable (e.g. <code>x &lt;- 2</code>) before using said variable (e.g. <code>x + 1</code>)</Tooltip>),
  'import': (<Tooltip text="import">To import something means to add that something to your current program. For example, <code>library(tidyverse)</code> will import an installed package called <code>tidyverse</code>.</Tooltip>),
  'constant': (<Tooltip text="constant">Constant means a value that cannot be altered by the program when it is running. For example, <code>4</code> is a <code>numeric constant</code> but <code>x</code> in <code>x &lt;- 4</code> is not.</Tooltip>)
};

class NotFoundError extends React.Component {
  render() {
    const {matches, packages, user_defined} = this.props;
    return <div className='error-help'>
      <div className='explanation block'>
        <button className='block-header' onClick={on_header_click}>Explanation</button>
        <div className='content'>This error means you tried to use a {common_tips.variable} called <code>{this.props.missing_obj}</code> that R couldn't find.</div>
      </div>
      <div className='causes block'>
        <button className='block-header' onClick={on_header_click}>Possible causes</button>
        <div className='content'><ol className='cause-list'>
          <li>
            <div><strong>Did you make a typo writing the name?</strong></div>
            {matches[0] !== null
              ? <div>
                <span>I found some similar names in your program that you maybe meant:</span>
                <ul>{Object.values(matches).map((match) => <li><code>{match}</code></li>)}</ul>
              </div>
              : null
            }
          </li>
          <li>
            <span><strong>Did you forget to {common_tips.import} a {common_tips.package}?</strong> &nbsp;</span>
            {packages[0] !== null
              ? <div>
                <span>I found the name you're looking for in the following packages that are installed but not imported:</span>
                <ul>{Object.values(packages).map((pkg) => <li><code>{pkg}</code></li>)}</ul>
              </div>
              : null
            }
          </li>
          <li>
            <span><strong>Did you forget to execute part of your {common_tips.script}?</strong></span>
            {user_defined[0] !== null
              ? <div>
                <div>I found that line {user_defined.line_number} of file <code>{user_defined.path}</code> defines the name you're trying to use. Did you forget to run this line?</div>
                <pre>{user_defined.line_text}</pre>
              </div>
              : null}
          </li>
        </ol></div>
      </div>
    </div>;
  }
}

let convert_text = (s) => {
  const html = s.replace(/ /g, '&nbsp;').replace(/\n/g, '<br />');
  return <span dangerouslySetInnerHTML={{__html: html}} />;
};

let ParseInfo = ({bad_expr, parse_info}) => {
  bad_expr = bad_expr[0];
  let coord_map = {};
  let row = 0;
  let col = 0;
  for (let i = 0; i < bad_expr.length; ++i) {
    if (bad_expr.charAt(i) === '\n') {
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
    parts.push(<span>{convert_text(bad_expr.substring(last_end, start))}</span>);
    const last_obj = i === parse_info.length - 1;
    const cls_name = `token stx-${parse_obj.token} ${last_obj ? "last-token" : ""}`;
    parts.push(<span className={cls_name}>
      {convert_text(bad_expr.substring(start, end))}</span>);
    last_end = end;
  });

  return <code className='parse-info'>{parts}</code>;
};

class SyntaxError extends React.Component {
  render() {
    return <div className='error-help'>
      <div className='explanation block'>
        <button className='block-header' onClick={on_header_click}>Explanation</button>
        <div className='content'>This error means that R couldn't understand the {common_tips.syntax} of your program. While reading <b>left-to-right</b> through your program, R found a <code>{this.props.syntax_kind}</code> that R wasn't expecting. The unexpected <code>{this.props.syntax_kind}</code> is in red below.<br></br>
        {this.props.parse_info != null
          ? <ParseInfo {...this.props} />
          : null}
      </div></div>
      <div className='causes block'>
        <button className='block-header' onClick={on_header_click}>Possible causes</button>
        <div className='content'><ol className='cause-list'>
          <li>
            <div><strong>Did you forget a comma or other symbol?</strong></div>
            <div>For example, if you wanted to write <code>f(1, 2)</code> and instead wrote <code>f(1 2)</code>, R would say "unexpected numeric {common_tips.constant}" because R found a 2 when it was expecting a comma.</div>
          </li>
          <li>
            <div><strong>Are your parentheses, quotes, and brackets balanced?</strong></div>
            <div>Every <code>(</code> needs a matching <code>)</code>, similarly for <code>""</code> and <code>[]</code>. For example, if you wanted to write <code>f(1)</code> and instead wrote <span style={{display:"none"}}>(</span><code>f(1))</code>, then R would say "unexpected <code>)</code>" because R didn't find a preceding <code>(</code> to match it.</div>
          </li>
        </ol></div>
      </div>
    </div>;
  }
}

let FileNotFoundError = (props) => {
  return <div className='error-help'>
    <div className='explanation block'>
      <button className='block-header' onClick={on_header_click}>Explanation</button>
      <div>
        You probably tried to open a file, and the file path you gave is incorrect. I think the path you provided was "<code>{props.missing_path[0]}</code>".
       {props.matches.length > 0 ?
        <div>I found a few similarly named files in the same directory. Maybe you meant:
          <ul>
            {props.matches.map((match) =>
      	      <li><code>{match}</code></li>
            )}
          </ul>
        </div>
         : null}
      </div>
    </div>
  </div>;
};

let ClosureNotSubsettableError = ({closure, subset}) => {
  return <div className='error-help'>
    <div className='explanation block'>
      <button className='block-header' onClick={on_header_click}>Explanation</button>
      <div className='content'>
        <span>The code <code>{closure}</code> is an R value of type "closure", which is another name for a function. The only thing R lets you do to a function is call it, e.g. <code>{closure}()</code>, but you tried to use the closure like a dataframe or list. Specifically, the code <code>{subset}</code> is "subsetting" <code>{closure}</code>, i.e. trying to access a subset of fields.</span>
      </div>
    </div>
    <div className='causes block'>
      <button className='block-header' onClick={on_header_click}>Possible causes</button>
      <div className='content'><ol className='cause-list'>
        <li><strong>Did typo your intended variable as <code>{closure}</code>?</strong></li>
        <li><strong>Did you forget to call <code>{closure}</code> before subsetting it?</strong></li>
      </ol></div>
    </div>
  </div>;
}

let GenericError = (props) => {
  return <div className='error-help'>
    <div className='explanation block'>
      <button className='block-header' onClick={on_header_click}>Explanation</button>
      <div className='content'>I haven't been trained to understand this kind of error, sorry. You can at at least check out the StackOverflow links below.</div>
    </div>
  </div>;
};

class App extends React.Component {
  errors = {
    'obj_not_found': NotFoundError,
    'no_function': NotFoundError,
    'missing_path': FileNotFoundError,
    'closure_not_subsettable': ClosureNotSubsettableError,
    'syntax_error': SyntaxError
  }

  constructor(props) {
    super(props);
    this.ws = new WebSocket('ws' + props.socket.replace(/http/, ''));
  }

  show_help(doc) {
    this.ws.send(JSON.stringify({
      command: 'show_help',
      args: doc
    }));
    return false;
  }

  render() {
    return <div className={'App ' + themes[0]}>
      <h1><img id="icon" src="autota_bot.svg" alt="AutoTA robot"></img> What went wrong?</h1>
      {this.props.kind
        ? <div>
          <div className='error-message'>
            <code className='code-error'>{this.props.message}</code>
          </div><br></br>
          {React.createElement(
            this.props.kind in this.errors
              ? this.errors[this.props.kind]
              : GenericError,
            this.props)}
          <div className='block'>
            <button className='block-header' onClick={on_header_click}>StackOverflow questions</button>
            <div className='content'>{this.props.query_explain && this.props.query_explain[0].length > 0
              ? <div>
                For this error, I searched StackOverflow for this query:
                <div><br></br>
                  <code><Tooltip text={this.props.so_query}>
                      <div>Why did I write the query this way? <br></br> {this.props.query_explain}</div>
                  </Tooltip></code>
                </div><br></br>
              </div>
              : <div>I searched this exact error on StackOverflow: </div>}
            {this.props.so_questions.length > 1
              ? <ol>
                {this.props.so_questions.map((q, i) =>
                  <li key={i}><a href={q.href}>{q.title}</a></li>
                )}
              </ol>
              : <i><br />No results found</i>}
          </div></div>
          {this.props.docs[0]
            ? <div className='block'>
              <button className='block-header' onClick={on_header_click}>Documentation</button>
              <div className='content'>I found a few functions around where you got the error. It might help to read their documentation or see examples of how they work. <br></br><br></br>Click below to open R's help menu.
            <ul>
              {this.props.docs.map((doc) =>
                <li>
                  <a href="#" onClick={() => this.show_help(doc)}>
                    <code>{doc.package[0] ? <span>{doc.package}::{doc.name}</span> : doc.name}</code>
                  </a></li>
              )}
            </ul></div>
            </div>
            : null}

        </div>
        : <div>No error yet</div>
      }
    </div>
  }
}

function on_header_click(e) {
  e.target.classList.toggle("active");
  var content = e.target.nextElementSibling;
  if (content.style.maxHeight) {
    content.style.maxHeight = null;
  } else {
    content.style.maxHeight = content.scrollHeight + "px";
  }
}

export default App;

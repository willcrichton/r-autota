import React from 'react';
import ReactTooltip from 'react-tooltip';

import './App.css';

let tooltip_id = 0;
let Tooltip = ({children, text}) => {
  tooltip_id += 1;
  const id = `tooltip${tooltip_id}`;
  return <span className='tooltip' data-tip data-for={id}>
    {text}<sup>?</sup>
    <ReactTooltip effect="solid" id={id}>{children}</ReactTooltip>
  </span>
};

let common_tips = {
  'syntax': (<Tooltip text="syntax">Syntax means the order and kind of characters in a program. For example, we would say <code>f(a, b)</code> is the "syntax" for a function call in R.</Tooltip>),
  'variable': (<Tooltip text="variable">Variable means a name that stands in for a number, string, function, or other R object. Variables are defined by the <code>x &lt;- 1</code> syntax.</Tooltip>)
};

class NotFoundError extends React.Component {
  render() {
    const matches = this.props.matches;
    const packages = this.props.packages;
    return <div className='error-help'>
      <div className='explanation block'>
        <div className='block-header'>Explanation</div>
        <div>This error means you tried to use a {common_tips.variable} called "<code>{this.props.missing_obj}</code>" that R couldn't find.</div>
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

  return <div className='parse-info'>{parts}</div>;
};

class SyntaxError extends React.Component {
  render() {
    return <div className='error-help'>
      <div className='explanation block'>
        <div className='block-header'>Explanation</div>
        <div>This error means that R couldn't understand the {common_tips.syntax} of your program. While reading left-to-right through your program, R found a "<code>{this.props.syntax_kind}</code>" that R wasn't expecting. The unexpected <code>{this.props.syntax_kind}</code> is highlighted in red below.</div>
        {this.props.parse_info != null
          ? <ParseInfo {...this.props} />
          : null}
      </div>
      <div className='causes block'>
        <div className='block-header'>Possible causes</div>
        <ol className='cause-list'>
          <li>
            <div><strong>Did you forget a comma or other symbol?</strong></div>
            <div>For example, if you wanted to write <code>f(1, 2)</code> and instead wrote <code>f(1 2)</code>, R would say "unexpected numeric constant" because R found a 2 when it was expecting a comma.</div>
          </li>
          <li>
            <div><strong>Are your parentheses, quotes, and brackets balanced?</strong></div>
            <div>Every <code>(</code> needs a matching <code>)</code>, similarly for <code>""</code> and <code>[]</code>. For example, if you wanted to write <code>f(1)</code> and instead wrote <span style={{display:"none"}}>(</span>(<code>f(1))</code>, then R would say "unexpected ')'" because R didn&quot;t find a preceding "(" to match it.</div>
          </li>
        </ol>
      </div>
    </div>;
  }
}

let FileNotFoundError = (props) => {
  return <div className='error-help'>
    <div className='explanation block'>
      <div className='block-header'>Explanation</div>
      <div>
        You probably tried to open a file, and the file path you gave is incorrect. I think the path you provided was "<code>{props.missing_path[0]}</code>".
       {props.matches.length > 0 ?
        <div>I found a few similarly named files. Maybe you meant:
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

let GenericError = (props) => {
  return <div className='error-help'>
    <div className='explanation block'>
      <div className='block-header'>Explanation</div>
      <div>I haven't been trained to understand this kind of error, sorry. You can at at least check out the StackOverflow links below.</div>
    </div>
  </div>;
};

class App extends React.Component {
  errors = {
    'obj_not_found': NotFoundError,
    'no_function': NotFoundError,
    'missing_path': FileNotFoundError,
    'syntax_error': SyntaxError
  }

  render() {
    return <div className='App'>
      <h1>Auto TA</h1>
      {this.props.kind
        ? <div>
          <div className='error-message block'>
            <div className='block-header'>Error message</div>
            <pre className='code-error'>{this.props.message}</pre>
          </div>
          {React.createElement(
            this.props.kind in this.errors
              ? this.errors[this.props.kind]
              : GenericError,
            this.props)}
          <div className='block'>
            <div className='block-header'>StackOverflow questions</div>
            {this.props.query_explain
              ? <div>
                For this error, I searched StackOverflow for this query:
                <pre>{this.props.so_query}</pre>
                <div>Why did I write the query this way? {this.props.query_explain}</div>
              </div>
              : <div>I searched the exact error on StackOverflow and the results below.</div>}
            {this.props.so_questions.length > 1
              ? <ol>
                {this.props.so_questions.map((q, i) =>
                  <li key={i}><a href={q[1]}>{q[0]}</a></li>
                )}
              </ol>
              : <i><br />No results found</i>}
          </div>
        </div>
        : <div>No error yet</div>
      }
    </div>
  }
}

export default App;

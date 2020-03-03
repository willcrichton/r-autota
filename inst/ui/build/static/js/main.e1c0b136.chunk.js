(this.webpackJsonpui=this.webpackJsonpui||[]).push([[0],{14:function(e,a,t){},15:function(e,a,t){},16:function(e,a,t){"use strict";t.r(a);var n=t(0),l=t.n(n),r=t(7),o=t.n(r),c=(t(14),t(1)),s=t(2),i=t(4),u=t(3),m=t(5),d=t(8),h=(t(15),0),p=function(e){var a=e.children,t=e.text,n="tooltip".concat(h+=1);return l.a.createElement("span",{className:"tooltip","data-tip":!0,"data-for":n},t,l.a.createElement("sup",null,"?"),l.a.createElement(d.a,{effect:"solid",id:n},a))},E={syntax:l.a.createElement(p,{text:"syntax"},"Syntax means the order and kind of characters in a program. For example, we would say ",l.a.createElement("code",null,"f(a, b)"),' is the "syntax" for a function call in R.'),variable:l.a.createElement(p,{text:"variable"},"Variable means a name that stands in for a number, string, function, or other R object. Variables are defined by the ",l.a.createElement("code",null,"x <- 1")," syntax.")},f=function(e){function a(){return Object(c.a)(this,a),Object(i.a)(this,Object(u.a)(a).apply(this,arguments))}return Object(m.a)(a,e),Object(s.a)(a,[{key:"render",value:function(){var e=this.props,a=e.matches,t=e.packages,n=e.user_defined;return l.a.createElement("div",{className:"error-help"},l.a.createElement("div",{className:"explanation block"},l.a.createElement("div",{className:"block-header"},"Explanation"),l.a.createElement("div",null,"This error means you tried to use a ",E.variable,' called "',l.a.createElement("code",null,this.props.missing_obj),"\" that R couldn't find.")),l.a.createElement("div",{className:"causes block"},l.a.createElement("div",{className:"block-header"},"Possible causes"),l.a.createElement("ol",{className:"cause-list"},l.a.createElement("li",null,l.a.createElement("div",null,l.a.createElement("strong",null,"Did you make a typo writing the name?")),a[0]?l.a.createElement("div",null,l.a.createElement("span",null,"I found some similar names in your program that you maybe meant:"),l.a.createElement("ul",null,a.map((function(e){return l.a.createElement("li",null,l.a.createElement("code",null,e))})))):null),l.a.createElement("li",null,l.a.createElement("span",null,l.a.createElement("strong",null,"Did you forget to import a package?")," \xa0"),t[0]?l.a.createElement("div",null,l.a.createElement("span",null,"I found the name you're looking for in the following packages that are installed but not imported:"),l.a.createElement("ul",null,t.map((function(e){return l.a.createElement("li",null,l.a.createElement("code",null,e))})))):null),l.a.createElement("li",null,l.a.createElement("span",null,l.a.createElement("strong",null,"Did you forget to execute part of your script?")),n[0]?l.a.createElement("div",null,l.a.createElement("div",null,"I found that line ",n[0].line_number," of file ",l.a.createElement("code",null,n[0].path)," defines the name you're trying to use. Did you forget to run this line?"),l.a.createElement("pre",null,n[0].line_text)):null))))}}]),a}(l.a.Component),b=function(e){var a=e.replace(/ /g,"&nbsp;").replace(/\n/g,"<br />");return l.a.createElement("span",{dangerouslySetInnerHTML:{__html:a}})},v=function(e){var a=e.bad_expr,t=e.parse_info;a=a[0];for(var n={},r=0,o=0,c=0;c<a.length;++c)"\n"===a.charAt(c)?(r+=1,o=0):(n[r]||(n[r]={}),n[r][o]=c,o+=1);var s=[],i=0;return t.forEach((function(e,r){var o=n[e.line1-1][e.col1-1],c=n[e.line2-1][e.col2-1]+1;s.push(l.a.createElement("span",null,b(a.substring(i,o))));var u=r===t.length-1,m="token stx-".concat(e.token," ").concat(u?"last-token":"");s.push(l.a.createElement("span",{className:m},b(a.substring(o,c)))),i=c})),l.a.createElement("div",{className:"parse-info"},s)},y=function(e){function a(){return Object(c.a)(this,a),Object(i.a)(this,Object(u.a)(a).apply(this,arguments))}return Object(m.a)(a,e),Object(s.a)(a,[{key:"render",value:function(){return l.a.createElement("div",{className:"error-help"},l.a.createElement("div",{className:"explanation block"},l.a.createElement("div",{className:"block-header"},"Explanation"),l.a.createElement("div",null,"This error means that R couldn't understand the ",E.syntax,' of your program. While reading left-to-right through your program, R found a "',l.a.createElement("code",null,this.props.syntax_kind),"\" that R wasn't expecting. The unexpected ",l.a.createElement("code",null,this.props.syntax_kind)," is highlighted in red below."),null!=this.props.parse_info?l.a.createElement(v,this.props):null),l.a.createElement("div",{className:"causes block"},l.a.createElement("div",{className:"block-header"},"Possible causes"),l.a.createElement("ol",{className:"cause-list"},l.a.createElement("li",null,l.a.createElement("div",null,l.a.createElement("strong",null,"Did you forget a comma or other symbol?")),l.a.createElement("div",null,"For example, if you wanted to write ",l.a.createElement("code",null,"f(1, 2)")," and instead wrote ",l.a.createElement("code",null,"f(1 2)"),', R would say "unexpected numeric constant" because R found a 2 when it was expecting a comma.')),l.a.createElement("li",null,l.a.createElement("div",null,l.a.createElement("strong",null,"Are your parentheses, quotes, and brackets balanced?")),l.a.createElement("div",null,"Every ",l.a.createElement("code",null,"(")," needs a matching ",l.a.createElement("code",null,")"),", similarly for ",l.a.createElement("code",null,'""')," and ",l.a.createElement("code",null,"[]"),". For example, if you wanted to write ",l.a.createElement("code",null,"f(1)")," and instead wrote ",l.a.createElement("span",{style:{display:"none"}},"("),l.a.createElement("code",null,"f(1))"),', then R would say "unexpected \')\'" because R didn"t find a preceding "(" to match it.')))))}}]),a}(l.a.Component),g=function(e){return l.a.createElement("div",{className:"error-help"},l.a.createElement("div",{className:"explanation block"},l.a.createElement("div",{className:"block-header"},"Explanation"),l.a.createElement("div",null,'You probably tried to open a file, and the file path you gave is incorrect. I think the path you provided was "',l.a.createElement("code",null,e.missing_path[0]),'".',e.matches.length>0?l.a.createElement("div",null,"I found a few similarly named files in the same directory. Maybe you meant:",l.a.createElement("ul",null,e.matches.map((function(e){return l.a.createElement("li",null,l.a.createElement("code",null,e))})))):null)))},k=function(e){var a=e.closure,t=e.subset;return l.a.createElement("div",{className:"error-help"},l.a.createElement("div",{className:"explanation block"},l.a.createElement("div",{className:"block-header"},"Explanation"),l.a.createElement("div",null,l.a.createElement("span",null,"The code ",l.a.createElement("code",null,a),' is an R value of type "closure", which is another name for a function. The only thing R lets you do to a function is call it, e.g. ',l.a.createElement("code",null,a,"()"),", but you tried to use the closure like a dataframe or list. Specifically, the code ",l.a.createElement("code",null,t),' is "subsetting" ',l.a.createElement("code",null,a),", i.e. trying to access a subset of fields."))),l.a.createElement("div",{className:"causes block"},l.a.createElement("div",{className:"block-header"},"Possible causes"),l.a.createElement("ol",{className:"cause-list"},l.a.createElement("li",null,l.a.createElement("strong",null,"Did typo your intended variable as ",l.a.createElement("code",null,a),"?")),l.a.createElement("li",null,l.a.createElement("strong",null,"Did you forget to call ",l.a.createElement("code",null,a)," before subsetting it?")))))},w=function(e){return l.a.createElement("div",{className:"error-help"},l.a.createElement("div",{className:"explanation block"},l.a.createElement("div",{className:"block-header"},"Explanation"),l.a.createElement("div",null,"I haven't been trained to understand this kind of error, sorry. You can at at least check out the StackOverflow links below.")))},x=function(e){function a(e){var t;return Object(c.a)(this,a),(t=Object(i.a)(this,Object(u.a)(a).call(this,e))).errors={obj_not_found:f,no_function:f,missing_path:g,closure_not_subsettable:k,syntax_error:y},t.ws=new WebSocket("ws"+e.socket.replace(/https?/,"")),t}return Object(m.a)(a,e),Object(s.a)(a,[{key:"show_help",value:function(e){return this.ws.send(JSON.stringify({command:"show_help",args:e})),!1}},{key:"render",value:function(){var e=this;return l.a.createElement("div",{className:"App"},l.a.createElement("h1",null,"Auto TA"),this.props.kind?l.a.createElement("div",null,l.a.createElement("div",{className:"error-message block"},l.a.createElement("div",{className:"block-header"},"Error message"),l.a.createElement("pre",{className:"code-error"},this.props.message)),l.a.createElement(this.props.kind in this.errors?this.errors[this.props.kind]:w,this.props),l.a.createElement("div",{className:"block"},l.a.createElement("div",{className:"block-header"},"StackOverflow questions"),this.props.query_explain&&this.props.query_explain[0].length>0?l.a.createElement("div",null,"For this error, I searched StackOverflow for this query:",l.a.createElement("pre",null,this.props.so_query),l.a.createElement("div",null,"Why did I write the query this way? ",this.props.query_explain)):l.a.createElement("div",null,"I searched the exact error on StackOverflow and the results below."),this.props.so_questions.length>1?l.a.createElement("ol",null,this.props.so_questions.map((function(e,a){return l.a.createElement("li",{key:a},l.a.createElement("a",{href:e.href},e.title))}))):l.a.createElement("i",null,l.a.createElement("br",null),"No results found")),this.props.docs[0]?l.a.createElement("div",{className:"block"},l.a.createElement("div",{className:"block-header"},"Documentation"),l.a.createElement("div",null,"I found a few functions around where you got the error. It might help to read their documentation or see examples of how they work. Click below to open R's help menu."),l.a.createElement("ul",null,this.props.docs.map((function(a){return l.a.createElement("li",null,l.a.createElement("a",{href:"#",onClick:function(){return e.show_help(a)}},l.a.createElement("code",null,a.package[0]?l.a.createElement("span",null,a.package,"::",a.name):a.name)))})))):null):l.a.createElement("div",null,"No error yet"))}}]),a}(l.a.Component);Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));var N=new URL(window.location.href),_=decodeURIComponent(N.searchParams.get("socket")),O=N.searchParams.get("q");if(null!=O){var j=O.replace(/\./g,"+").replace(/_/g,"/");O=JSON.parse(atob(j))}else O={};o.a.render(l.a.createElement(x,Object.assign({socket:_},O)),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()})).catch((function(e){console.error(e.message)}))},9:function(e,a,t){e.exports=t(16)}},[[9,1,2]]]);
//# sourceMappingURL=main.e1c0b136.chunk.js.map
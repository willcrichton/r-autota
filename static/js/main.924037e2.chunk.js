(this.webpackJsonpui=this.webpackJsonpui||[]).push([[0],[,,,,,,,,function(e,a,t){e.exports=t(16)},,,,,function(e,a,t){},function(e,a,t){e.exports=t.p+"static/media/logo.5d5d9eef.svg"},function(e,a,t){},function(e,a,t){"use strict";t.r(a);var n=t(0),l=t.n(n),r=t(7),o=t.n(r),c=(t(13),t(1)),s=t(2),i=t(4),u=t(3),m=t(5),d=(t(14),t(15),function(e){function a(){return Object(c.a)(this,a),Object(i.a)(this,Object(u.a)(a).apply(this,arguments))}return Object(m.a)(a,e),Object(s.a)(a,[{key:"render",value:function(){var e=this.props.matches,a=this.props.packages;return l.a.createElement("div",{className:"error-help"},l.a.createElement("div",{className:"explanation block"},l.a.createElement("div",{className:"block-header"},"Explanation"),l.a.createElement("div",null,'This error means you tried to use a variable called "',l.a.createElement("code",null,this.props.missing_obj),"\" that R couldn't find.")),l.a.createElement("div",{className:"causes block"},l.a.createElement("div",{className:"block-header"},"Possible causes"),l.a.createElement("ol",{className:"cause-list"},l.a.createElement("li",null,l.a.createElement("div",null,l.a.createElement("strong",null,"Did you make a typo writing the name?")),e.length>0?l.a.createElement("div",null,l.a.createElement("span",null,"I found some similar names in your program that you maybe meant:"),l.a.createElement("ul",null,e.map((function(e){return l.a.createElement("li",null,l.a.createElement("code",null,e))})))):null),l.a.createElement("li",null,l.a.createElement("span",null,l.a.createElement("strong",null,"Did you forget to import a package?")," \xa0"),a.length>0?l.a.createElement("div",null,l.a.createElement("span",null,"I found the name you're looking for in the following packages that are installed but not imported:"),l.a.createElement("ul",null,a.map((function(e){return l.a.createElement("li",null,l.a.createElement("code",null,e))})))):null))))}}]),a}(l.a.Component)),p=function(e){var a=e.replace(/ /g,"&nbsp;").replace(/\n/g,"<br />");return l.a.createElement("span",{dangerouslySetInnerHTML:{__html:a}})},h=function(e){var a=e.bad_expr,t=e.parse_info;a=a[0];for(var n={},r=0,o=0,c=0;c<a.length;++c)"\n"==a.charAt(c)?(r+=1,o=0):(n[r]||(n[r]={}),n[r][o]=c,o+=1);var s=[],i=0;return t.forEach((function(e,r){var o=n[e.line1-1][e.col1-1],c=n[e.line2-1][e.col2-1]+1;console.log(o,c,e.token),console.log(a.substring(i,o)),s.push(l.a.createElement("span",null,p(a.substring(i,o))));var u=r==t.length-1,m="token stx-".concat(e.token," ").concat(u?"last-token":"");s.push(l.a.createElement("span",{className:m},p(a.substring(o,c)))),i=c})),l.a.createElement("div",{className:"parse-info"},s)},E=function(e){function a(){return Object(c.a)(this,a),Object(i.a)(this,Object(u.a)(a).apply(this,arguments))}return Object(m.a)(a,e),Object(s.a)(a,[{key:"render",value:function(){return l.a.createElement("div",{className:"error-help"},l.a.createElement("div",{className:"explanation block"},l.a.createElement("div",{className:"block-header"},"Explanation"),l.a.createElement("div",null,"This error means that R couldn't understand the syntax of your program. While reading left-to-right through your program, R found a \"",l.a.createElement("code",null,this.props.syntax_kind),"\" that R wasn't expecting. The unexpected ",l.a.createElement("code",null,this.props.syntax_kind)," is highlighted in red below."),null!=this.props.parse_info?l.a.createElement(h,this.props):null),l.a.createElement("div",{className:"causes block"},l.a.createElement("div",{className:"block-header"},"Possible causes"),l.a.createElement("ol",{className:"cause-list"},l.a.createElement("li",null,l.a.createElement("div",null,l.a.createElement("strong",null,"Did you forget a comma or other symbol?")),l.a.createElement("div",null,"For example, if you wanted to write ",l.a.createElement("code",null,"f(1, 2)")," and instead wrote ",l.a.createElement("code",null,"f(1 2)"),', R would say "unexpected numeric constant" because R found a 2 when it was expecting a comma.')),l.a.createElement("li",null,l.a.createElement("div",null,l.a.createElement("strong",null,"Are your parentheses, quotes, and brackets balanced?")),l.a.createElement("div",null,"Every ",l.a.createElement("code",null,"(")," needs a matching ",l.a.createElement("code",null,")"),", similarly for ",l.a.createElement("code",null,'""')," and ",l.a.createElement("code",null,"[]"),". For example, if you wanted to write ",l.a.createElement("code",null,"f(1)")," and instead wrote ",l.a.createElement("span",{style:{display:"none"}},"("),"(",l.a.createElement("code",null,"f(1))"),', then R would say "unexpected \')\'" because R didn"t find a preceding "(" to match it.')))))}}]),a}(l.a.Component),f=function(e){return l.a.createElement("div",{className:"error-help"},l.a.createElement("div",{className:"explanation block"},l.a.createElement("div",{className:"block-header"},"Explanation"),l.a.createElement("div",null,"I haven't been trained to understand this kind of error, sorry. You can at at least check out the StackOverflow links below.")))},v=function(e){function a(){var e,t;Object(c.a)(this,a);for(var n=arguments.length,l=new Array(n),r=0;r<n;r++)l[r]=arguments[r];return(t=Object(i.a)(this,(e=Object(u.a)(a)).call.apply(e,[this].concat(l)))).errors={obj_not_found:d,no_function:d,syntax_error:E},t}return Object(m.a)(a,e),Object(s.a)(a,[{key:"render",value:function(){return l.a.createElement("div",{className:"App"},l.a.createElement("h1",null,"Auto TA"),this.props.kind?l.a.createElement("div",null,l.a.createElement("div",{className:"error-message block"},l.a.createElement("div",{className:"block-header"},"Error message"),l.a.createElement("pre",{className:"code-error"},this.props.message)),l.a.createElement(this.props.kind in this.errors?this.errors[this.props.kind]:f,this.props),l.a.createElement("div",{className:"block"},l.a.createElement("div",{className:"block-header"},"StackOverflow questions"),l.a.createElement("div",null,"These are the top 5 results on StackOverflow for the query:"),l.a.createElement("pre",null,this.props.so_query),l.a.createElement("ol",null,this.props.so_questions.map((function(e,a){return l.a.createElement("li",{key:a},l.a.createElement("a",{href:e[1]},e[0]))}))))):l.a.createElement("div",null,"No error yet"))}}]),a}(l.a.Component);Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));var b=window.location.href,g=new URL(b).searchParams.get("q");g=null!=g?JSON.parse(decodeURIComponent(g)):{},o.a.render(l.a.createElement(v,g),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()})).catch((function(e){console.error(e.message)}))}],[[8,1,2]]]);
//# sourceMappingURL=main.924037e2.chunk.js.map
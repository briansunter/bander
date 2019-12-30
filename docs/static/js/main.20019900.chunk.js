(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{10:function(t,e,n){t.exports=n(21)},15:function(t,e,n){},17:function(t,e,n){},21:function(t,e,n){"use strict";n.r(e);var r=n(0),o=n.n(r),i=n(4),a=n.n(i),c=(n(15),n(1)),s=n(5),u=n(6),h=n(8),d=n(7),l=n(9),f=(n(17),n(2));function p(t,e){return f.every(e,function(e){return f.isMatch(t,e)})}function m(t,e){return!e.canSee||e.canSee(t)}function w(t,e){return f.mapValues(f.groupBy(e,"id"),function(t){return t[0]})[t.currentLocation]}function g(t,e){return"You're in ".concat(e.id," \n ").concat(e.description(t)," \n ").concat(function(t,e){return e.filter(function(e){return m(t,e)}).map(function(e){return"".concat(e.id," : ").concat(e.description(t))}).join("\n")}(t,e.actionHooks))}var b=[{id:"introArea",description:function(t){return"You're in the intro!"},actionHooks:[{id:"south",requirements:[{currentLocation:"introArea"}],newState:{currentLocation:"southOfIntro"},description:function(t){return"There's a stone path going south"},actionDescription:function(t){return"You walk south down the stone path"}}]},{id:"southOfIntro",description:function(t){return"You're in a nice park to the south"},actionHooks:[{id:"north",requirements:[{currentLocation:"southOfIntro"}],newState:{currentLocation:"introArea"},description:function(t){return"There's a stone path going north"},actionDescription:function(t){return"You walk north up the stone path"}},{id:"sit on bench",requirements:[{currentLocation:"southOfIntro",benchQuestStarted:!0}],canSee:function(t){return!0===t.benchQuestStarted},newState:{currentLocation:"southOfIntro",benchQuestCompleted:!0},description:function(t){return"The bench has a strange glow..."},actionDescription:function(t){return"You sit on the bench and feel a surge of energy."}},{id:"sit on bench",requirements:[{currentLocation:"southOfIntro",benchQuestStarted:!1}],canSee:function(t){return!1===t.benchQuestStarted},newState:{currentLocation:"southOfIntro"},description:function(t){return"Theres a nice bench"},actionDescription:function(t){return"You sit on the bench"}},{id:"west",requirements:[{currentLocation:"southOfIntro"}],newState:{currentLocation:"introMarket"},description:function(t){return"There's a dirt path west to the market"},actionDescription:function(t){return"You walk along the dirt path to the market"}}]},{id:"introMarket",description:function(t){return"You're in a bustling market"},actionHooks:[{id:"talk intro guy",requirements:[{currentLocation:"introMarket"}],newState:function(t){return t.benchQuestStarted||(t.benchQuestStarted=!0),t},description:function(t){return t.benchQuestStarted?"Talk to him after sitting on bench":"This guy looks like he has a quest"},actionDescription:function(t){return t.benchQuestCompleted?"Congrats on finishing your first quest!":"You talk to the intro guy. he says sit on the bench"}},{id:"east",requirements:[{currentLocation:"introMarket"}],newState:{currentLocation:"southOfIntro"},description:function(t){return"There's a dirt path east leading back to the park"},actionDescription:function(t){return"You walk east along the path back to the park."}},{id:"enter sword shop",requirements:[{currentLocation:"introMarket"}],newState:{currentLocation:"swordShop"},description:function(t){return"A shop where you can buy swords"},actionDescription:function(t){return"You enter the sword shop"}}]},{id:"swordShop",description:function(t){return"Inside a shop filled with pointy things"},actionHooks:[{id:"back to market",requirements:[{currentLocation:"swordShop"}],newState:{currentLocation:"introMarket"},description:function(t){return"Leave the sword shop"},actionDescription:function(t){return"you leave the sword shop"}}]}],k=function(t){return o.a.createElement("button",{onClick:function(){return t.handleGameAction(t.id)},disabled:t.disabled},o.a.createElement("h2",null," ",t.id," "),o.a.createElement("p",null," ",t.description," "))},S=function(t){function e(){var t,n;Object(s.a)(this,e);for(var r=arguments.length,i=new Array(r),a=0;a<r;a++)i[a]=arguments[a];return(n=Object(h.a)(this,(t=Object(d.a)(e)).call.apply(t,[this].concat(i)))).messagesEnd=o.a.createRef(),n.state={gameState:{currentLocation:"introArea",benchQuestStarted:!1,benchQuestCompleted:!1},messages:[]},n.scrollToBottom=function(){n.messagesEnd&&n.messagesEnd.current&&n.messagesEnd.current.scrollIntoView&&n.messagesEnd.current.scrollIntoView({behavior:"smooth"})},n.handleGameAction=function(t){var e=w(n.state.gameState,b),r=function(t,e,n){var r=n.filter(function(t){return t.id===e}).filter(function(e){return m(t,e)}),o=t,i=new Array,a=!0,s=!1,u=void 0;try{for(var h,d=r[Symbol.iterator]();!(a=(h=d.next()).done);a=!0){var l=h.value,f=void 0;f="function"===typeof l.newState?l.newState(o):l.newState,p(o,l.requirements)&&(o=Object(c.a)({},o,f),i.push([l.actionDescription(o),o]))}}catch(w){s=!0,u=w}finally{try{a||null==d.return||d.return()}finally{if(s)throw u}}return i}(n.state.gameState,t,e.actionHooks),o=n.state.gameState,i=!0,a=!1,s=void 0;try{for(var u,h=r[Symbol.iterator]();!(i=(u=h.next()).done);i=!0){var d=u.value;n.state.messages.push(d[0]),o=d[1]}}catch(f){a=!0,s=f}finally{try{i||null==h.return||h.return()}finally{if(a)throw s}}var l=g(o,w(o,b));n.state.messages.push(l),n.setState(Object(c.a)({},n.state,{gameState:Object(c.a)({},n.state.gameState,o)}))},n}return Object(l.a)(e,t),Object(u.a)(e,[{key:"componentWillMount",value:function(){var t=g(this.state.gameState,w(this.state.gameState,b));this.state.messages.push(t)}},{key:"componentDidMount",value:function(){this.scrollToBottom()}},{key:"componentDidUpdate",value:function(){this.scrollToBottom()}},{key:"actions",value:function(){var t,e=w(this.state.gameState,b);return t=this.state.gameState,e.actionHooks.filter(function(e){return m(t,e)}).map(function(e){return{id:e.id,description:e.description(t),enabled:p(t,e.requirements)}})}},{key:"render",value:function(){var t=this;return o.a.createElement("div",{className:"App"},o.a.createElement("div",{className:"Messages"},o.a.createElement("ul",null,this.state.messages.map(function(t){return o.a.createElement("li",null," ",t)}),o.a.createElement("div",{ref:this.messagesEnd}))),o.a.createElement("div",{className:"Actions"},this.actions().map(function(e){return o.a.createElement(k,{handleGameAction:t.handleGameAction,disabled:!e.enabled,id:e.id,description:e.description})})))}}]),e}(r.Component);Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));a.a.render(o.a.createElement(S,null),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then(function(t){t.unregister()})}},[[10,2,1]]]);
//# sourceMappingURL=main.20019900.chunk.js.map
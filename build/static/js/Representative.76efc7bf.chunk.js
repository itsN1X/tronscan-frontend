(window.webpackJsonp=window.webpackJsonp||[]).push([[44],{1346:function(e,t){e.exports="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACoAAAAqCAQAAABvygHQAAAClUlEQVR4AcWXRXLkMBSGJ7uhdV8gN8pR+gKhU6gxzMzMzMzMKAX2+cbVdqlJ7nTANf43gqq/nt7/yD/+w/eUq/yyUg2rXfkqX9WuGrZ2/qfcT9K9+lSRXJe4YF0Vvfo+RMhflW9Zxjt4Vfn8zZJS5akbSXZQNyrvfRtzVL56k2QP9abyyclE+UvVST4OVccvdys15cdpXay1xOHzUPlmeRxfttHCCCsc8/Ax3+alB5FWfAHhIEgtPcyww3VWkcBf16ffEUYQYZ4VRmmlFGGhjDZrt8IJj9m54NWXHOr9lNNJgAVnf8020/RQQxBBiDr6ODGmQ0KWqeLky0MEe0wgGEyx64Fj5gkhiHJosrVIk6bneB09SNYJ08xt0s0ldUTZoo0Ie4aaoCtR2hULhGJkx5RTmfDUA0qp4Txmcychi1ymwKlgyp96YYs16/izkQibSAsrhGjTlt/RSJC1VAf47cdXmpTsp0b7sQ/BNKMIRrhgkym6qSaAsNCOTEalbemwvTWIpXezMYogkRhRhUU1xjJlFvVtqqXDNumuvTWKpdFGOQPMs6dpuolylq7/boxUx6iLWDZqGU26nSTAjjFWbdIXM+mtI5aNKPNIjQ2E3qfgxfB8s1h3CDb1+TFhBtxSddcglFmsYwTHOmnLaXKtAGrYPaS0J22xNhHcOQHWSAU3SDdUGoLfLNY8Ueekj4i22QTlT0lTs1hzSEapteNV+9YNT7mGgmIWqzuWOdsEmEJmwnq89BVJMovVwBCnRGwPZ4AqMhZps1iljFNFvblrmYt05k5qF+UI5Vx9rKPqxuciliDE4Ucbn27RLmIJVj/eojO74JCxjw8THo49ngxoHo2SHg29no3n+kei+OM/Ep7+8njw/QOnF3WHklwUswAAAABJRU5ErkJggg=="},3432:function(e,t,a){"use strict";a.r(t);var n=a(38),r=a.n(n),c=a(83),s=a(2),o=a.n(s),i=a(4),l=a(30),m=a(14),d=a(15),u=a(22),p=a(21),g=a(23),b=a(0),h=a.n(b),f=a(81),v=a(17),E=a(33),y=a(13),O=a(3),N=a(3318),x=a.n(N),j=a(18),w=a.n(j),k=a(3396),A=a.n(k),P=a(1714),S=a(60),T=a(11),U=a(3400),R=a.n(U),G=a(89),V=a.n(G);function q(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),a.push.apply(a,n)}return a}function C(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?q(a,!0).forEach(function(t){Object(l.a)(e,t,a[t])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):q(a).forEach(function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))})}return e}var D=function(e){function t(){var e;return Object(m.a)(this,t),(e=Object(u.a)(this,Object(p.a)(t).call(this))).scrollTo=function(e){e.preventDefault(),e.stopPropagation(),V()("html, body").animate({scrollTop:V()(V()(e.target).closest("a").attr("href")).offset().top-15},500)},e.renderSidebar=function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},n=e.state,r=n.address,c=n.files,s=n.sections,o=a(1346);return h.a.createElement("div",{style:C({},t)},h.a.createElement("div",{className:"card font-weight-bold mb-2"},h.a.createElement("img",{className:"card-img-top",src:c.logo,onError:function(e){e.target.onerror=null,e.target.src=o}}),h.a.createElement(A.a,{items:s.map(function(e){return e.id}),className:"list-group list-group-flush",currentClassName:"is-current"},s.map(function(t){return h.a.createElement("a",{key:t.id,className:"list-group-item",href:"#"+t.id,onClick:e.scrollTo},t.name)}),h.a.createElement(v.d,{className:" list-group-item",url:r.representative.url},"Website"))),h.a.createElement(S.a,{className:"btn btn-secondary btn-block mb-2",to:"/sr/votes"},h.a.createElement("i",{className:"fa fa-arrow-left mr-2"}),Object(O.c)("go_to_votelist")))},e.state={loading:!0,body:null,address:null,files:null,sections:[]},e}return Object(g.a)(t,e),Object(d.a)(t,[{key:"componentDidMount",value:function(){var e=this.props.match;this.loadAddress(e.params.id)}},{key:"componentDidUpdate",value:function(e){var t=this.props.match;t.params.id!==e.match.params.id&&this.loadAddress(t.params.id),e.activeLanguage!==this.props.activeLanguage&&this.reloadPages()}},{key:"getAddress",value:function(){return this.props.match.params.id}},{key:"loadPage",value:function(){var e=Object(i.a)(o.a.mark(function e(t){return o.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,e.next=3,w.a.get(t);case 3:return e.abrupt("return",e.sent);case 6:return e.prev=6,e.t0=e.catch(0),e.abrupt("return",{});case 9:case"end":return e.stop()}},e,null,[[0,6]])}));return function(t){return e.apply(this,arguments)}}()},{key:"loadPages",value:function(){var e=Object(i.a)(o.a.mark(function e(t){var a,n,r,s,i,l,m,d,u,p=arguments;return o.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return a=p.length>1&&void 0!==p[1]?p[1]:"en",n="https://raw.githubusercontent.com/".concat(t,"/master"),"en"!==a&&(n+="/pages/".concat(a)),e.next=5,Promise.all([this.loadPage("".concat(n,"/INTRO.md")),this.loadPage("".concat(n,"/COMMUNITY_PLAN.md")),this.loadPage("".concat(n,"/TEAM.md")),this.loadPage("".concat(n,"/BUDGET_EXPENSES.md")),this.loadPage("".concat(n,"/SERVER_CONFIGURATION.md"))]);case 5:return r=e.sent,s=Object(c.a)(r,5),i=s[0].data,l=s[1].data,m=s[2].data,d=s[3].data,u=s[4].data,e.abrupt("return",{intro:i,communityPlan:l,team:m,budgetExpenses:d,serverConfiguration:u});case 13:case"end":return e.stop()}},e,this)}));return function(t){return e.apply(this,arguments)}}()},{key:"loadGithubData",value:function(){var e=Object(i.a)(o.a.mark(function e(t){var a,n,s,i,l,m,d,u,p,g,b,f,v,E,y;return o.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return a=this.props.activeLanguage,n="https://raw.githubusercontent.com/".concat(t,"/master"),e.next=4,this.loadPages(t);case 4:if(s=e.sent,"en"===a){e.next=10;break}return e.next=8,this.loadPages(t,a);case 8:for(i=e.sent,l=0,m=Object.entries(i);l<m.length;l++)d=m[l],u=Object(c.a)(d,2),p=u[0],g=u[1],""!==r()(g)&&(s[p]=g);case 10:b=s.intro,f=s.communityPlan,v=s.team,E=s.budgetExpenses,y=s.serverConfiguration,this.setState({url:n,files:{logo:n+"/logo.png",banner:n+"/banner.png"},sections:[{name:Object(O.c)("intro"),id:"intro",content:h.a.createElement(x.a,{source:b})},{name:Object(O.c)("team"),id:"team",content:h.a.createElement(x.a,{source:v})},{name:Object(O.c)("community_plan"),id:"community-plan",content:h.a.createElement(x.a,{source:f})},{name:Object(O.c)("server_configuration"),id:"server-configuration",content:h.a.createElement(x.a,{source:y})},{name:Object(O.c)("budget_expenses"),id:"budget-expenses",content:h.a.createElement(x.a,{source:E})}]});case 12:case"end":return e.stop()}},e,this)}));return function(t){return e.apply(this,arguments)}}()},{key:"reloadPages",value:function(){var e=Object(i.a)(o.a.mark(function e(){var t;return o.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,y.a.getSuperRepresentative(this.getAddress());case 2:return t=e.sent,e.next=5,this.loadGithubData(t.data.githubLink);case 5:case"end":return e.stop()}},e,this)}));return function(){return e.apply(this,arguments)}}()},{key:"loadAddress",value:function(){var e=Object(i.a)(o.a.mark(function e(t){var a;return o.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return this.setState({loading:!0,body:null,address:null,files:null}),e.prev=1,e.next=4,y.a.getAddress(t);case 4:return a=e.sent,e.next=7,this.reloadPages();case 7:this.setState({loading:!1,address:a}),e.next=13;break;case 10:e.prev=10,e.t0=e.catch(1),this.setState({body:h.a.createElement("main",{className:"container header-overlap"},h.a.createElement("div",{className:"card text-center"},h.a.createElement("div",{className:"card-body"},h.a.createElement(T.a,{color:"warning"},Object(O.c)("unable_load_representatives_page_message"))),h.a.createElement("p",null,h.a.createElement(S.a,{to:"/sr/votes",className:"btn btn-primary"},"Go Back"))))});case 13:case"end":return e.stop()}},e,this,[[1,10]])}));return function(t){return e.apply(this,arguments)}}()},{key:"render",value:function(){var e=this,t=this.state,a=t.address,n=t.loading,r=t.files,c=t.sections,s=t.body;return s||(a?a.representative.enabled?h.a.createElement("main",{className:"container header-overlap representative-landing-page"},h.a.createElement(P.StickyContainer,{className:"row"},h.a.createElement("div",{className:"col-md-3"},h.a.createElement(R.a,{minWidth:768},h.a.createElement(P.Sticky,null,function(t){var a=t.style,n=t.isSticky;return e.renderSidebar(C({},a,{},n?{top:15}:{}))})),h.a.createElement(R.a,{maxWidth:768},this.renderSidebar())),h.a.createElement("div",{className:"col-md-9 representative-content"},n?h.a.createElement("div",{className:"card"},h.a.createElement(f.b,null,Object(O.c)("loading_representative")," ",a.address)):h.a.createElement(b.Fragment,null,h.a.createElement("div",{className:"card"},a.representative.enabled&&h.a.createElement("div",{className:"card-header text-center bg-info font-weight-bold text-white"},a.name||"Representative"),h.a.createElement("div",{className:"card-body text-center"},h.a.createElement("img",{src:r.banner,style:J.image}))),c.map(function(e){return h.a.createElement("div",{className:"card mt-3"},h.a.createElement("a",{id:e.id}),h.a.createElement("div",{className:"card-header bg-info text-center text-white font-weight-bold"},e.name),h.a.createElement("div",{className:"card-body"},e.content))}))))):h.a.createElement("main",{className:"container header-overlap"},h.a.createElement("div",{className:"card text-center"},h.a.createElement("div",{className:"card-body"},h.a.createElement(T.a,{color:"warning"},Object(O.c)("address_not_super_representative"))),h.a.createElement("p",null,h.a.createElement(S.a,{to:"/votes",className:"btn btn-primary"},"Go Back")))):h.a.createElement("main",{className:"container header-overlap"},h.a.createElement("div",{className:"card text-center"},h.a.createElement(f.b,null,Object(O.c)("loading_representatives")))))}}]),t}(h.a.Component),J={image:{maxWidth:"100%",maxHeight:400}};t.default=Object(E.connect)(function(e){return{activeLanguage:e.app.activeLanguage}},{})(D)}}]);
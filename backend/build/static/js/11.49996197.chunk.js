(this["webpackJsonpclimb-presale-fe"]=this["webpackJsonpclimb-presale-fe"]||[]).push([[11],{434:function(e,t,a){"use strict";var n=a(13),i=a(25),s=(a(0),a(6)),r=a(241),o=a(475),c=(a(244),a(1)),l=Object(r.a)((function(){return{root:{width:"100%",height:"100%"},dBlock:{display:"block"}}})),d=function(e){var t=e.src,a=e.srcSet,r=e.alt,d=e.lazy,b=e.lazyProps,u=e.className,j=Object(i.a)(e,["src","srcSet","alt","lazy","lazyProps","className"]),p=l();return d?Object(c.jsx)(o.LazyLoadImage,Object(n.a)(Object(n.a)({className:Object(s.a)("image",p.root,p.dBlock,u),alt:r,src:t,srcSet:a,effect:"opacity"},b),j)):Object(c.jsx)("img",Object(n.a)({className:Object(s.a)("image",p.root,u),alt:r,src:t,srcSet:a},j))};d.defaultProps={alt:"...",lazy:!0,lazyProps:{width:"auto",height:"auto"}},t.a=d},436:function(e,t,a){"use strict";var n=a(13),i=a(25),s=a(5),r=(a(0),a(6)),o=a(241),c=a(1),l=Object(o.a)((function(e){return{root:Object(s.a)({width:"100%",margin:"0 auto",padding:e.spacing(6,2)},e.breakpoints.up("sm"),{padding:e.spacing(8,10)}),fullWidth:{maxWidth:"100%"},disablePadding:{padding:0},narrow:{maxWidth:800}}}));t.a=function(e){var t=e.children,a=e.fullWidth,s=e.narrow,o=e.disablePadding,d=e.alternate,b=e.className,u=Object(i.a)(e,["children","fullWidth","narrow","disablePadding","alternate","className"]),j=l();return Object(c.jsx)("section",Object(n.a)(Object(n.a)({className:Object(r.a)("section",j.root,a?j.fullWidth:{},s?j.narrow:{},o?j.disablePadding:{},d?j.alternate:{},b)},u),{},{children:t}))}},453:function(e,t,a){"use strict";var n=a(13),i=a(25),s=a(5),r=(a(0),a(6)),o=a(241),c=a(413),l=a(359),d=a(1),b=Object(o.a)((function(e){return{root:Object(s.a)({marginBottom:e.spacing(3)},e.breakpoints.up("md"),{marginBottom:e.spacing(4)}),disableGutter:{marginBottom:0},title:{fontWeight:"bold"},cta:{marginLeft:e.spacing(1),"&:first-child":{marginLeft:e.spacing(0)}}}})),u=function(e){var t=e.title,a=e.titleVariant,s=e.subtitleVariant,o=e.subtitle,u=e.subtitleColor,j=e.label,p=e.overline,m=e.fadeUp,g=e.align,h=e.ctaAlign,O=e.ctaGroup,f=e.disableGutter,x=e.titleClasses,y=e.className,v=e.labelProps,w=e.titleProps,N=e.subtitleProps,k=Object(i.a)(e,["title","titleVariant","subtitleVariant","subtitle","subtitleColor","label","overline","fadeUp","align","ctaAlign","ctaGroup","disableGutter","titleClasses","className","labelProps","titleProps","subtitleProps"]),S=b(),D="center",C="center";return"left"===g?D="flex-start":"right"===g&&(D="flex-end"),"left"===h?C="flex-start":"right"===h&&(C="flex-end"),Object(d.jsxs)(c.a,Object(n.a)(Object(n.a)({container:!0,spacing:2,"data-aos":m?"fade-up":"",className:Object(r.a)("section-header",S.root,f?S.disableGutter:{},y)},k),{},{children:[p&&Object(d.jsx)(c.a,{item:!0,container:!0,justifyContent:D,xs:12,className:"section-header__overline-wrapper",children:p}),j&&Object(d.jsx)(c.a,{item:!0,xs:12,className:"section-header__label-wrapper",children:Object(d.jsx)(l.a,Object(n.a)(Object(n.a)({variant:"overline",color:"textPrimary",component:"p",align:g||"center"},v),{},{children:j}))}),Object(d.jsx)(c.a,{item:!0,xs:12,className:"section-header__title-wrapper",children:Object(d.jsx)(l.a,Object(n.a)(Object(n.a)({variant:a,align:g||"center",className:Object(r.a)("section-header__title",S.title,x||{}),color:"textPrimary"},w),{},{children:t}))}),o&&Object(d.jsx)(c.a,{item:!0,xs:12,className:"section-header__subtitle-wrapper",children:Object(d.jsx)(l.a,Object(n.a)(Object(n.a)({variant:s||"h6",align:g||"center",color:u||"textSecondary",className:"section-header__subtitle"},N),{},{children:o}))}),O&&O.length&&Object(d.jsx)(c.a,{item:!0,xs:12,className:"section-header__cta-wrapper",children:Object(d.jsx)(c.a,{container:!0,justifyContent:C,alignItems:"center",wrap:"nowrap",className:"section-header__cta-container",children:O.map((function(e,t){return Object(d.jsx)("div",{className:Object(r.a)("section-header__cta-item-wrapper",S.cta),children:e},t)}))})})]}))};u.defaultProps={titleVariant:"h4",labelProps:{},titleProps:{},subtitleProps:{}},t.a=u},983:function(e,t,a){"use strict";a.r(t);a(0);var n=a(241),i=a(463),s=a.n(i),r=(a(464),a(246),a(244),a(436)),o=a(13),c=a(25),l=a(5),d=a(20),b=a(6),u=a(45),j=a(360),p=a(413),m=a(38),g=a(434),h=a(453),O=a(1),f=Object(n.a)((function(e){var t;return{root:{},image:Object(l.a)({},e.breakpoints.down("sm"),{maxWidth:500,marginBottom:60}),mobileImageContainer:(t={},Object(l.a)(t,e.breakpoints.down("sm"),{position:"absolute",left:0,top:-70}),Object(l.a)(t,"position","absolute"),Object(l.a)(t,"right",0),Object(l.a)(t,"top",-70),t),menuLink:{textDecoration:"none"}}})),x=function(e){var t=e.className,a=Object(c.a)(e,["className"]),n=f(),i=Object(u.a)(),s=Object(j.a)(i.breakpoints.up("md"),{defaultMatches:!0});return Object(O.jsx)("div",Object(o.a)(Object(o.a)({className:Object(b.a)(n.root,t)},a),{},{children:Object(O.jsxs)(p.a,{container:!0,justifyContent:"space-between",spacing:4,direction:s?"row":"column-reverse",children:[Object(O.jsxs)(p.a,{item:!0,container:!0,justifyContent:"flex-start",alignItems:"center",xs:12,md:5,"data-aos":"fade-up",children:[Object(O.jsx)(g.a,{src:"assets/images/hand.png",alt:"Web3 Legal Engineering",className:n.image,"data-aos":"fade-right","data-aos-easing":"ease-out-cubic","data-aos-duration":"2000"}),Object(O.jsx)("div",{className:n.mobileImageContainer,children:Object(O.jsx)(g.a,{src:"assets/images/cloud.svg",alt:"Web3 Legal Engineering",className:n.image,"data-aos":"fade-left","data-aos-easing":"ease-out-cubic","data-aos-duration":"2000"})})]}),Object(O.jsx)(p.a,{item:!0,container:!0,alignItems:"center",xs:12,md:7,"data-aos":"fade-up",children:Object(O.jsx)(h.a,{title:Object(O.jsxs)("div",{style:{display:"flex",flexDirection:"column"},children:[Object(O.jsxs)("span",{style:{color:i.palette.text.title},children:["ABOUT RepUSD",Object(O.jsx)("br",{})]}),Object(O.jsxs)("span",{style:{color:i.palette.text.primary,fontSize:18,fontWeight:"300",textAlign:"justify",lineHeight:1.8},children:["RepUSD is a reputation based lending protocol. Any person who has invested in DeFi protocols and smart contracts can get loans from RepUSD without the need to deposit collateral. Your reputation is your collateral.",Object(O.jsx)("br",{}),Object(O.jsx)("br",{})]}),Object(O.jsxs)("span",{style:{color:i.palette.text.primary,fontSize:18,fontWeight:"300",textAlign:"justify",lineHeight:1.8},children:["You calculate the value of your reputation by using the search engine on the reputation page. Select the smart contracts your have invested in and search. The value of your investments is your reputation. You can borrow up to 75% of the value of your reputation. If your investment is a pool containing RepUSD, you can borrow up to 90% of your reputation.",Object(O.jsx)("br",{}),Object(O.jsx)("br",{})]}),Object(O.jsx)("span",{style:{color:i.palette.text.primary,fontSize:18,fontWeight:"300",textAlign:"justify",lineHeight:1.8},children:"RepUSD also recognizes certain DeFi tokens such as WBTC, AVAX, Chainlink, DAI and Terra as your reputation. The balance of these tokens in your connected wallet also contributes to the value of your reputation. You can borrow immediately after your reputation is calculated. No deposit of collateral. Your collateral is your reputation. Ready to try?"})]}),ctaGroup:[Object(O.jsx)(d.b,{className:n.menuLink,to:"/lend",children:Object(O.jsx)(m.a,{onClick:function(){},variant:"outlined",color:"primary",size:"large",children:"Calculate Your Reputation and Borrow"})})],align:s?"left":"center",disableGutter:!0,titleVariant:"h3"})})]})}))},y=Object(n.a)((function(e){var t;return{root:{},image:Object(l.a)({},e.breakpoints.down("sm"),{maxWidth:500,marginBottom:60}),mobileImageContainer:(t={},Object(l.a)(t,e.breakpoints.down("sm"),{position:"absolute",left:0,top:-40}),Object(l.a)(t,"position","absolute"),Object(l.a)(t,"right",0),Object(l.a)(t,"top",-40),t),menuLink:{textDecoration:"none"}}})),v=function(e){var t=e.setIsSwapDialog,a=e.account,n=e.className,i=Object(c.a)(e,["setIsSwapDialog","account","className"]),s=y(),r=Object(u.a)(),l=Object(j.a)(r.breakpoints.up("md"),{defaultMatches:!0});return Object(O.jsx)("div",Object(o.a)(Object(o.a)({id:"K9nite",className:Object(b.a)(s.root,n)},i),{},{children:Object(O.jsxs)(p.a,{container:!0,justifyContent:"space-between",spacing:4,direction:l?"row":"column-reverse",children:[Object(O.jsx)(p.a,{item:!0,container:!0,alignItems:"center",xs:12,md:7,"data-aos":"fade-up",children:Object(O.jsx)(h.a,{title:Object(O.jsxs)("div",{style:{display:"flex",flexDirection:"column",width:"100%"},children:[Object(O.jsxs)("span",{style:{color:r.palette.text.title},children:["Earnings on borrowed tokens",Object(O.jsx)("br",{})]}),Object(O.jsxs)("span",{style:{color:r.palette.text.primary,fontSize:18,fontWeight:"300",textAlign:"justify",lineHeight:1.8},children:["When you borrow based on your reputation, you receive RepUSD tokens. RepUSD is a stablecoin. 1RepUSD = $1. Your borrowed RepUSD tokens are deposited in an interest bearing vault on your behalf.",Object(O.jsx)("br",{}),Object(O.jsx)("br",{})]}),Object(O.jsxs)("span",{style:{color:r.palette.text.primary,fontSize:18,fontWeight:"300",textAlign:"justify",lineHeight:1.8},children:["You earn interest of 36% APY on deposited RepUSD tokens. Your earned interest is added to your account daily. You can claim your earned RepUSD tokens daily to your wallet. As you invest in other dapps and smart contracts, always come back to RepUSD to revaluate your reputation and borrow more RepUSD tokens.",Object(O.jsx)("br",{}),Object(O.jsx)("br",{})]})]}),ctaGroup:[Object(O.jsx)(d.b,{className:s.menuLink,to:"/vault",children:Object(O.jsx)(m.a,{justify:"flex-end",onClick:function(){a&&t(!0)},variant:"outlined",color:"primary",size:"large",children:"My Earnings"})})],align:l?"left":"center",ctaAlign:"center",disableGutter:!0,titleVariant:"h4"})}),Object(O.jsxs)(p.a,{item:!0,container:!0,justifyContent:"flex-start",alignItems:"center",xs:12,md:5,"data-aos":"fade-up",children:[Object(O.jsx)(g.a,{src:"assets/images/independence.png",alt:"Web3 Legal Engineering",className:s.image,"data-aos":"fade-left","data-aos-easing":"ease-out-cubic","data-aos-duration":"2000"}),Object(O.jsx)("div",{className:s.mobileImageContainer,children:Object(O.jsx)(g.a,{src:"assets/images/cloud.svg",alt:"Web3 Legal Engineering",className:s.image,"data-aos":"fade-left","data-aos-easing":"ease-out-cubic","data-aos-duration":"2000"})})]})]})}))},w=Object(n.a)((function(e){return{root:{display:"flex",flexDirection:"column",height:"100%",width:"100%",justifyContent:"center",alignItems:"center",backgroundColor:"rgb(237, 240, 244)"}}}));t.default=function(){var e=w();return s.a.init({once:!0,delay:50,duration:500,easing:"ease-in-out"}),Object(O.jsxs)("div",{className:e.root,children:[Object(O.jsx)(r.a,{children:Object(O.jsx)(x,{})}),Object(O.jsx)(r.a,{children:Object(O.jsx)(v,{})})]})}}}]);
//# sourceMappingURL=11.49996197.chunk.js.map
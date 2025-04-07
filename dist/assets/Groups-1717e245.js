var M=Object.defineProperty,A=Object.defineProperties;var D=Object.getOwnPropertyDescriptors;var J=Object.getOwnPropertySymbols;var L=Object.prototype.hasOwnProperty,$=Object.prototype.propertyIsEnumerable;var G=(c,n,l)=>n in c?M(c,n,{enumerable:!0,configurable:!0,writable:!0,value:l}):c[n]=l,v=(c,n)=>{for(var l in n||(n={}))L.call(n,l)&&G(c,l,n[l]);if(J)for(var l of J(n))$.call(n,l)&&G(c,l,n[l]);return c},g=(c,n)=>A(c,D(n));import{j as e}from"./index-5a8bf324.js";import{d as E,r as N}from"./vendor-2240c9f5.js";import{N as R,b as F,u as h,v as x,X as d,h as o,Z as j,B as b,i as r,A as P,a as S,g as H}from"./ui-2716f190.js";const K=()=>e.jsx("svg",{width:"20",height:"20",viewBox:"0 0 24 24",fill:"#999",children:e.jsx("path",{d:"M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"})}),p=()=>e.jsx("svg",{width:"16",height:"16",viewBox:"0 0 24 24",fill:"#1677ff",children:e.jsx("path",{d:"M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5z"})}),X=()=>e.jsx("svg",{width:"16",height:"16",viewBox:"0 0 24 24",fill:"#1677ff",children:e.jsx("path",{d:"M10.01 21.01c0 1.1.89 1.99 1.99 1.99s1.99-.89 1.99-1.99h-3.98zm8.87-4.19V11c0-3.25-2.25-5.97-5.29-6.69v-.72C13.59 2.71 12.88 2 12 2s-1.59.71-1.59 1.59v.72C7.37 5.03 5.12 7.75 5.12 11v5.82L3 18.94V20h18v-1.06l-2.12-2.12zM16 13.01h-3v3h-2v-3H8V11h3V8h2v3h3v2.01z"})}),U=()=>{const c=E(),[n,l]=N.useState("all"),[s,f]=N.useState(null),[u,B]=N.useState(""),[w,z]=N.useState([{id:1,name:"健康养生交流群",avatar:"https://via.placeholder.com/100",description:"分享健康养生知识，交流保健经验，定期组织健康讲座和活动。",memberCount:128,activity:"活跃",category:"健康",tags:["养生","健康饮食","运动健身"],founder:{id:101,name:"张医生",avatar:"https://via.placeholder.com/40"},isJoined:!0,announcement:"本周六上午10点将在社区活动中心举办健康生活方式讲座，欢迎群友参加！",events:[{id:1001,title:"健康生活方式讲座",time:"2025年4月13日 上午10:00",location:"社区活动中心一号厅"},{id:1002,title:"太极拳交流会",time:"2025年4月20日 早上7:00",location:"社区公园东区广场"}]},{id:2,name:"每日晨练群",avatar:"https://via.placeholder.com/100",description:"志同道合的晨练爱好者交流群，每天早上6:30在社区公园集合晨练。",memberCount:56,activity:"较活跃",category:"健康",tags:["晨练","健步走","太极"],founder:{id:102,name:"李师傅",avatar:"https://via.placeholder.com/40"},announcement:"从明天开始，晨练时间调整为6:00开始，请大家相互转告。"},{id:3,name:"摄影爱好者",avatar:"https://via.placeholder.com/100",description:"分享摄影作品，交流摄影技巧，定期组织外出摄影活动。",memberCount:89,activity:"活跃",category:"兴趣",tags:["摄影","艺术","外出活动"],founder:{id:103,name:"王摄影",avatar:"https://via.placeholder.com/40"},isJoined:!0,events:[{id:1003,title:"春季外拍活动",time:"2025年4月15日 上午9:00",location:"城市植物园"}]},{id:4,name:"棋牌娱乐群",avatar:"https://via.placeholder.com/100",description:"象棋、围棋、麻将爱好者交流群，每周末在社区棋牌室举行活动。",memberCount:76,activity:"一般",category:"兴趣",tags:["棋牌","象棋","麻将"],founder:{id:104,name:"赵大爷",avatar:"https://via.placeholder.com/40"}},{id:8,name:"邻里互助群",avatar:"https://via.placeholder.com/100",description:"邻里互相帮助，资源共享，增进邻里感情。",memberCount:145,activity:"较活跃",category:"社区",tags:["互助","邻里关系","资源共享"],founder:{id:108,name:"周大姐",avatar:"https://via.placeholder.com/40"},isJoined:!0},{id:9,name:"社区老年合唱团",avatar:"https://via.placeholder.com/100",description:"社区老年合唱团交流群，分享歌曲，组织排练，参与社区文化活动演出。",memberCount:42,activity:"活跃",category:"兴趣",tags:["合唱","音乐","表演"],founder:{id:109,name:"郑老师",avatar:"https://via.placeholder.com/40"},events:[{id:1005,title:"社区文化节演出彩排",time:"2025年4月22日 下午3:00",location:"社区文化活动中心"}]},{id:10,name:"园艺植物交流群",avatar:"https://via.placeholder.com/100",description:"分享园艺知识，交流植物养护经验，组织种植活动和花卉展示。",memberCount:65,activity:"一般",category:"兴趣",tags:["园艺","花卉","植物"],founder:{id:110,name:"张叔叔",avatar:"https://via.placeholder.com/40"},announcement:"本月底将举办小型花卉展览，欢迎群友带着自己养护的植物参展。"},{id:12,name:"中老年健身群",avatar:"https://via.placeholder.com/100",description:"分享适合中老年人的健身方法，交流运动心得，组织集体健身活动。",memberCount:94,activity:"活跃",category:"健康",tags:["健身","运动","健康"],founder:{id:112,name:"王教练",avatar:"https://via.placeholder.com/40"},events:[{id:1007,title:"中老年健身舞教学",time:"每周一、三、五 晚上7:00",location:"社区文化广场"}]},{id:13,name:"社区安全防范群",avatar:"https://via.placeholder.com/100",description:"分享安全知识，通报社区安全情况，提高居民安全防范意识。",memberCount:156,activity:"一般",category:"通知",tags:["安全防范","社区安全","互助"],founder:{id:113,name:"社区警务室",avatar:"https://via.placeholder.com/40"},announcement:"近期周边社区发生几起入室盗窃案件，请大家提高警惕，外出和晚上睡觉前务必锁好门窗。"},{id:15,name:"家庭医疗互助群",avatar:"https://via.placeholder.com/100",description:"分享家庭医疗保健知识，解答常见健康问题，提供就医指导服务。",memberCount:103,activity:"活跃",category:"健康",tags:["家庭医疗","健康咨询","互助"],founder:{id:115,name:"李医生",avatar:"https://via.placeholder.com/40"},announcement:"群内已整理常见慢性病用药指南和紧急就医指南，请查看群文件下载。",events:[{id:1009,title:"家庭急救知识讲座",time:"2025年4月19日 上午10:00",location:"社区卫生服务中心"}]}]),C=w.filter(a=>a.name.includes(u)||a.description.includes(u)||a.tags.some(i=>i.includes(u))),m=a=>{f(a)},T=()=>{f(null)},k=a=>{z(i=>i.map(t=>t.id===a?g(v({},t),{memberCount:t.memberCount+1,isJoined:!0}):t)),s&&s.id===a&&f(g(v({},s),{memberCount:s.memberCount+1,isJoined:!0})),S.show({content:"已加入群组！",position:"bottom"})},I=a=>{H.confirm({content:"确定要退出该群组吗？",onConfirm:()=>{z(i=>i.map(t=>t.id===a?g(v({},t),{memberCount:t.memberCount-1,isJoined:!1}):t)),s&&s.id===a&&f(g(v({},s),{memberCount:s.memberCount-1,isJoined:!1})),S.show({content:"已退出群组",position:"bottom"})}})},V=a=>{c(`/group-chat/${a}`)},y=a=>a==="all"?C:C.filter(i=>i.category===a);return e.jsxs("div",{className:"groups-page",children:[s?e.jsxs("div",{className:"group-detail",children:[e.jsx(R,{onBack:T,children:"群组详情"}),e.jsxs("div",{className:"detail-content",children:[e.jsxs("div",{className:"detail-header",children:[e.jsx(d,{src:s.avatar,width:80,height:80,fit:"cover"}),e.jsxs("div",{className:"detail-basic",children:[e.jsx("h2",{className:"detail-name",children:s.name}),e.jsxs("div",{className:"detail-members",children:[e.jsx(p,{}),e.jsxs("span",{children:[s.memberCount,"人 · ",s.activity]})]}),e.jsx("div",{className:"detail-category",children:e.jsx(o,{color:"#2db7f5",children:s.category})})]})]}),e.jsx("div",{className:"detail-actions",children:s.isJoined?e.jsxs(e.Fragment,{children:[e.jsx(b,{color:"primary",onClick:()=>V(s.id),style:{flex:1},children:"进入群聊"}),e.jsx(b,{color:"default",onClick:()=>I(s.id),style:{flex:1},children:"退出群组"})]}):e.jsx(b,{block:!0,color:"primary",onClick:()=>k(s.id),children:"加入群组"})}),e.jsx(r,{header:"群组介绍",children:e.jsx(r.Item,{children:e.jsx("p",{className:"detail-description",children:s.description})})}),e.jsx(r,{header:"群主信息",children:e.jsx(r.Item,{prefix:e.jsx(P,{src:s.founder.avatar}),children:s.founder.name})}),e.jsx(r,{header:"群组标签",children:e.jsx(r.Item,{children:e.jsx("div",{className:"detail-tags",children:s.tags.map((a,i)=>e.jsx(o,{color:"#f5f5f5",style:{color:"#666"},children:a},i))})})}),s.announcement&&e.jsx(r,{header:e.jsxs("div",{className:"announcement-header",children:[e.jsx(X,{})," 群公告"]}),children:e.jsx(r.Item,{children:e.jsx("p",{className:"announcement-content",children:s.announcement})})}),s.events&&s.events.length>0&&e.jsx(r,{header:"近期活动",children:s.events.map(a=>e.jsx(r.Item,{title:a.title,description:`${a.time} · ${a.location}`},a.id))})]})]}):e.jsxs(e.Fragment,{children:[e.jsx(R,{onBack:()=>c("/"),children:"社区群组"}),e.jsxs("div",{className:"search-bar",children:[e.jsx(K,{}),e.jsx(F,{placeholder:"搜索群组名称、描述或标签",value:u,onChange:B,clearable:!0,style:{flex:1}})]}),e.jsxs(h,{activeKey:n,onChange:l,children:[e.jsx(h.Tab,{title:"全部",children:e.jsx("div",{className:"group-list",children:C.map(a=>e.jsxs(x,{onClick:()=>m(a),className:"group-card",children:[e.jsxs("div",{className:"group-card-header",children:[e.jsx(d,{src:a.avatar,width:60,height:60,fit:"cover",style:{borderRadius:"8px"}}),e.jsxs("div",{className:"group-basic-info",children:[e.jsx("div",{className:"group-name",children:a.name}),e.jsxs("div",{className:"group-stats",children:[e.jsx(p,{}),e.jsxs("span",{children:[a.memberCount,"人"]}),e.jsx("span",{className:"activity-level",children:a.activity})]}),e.jsxs("div",{className:"group-tags",children:[a.tags.slice(0,2).map((i,t)=>e.jsx(o,{color:"primary",fill:"outline",style:{marginRight:4},children:i},t)),a.tags.length>2&&e.jsxs("span",{className:"more-tags",children:["+",a.tags.length-2]})]})]}),a.isJoined&&e.jsx(j,{color:"#1677ff",content:"已加入",style:{"--right":"10px","--top":"10px"}})]}),e.jsx("div",{className:"group-description",children:a.description})]},a.id))})},"all"),e.jsx(h.Tab,{title:"健康",children:e.jsx("div",{className:"group-list",children:y("健康").map(a=>e.jsxs(x,{onClick:()=>m(a),className:"group-card",children:[e.jsxs("div",{className:"group-card-header",children:[e.jsx(d,{src:a.avatar,width:60,height:60,fit:"cover",style:{borderRadius:"8px"}}),e.jsxs("div",{className:"group-basic-info",children:[e.jsx("div",{className:"group-name",children:a.name}),e.jsxs("div",{className:"group-stats",children:[e.jsx(p,{}),e.jsxs("span",{children:[a.memberCount,"人"]}),e.jsx("span",{className:"activity-level",children:a.activity})]}),e.jsxs("div",{className:"group-tags",children:[a.tags.slice(0,2).map((i,t)=>e.jsx(o,{color:"primary",fill:"outline",style:{marginRight:4},children:i},t)),a.tags.length>2&&e.jsxs("span",{className:"more-tags",children:["+",a.tags.length-2]})]})]}),a.isJoined&&e.jsx(j,{color:"#1677ff",content:"已加入",style:{"--right":"10px","--top":"10px"}})]}),e.jsx("div",{className:"group-description",children:a.description})]},a.id))})},"health"),e.jsx(h.Tab,{title:"兴趣",children:e.jsx("div",{className:"group-list",children:y("兴趣").map(a=>e.jsxs(x,{onClick:()=>m(a),className:"group-card",children:[e.jsxs("div",{className:"group-card-header",children:[e.jsx(d,{src:a.avatar,width:60,height:60,fit:"cover",style:{borderRadius:"8px"}}),e.jsxs("div",{className:"group-basic-info",children:[e.jsx("div",{className:"group-name",children:a.name}),e.jsxs("div",{className:"group-stats",children:[e.jsx(p,{}),e.jsxs("span",{children:[a.memberCount,"人"]}),e.jsx("span",{className:"activity-level",children:a.activity})]}),e.jsxs("div",{className:"group-tags",children:[a.tags.slice(0,2).map((i,t)=>e.jsx(o,{color:"primary",fill:"outline",style:{marginRight:4},children:i},t)),a.tags.length>2&&e.jsxs("span",{className:"more-tags",children:["+",a.tags.length-2]})]})]}),a.isJoined&&e.jsx(j,{color:"#1677ff",content:"已加入",style:{"--right":"10px","--top":"10px"}})]}),e.jsx("div",{className:"group-description",children:a.description})]},a.id))})},"interest"),e.jsx(h.Tab,{title:"社区",children:e.jsx("div",{className:"group-list",children:y("社区").map(a=>e.jsxs(x,{onClick:()=>m(a),className:"group-card",children:[e.jsxs("div",{className:"group-card-header",children:[e.jsx(d,{src:a.avatar,width:60,height:60,fit:"cover",style:{borderRadius:"8px"}}),e.jsxs("div",{className:"group-basic-info",children:[e.jsx("div",{className:"group-name",children:a.name}),e.jsxs("div",{className:"group-stats",children:[e.jsx(p,{}),e.jsxs("span",{children:[a.memberCount,"人"]}),e.jsx("span",{className:"activity-level",children:a.activity})]}),e.jsxs("div",{className:"group-tags",children:[a.tags.slice(0,2).map((i,t)=>e.jsx(o,{color:"primary",fill:"outline",style:{marginRight:4},children:i},t)),a.tags.length>2&&e.jsxs("span",{className:"more-tags",children:["+",a.tags.length-2]})]})]}),a.isJoined&&e.jsx(j,{color:"#1677ff",content:"已加入",style:{"--right":"10px","--top":"10px"}})]}),e.jsx("div",{className:"group-description",children:a.description})]},a.id))})},"community"),e.jsx(h.Tab,{title:"通知",children:e.jsx("div",{className:"group-list",children:y("通知").map(a=>e.jsxs(x,{onClick:()=>m(a),className:"group-card",children:[e.jsxs("div",{className:"group-card-header",children:[e.jsx(d,{src:a.avatar,width:60,height:60,fit:"cover",style:{borderRadius:"8px"}}),e.jsxs("div",{className:"group-basic-info",children:[e.jsx("div",{className:"group-name",children:a.name}),e.jsxs("div",{className:"group-stats",children:[e.jsx(p,{}),e.jsxs("span",{children:[a.memberCount,"人"]}),e.jsx("span",{className:"activity-level",children:a.activity})]}),e.jsxs("div",{className:"group-tags",children:[a.tags.slice(0,2).map((i,t)=>e.jsx(o,{color:"primary",fill:"outline",style:{marginRight:4},children:i},t)),a.tags.length>2&&e.jsxs("span",{className:"more-tags",children:["+",a.tags.length-2]})]})]}),a.isJoined&&e.jsx(j,{color:"#1677ff",content:"已加入",style:{"--right":"10px","--top":"10px"}})]}),e.jsx("div",{className:"group-description",children:a.description})]},a.id))})},"notice")]}),e.jsxs("div",{className:"group-recommendations",children:[e.jsx("h3",{className:"section-title",children:"推荐群组"}),e.jsx("div",{className:"recommendations-list",children:w.filter(a=>!a.isJoined).slice(0,3).map(a=>e.jsx(x,{onClick:()=>m(a),className:"recommendation-card",children:e.jsxs("div",{className:"recommendation-content",children:[e.jsx(d,{src:a.avatar,width:50,height:50,fit:"cover"}),e.jsxs("div",{className:"recommendation-info",children:[e.jsx("div",{className:"recommendation-name",children:a.name}),e.jsxs("div",{className:"recommendation-members",children:[a.memberCount,"人"]})]}),e.jsx(b,{size:"small",color:"primary",onClick:i=>{i.stopPropagation(),k(a.id)},children:"加入"})]})},a.id))})]})]}),e.jsx("style",{children:`
        .groups-page {
          min-height: 100vh;
          padding-bottom: 70px;
        }
        
        .search-bar {
          display: flex;
          align-items: center;
          padding: 10px 16px;
          background-color: #f5f5f5;
        }
        
        .search-bar svg {
          margin-right: 8px;
        }
        
        .group-list {
          padding: 16px;
        }
        
        .group-card {
          margin-bottom: 16px;
          overflow: hidden;
          border-radius: 8px;
        }
        
        .group-card-header {
          display: flex;
          padding: 16px;
        }
        
        .group-basic-info {
          flex: 1;
          margin-left: 16px;
        }
        
        .group-name {
          font-size: 18px;
          font-weight: bold;
          margin-bottom: 8px;
          display: flex;
          align-items: center;
        }
        
        .group-stats {
          display: flex;
          align-items: center;
          font-size: 14px;
          color: #999;
        }
        
        .group-stats svg {
          margin-right: 4px;
        }
        
        .activity-level {
          margin-left: 8px;
          font-size: 12px;
        }
        
        .group-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          padding: 0 16px 16px;
        }
        
        .group-recommendations {
          padding: 16px;
          background-color: #f9f9f9;
          margin-top: 16px;
        }
        
        .section-title {
          margin: 0 0 16px;
          font-size: 16px;
          font-weight: bold;
          color: #333;
        }
        
        .recommendations-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        
        .recommendation-card {
          padding: 12px;
        }
        
        .recommendation-content {
          display: flex;
          align-items: center;
        }
        
        .recommendation-info {
          flex: 1;
          margin-left: 12px;
        }
        
        .recommendation-name {
          font-size: 16px;
          font-weight: 500;
          margin-bottom: 4px;
        }
        
        .recommendation-members {
          font-size: 14px;
          color: #999;
        }
        
        .detail-content {
          padding: 16px;
        }
        
        .detail-header {
          display: flex;
          align-items: center;
          margin-bottom: 24px;
        }
        
        .detail-basic {
          margin-left: 20px;
          flex: 1;
        }
        
        .detail-name {
          margin: 0 0 8px;
          font-size: 22px;
        }
        
        .detail-members {
          display: flex;
          align-items: center;
          color: #666;
          margin-bottom: 8px;
        }
        
        .detail-members svg {
          margin-right: 4px;
        }
        
        .detail-category {
          display: flex;
        }
        
        .detail-actions {
          display: flex;
          gap: 16px;
          margin-bottom: 24px;
        }
        
        .detail-description {
          margin: 0;
          line-height: 1.6;
          color: #666;
        }
        
        .detail-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
        
        .announcement-header {
          display: flex;
          align-items: center;
        }
        
        .announcement-header svg {
          margin-right: 8px;
        }
        
        .announcement-content {
          margin: 0;
          line-height: 1.6;
          color: #666;
        }
      `})]})};export{U as default};

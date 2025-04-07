var _=Object.defineProperty,ee=Object.defineProperties;var se=Object.getOwnPropertyDescriptors;var V=Object.getOwnPropertySymbols;var te=Object.prototype.hasOwnProperty,ne=Object.prototype.propertyIsEnumerable;var H=(r,a,c)=>a in r?_(r,a,{enumerable:!0,configurable:!0,writable:!0,value:c}):r[a]=c,h=(r,a)=>{for(var c in a||(a={}))te.call(a,c)&&H(r,c,a[c]);if(V)for(var c of V(a))ne.call(a,c)&&H(r,c,a[c]);return r},f=(r,a)=>ee(r,se(a));var j=(r,a,c)=>new Promise((x,S)=>{var w=d=>{try{g(c.next(d))}catch(l){S(l)}},I=d=>{try{g(c.throw(d))}catch(l){S(l)}},g=d=>d.done?x(d.value):Promise.resolve(d.value).then(w,I);g((c=c.apply(r,a)).next())});import{O as v,j as s}from"./index-5a8bf324.js";import{d as ie,r as u}from"./vendor-2240c9f5.js";import{a as i,N as oe,x as M,B as p,t as ae,u as q,D as R,E as N,i as y,j as re,A as z,c as $,h as ce,y as le,V as de,q as pe,H as he,g as fe}from"./ui-2716f190.js";const je=()=>{const r=ie(),[a,c]=u.useState([]),[x,S]=u.useState([]),[w,I]=u.useState([]),[g,d]=u.useState([]),[l,b]=u.useState({friends:!0,search:!1,request:!1}),[F,U]=u.useState("");u.useState(!1);const[K,A]=u.useState(!1);u.useState(null);const[G,J]=u.useState("friends");u.useEffect(()=>{const e=localStorage.getItem("userId")||sessionStorage.getItem("userId");e?Q(parseInt(e)):i.show({content:"请先登录",afterClose:()=>{r("/login")}})},[]);const Q=e=>j(void 0,null,function*(){b(f(h({},l),{friends:!0}));try{const t=yield v.get(`/api/friends/${e}`);if(t.data.success){const n=t.data.data;c(n.friends||[]),S(n.pending||[]),I(n.requested||[])}else i.show({icon:"fail",content:t.data.message||"获取好友列表失败"})}catch(t){console.error("获取好友列表失败:",t),i.show({icon:"fail",content:"获取好友列表失败"})}finally{b(f(h({},l),{friends:!1}))}}),B=e=>j(void 0,null,function*(){if(!e.trim()){d([]);return}b(f(h({},l),{search:!0}));try{console.log("正在搜索用户:",e);const t=yield v.get(`/api/users/search?query=${encodeURIComponent(e)}`);if(console.log("搜索结果:",t.data),t.data.success){const n=t.data.data.map(o=>{const m=a.some(k=>k.id===o.id),T=w.some(k=>k.id===o.id),Z=x.some(k=>k.id===o.id);let C="none";return m?C="friend":T?C="requested":Z&&(C="pending"),console.log(`用户 ${o.username} (ID: ${o.id}) 关系: ${C}`),f(h({},o),{relationship:C})});d(n)}else console.error("搜索失败:",t.data.message),i.show({icon:"fail",content:t.data.message||"搜索失败"})}catch(t){console.error("搜索用户失败:",t),t.response?(console.error("错误响应:",t.response.data),console.error("错误状态码:",t.response.status)):t.request?console.error("没有收到响应:",t.request):console.error("请求错误:",t.message),i.show({icon:"fail",content:"搜索用户失败"})}finally{b(f(h({},l),{search:!1}))}}),W=e=>j(void 0,null,function*(){b(f(h({},l),{request:!0}));try{const t=yield v.post("/api/friends/request",{userId:localStorage.getItem("userId")||sessionStorage.getItem("userId"),targetId:e});if(t.data.success){const n=g.find(o=>o.id===e);if(n){const o={id:n.id,username:n.username,phone:n.phone,avatar:n.avatar||"https://via.placeholder.com/40",status:"offline",relationship:"requested"};I([...w,o]),d(g.map(m=>m.id===e?f(h({},m),{relationship:"requested"}):m)),i.show({icon:"success",content:"已发送好友请求"})}}else i.show({icon:"fail",content:t.data.message||"发送请求失败"})}catch(t){console.error("发送好友请求失败:",t),i.show({icon:"fail",content:"发送好友请求失败"})}finally{b(f(h({},l),{request:!1}))}}),E=e=>j(void 0,null,function*(){try{const t=localStorage.getItem("userId")||sessionStorage.getItem("userId");if(!t){i.show({content:"请先登录",afterClose:()=>{r("/login")}});return}const n=yield v.post("/api/friends/accept",{userId:parseInt(t),requestId:e});if(n.data.success){const o=x.find(m=>m.id===e);if(o){S(x.filter(T=>T.id!==e));const m=f(h({},o),{relationship:"friend"});c([...a,m]),i.show({icon:"success",content:"已添加为好友"})}}else i.show({icon:"fail",content:n.data.message||"操作失败"})}catch(t){console.error("接受好友请求失败:",t),i.show({icon:"fail",content:"操作失败"})}}),L=e=>j(void 0,null,function*(){try{const t=localStorage.getItem("userId")||sessionStorage.getItem("userId");if(!t){i.show({content:"请先登录",afterClose:()=>{r("/login")}});return}const n=yield v.post("/api/friends/reject",{userId:parseInt(t),requestId:e});n.data.success?(S(x.filter(o=>o.id!==e)),i.show({content:"已拒绝请求"})):i.show({icon:"fail",content:n.data.message||"操作失败"})}catch(t){console.error("拒绝好友请求失败:",t),i.show({icon:"fail",content:"操作失败"})}}),O=e=>j(void 0,null,function*(){try{const t=localStorage.getItem("userId")||sessionStorage.getItem("userId");if(!t){i.show({content:"请先登录",afterClose:()=>{r("/login")}});return}const n=yield v.delete(`/api/friends/request/${t}/${e}`);n.data.success?(I(w.filter(o=>o.id!==e)),d(g.map(o=>o.id===e?f(h({},o),{relationship:"none"}):o)),i.show({content:"已取消请求"})):i.show({icon:"fail",content:n.data.message||"操作失败"})}catch(t){console.error("取消好友请求失败:",t),i.show({icon:"fail",content:"操作失败"})}}),X=e=>j(void 0,null,function*(){fe.confirm({content:"确定要删除此好友吗？",onConfirm:()=>j(void 0,null,function*(){try{const t=localStorage.getItem("userId")||sessionStorage.getItem("userId");if(!t){i.show({content:"请先登录",afterClose:()=>{r("/login")}});return}const n=yield v.delete(`/api/friends/${t}/${e}`);n.data.success?(c(a.filter(o=>o.id!==e)),i.show({icon:"success",content:"已删除好友"})):i.show({icon:"fail",content:n.data.message||"操作失败"})}catch(t){console.error("删除好友失败:",t),i.show({icon:"fail",content:"操作失败"})}})})}),P=()=>{U(""),d([]),A(!0)},D=e=>{U(e),B(e)},Y=e=>{const t={online:{backgroundColor:"#10b981"},offline:{backgroundColor:"#9ca3af"},busy:{backgroundColor:"#f59e0b"}};return s.jsx("div",{className:"status-indicator",style:e==="online"?t.online:e==="busy"?t.busy:t.offline})};return s.jsxs("div",{className:"friends-container",children:[s.jsx(oe,{back:null,children:"好友"}),s.jsxs("div",{className:"search-container",children:[s.jsx(M,{placeholder:"搜索好友",value:F,onChange:D,onSearch:e=>B(e),style:{"--background":"#f5f5f5"}}),s.jsx(p,{size:"small",color:"primary",onClick:P,style:{marginLeft:"8px"},children:s.jsx(ae,{})})]}),s.jsxs(q,{activeKey:G,onChange:J,children:[s.jsx(q.Tab,{title:"好友",children:l.friends?s.jsxs("div",{className:"loading-container",children:[s.jsx(R,{}),s.jsx("span",{children:"加载中..."})]}):a.length===0?s.jsxs("div",{className:"empty-container",children:[s.jsx(N,{description:"暂无好友",imageStyle:{width:128}}),s.jsx(p,{color:"primary",onClick:P,style:{marginTop:"16px"},children:"添加好友"})]}):s.jsx(y,{children:a.map(e=>s.jsx(re,{rightActions:[{key:"delete",text:"删除",color:"danger",onClick:()=>X(e.id)}],children:s.jsx(y.Item,{prefix:s.jsxs("div",{className:"avatar-container",children:[s.jsx(z,{src:e.avatar}),Y(e.status)]}),title:e.username,description:s.jsxs("div",{className:"friend-description",children:[s.jsx("div",{children:e.phone}),e.tag&&e.tag.length>0&&s.jsx($,{wrap:!0,children:e.tag.map((t,n)=>s.jsx(ce,{color:"primary",fill:"outline",style:{fontSize:"10px"},children:t},n))})]}),arrow:null,extra:s.jsxs($,{children:[s.jsx(p,{size:"mini",onClick:()=>r(`/chat/${e.id}`),children:s.jsx(le,{})}),s.jsx(p,{size:"mini",onClick:()=>r(`/videocall/${e.id}`),children:s.jsx(de,{})})]})})},e.id))})},"friends"),s.jsx(q.Tab,{title:`新的好友请求 ${x.length>0?`(${x.length})`:""}`,children:l.friends?s.jsxs("div",{className:"loading-container",children:[s.jsx(R,{}),s.jsx("span",{children:"加载中..."})]}):x.length===0?s.jsx(N,{description:"暂无好友请求",imageStyle:{width:128}}):s.jsx(y,{children:x.map(e=>s.jsx(y.Item,{prefix:s.jsx(z,{src:e.avatar}),title:e.username,description:e.phone,extra:s.jsxs($,{children:[s.jsx(p,{size:"mini",color:"primary",onClick:()=>E(e.id),children:"接受"}),s.jsx(p,{size:"mini",onClick:()=>L(e.id),children:"拒绝"})]})},e.id))})},"requests"),s.jsx(q.Tab,{title:"已发送请求",children:l.friends?s.jsxs("div",{className:"loading-container",children:[s.jsx(R,{}),s.jsx("span",{children:"加载中..."})]}):w.length===0?s.jsx(N,{description:"暂无已发送的请求",imageStyle:{width:128}}):s.jsx(y,{children:w.map(e=>s.jsx(y.Item,{prefix:s.jsx(z,{src:e.avatar}),title:e.username,description:e.phone,extra:s.jsx(p,{size:"mini",onClick:()=>O(e.id),children:"取消"})},e.id))})},"sent")]}),s.jsxs(pe,{visible:K,onMaskClick:()=>A(!1),position:"bottom",bodyStyle:{borderTopLeftRadius:"8px",borderTopRightRadius:"8px",minHeight:"40vh",maxHeight:"70vh",paddingBottom:"24px"},children:[s.jsxs("div",{className:"popup-header",children:[s.jsx("div",{className:"popup-title",children:"添加好友"}),s.jsx(p,{className:"close-button",onClick:()=>A(!1),children:"关闭"})]}),s.jsxs("div",{className:"popup-content",children:[s.jsx(M,{placeholder:"搜索手机号或用户名添加好友",value:F,onChange:D,style:{"--background":"#f5f5f5"},showCancelButton:!0}),l.search?s.jsxs("div",{className:"loading-container",children:[s.jsx(R,{}),s.jsx("span",{children:"搜索中..."})]}):g.length===0?s.jsx(N,{description:F?"未找到相关用户":"请输入手机号或用户名",imageStyle:{width:128}}):s.jsx(y,{children:g.map(e=>s.jsx(y.Item,{prefix:s.jsx(z,{src:e.avatar||"https://via.placeholder.com/40"}),title:e.username,description:e.phone,extra:e.relationship==="friend"?s.jsx(p,{size:"mini",disabled:!0,children:"已是好友"}):e.relationship==="requested"?s.jsx(p,{size:"mini",onClick:()=>O(e.id),children:"取消请求"}):e.relationship==="pending"?s.jsxs($,{children:[s.jsx(p,{size:"mini",color:"primary",onClick:()=>E(e.id),children:"接受"}),s.jsx(p,{size:"mini",onClick:()=>L(e.id),children:"拒绝"})]}):s.jsxs(p,{size:"mini",color:"primary",onClick:()=>W(e.id),loading:l.request,children:[s.jsx(he,{})," 添加"]})},e.id))})]})]}),s.jsx("style",{children:`
        .friends-container {
          display: flex;
          flex-direction: column;
          height: 100vh;
          padding-bottom: 60px;
        }
        
        .search-container {
          display: flex;
          padding: 12px;
          background-color: white;
        }
        
        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 40px 0;
          color: #999;
        }
        
        .empty-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 40px 0;
        }
        
        .avatar-container {
          position: relative;
        }
        
        .status-indicator {
          position: absolute;
          right: 0;
          bottom: 0;
          width: 10px;
          height: 10px;
          border-radius: 50%;
          border: 2px solid white;
        }
        
        .friend-description {
          display: flex;
          flex-direction: column;
        }
        
        .popup-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 16px;
          border-bottom: 1px solid #f0f0f0;
        }
        
        .popup-title {
          font-size: 16px;
          font-weight: bold;
        }
        
        .close-button {
          font-size: 14px;
          color: #999;
          background: none;
          border: none;
        }
        
        .popup-content {
          padding: 16px;
          overflow-y: auto;
        }
      `})]})};export{je as default};

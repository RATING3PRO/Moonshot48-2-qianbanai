var I=(s,u,c)=>new Promise((p,h)=>{var n=o=>{try{x(c.next(o))}catch(d){h(d)}},m=o=>{try{x(c.throw(o))}catch(d){h(d)}},x=o=>o.done?p(o.value):Promise.resolve(o.value).then(n,m);x((c=c.apply(s,u)).next())});import{j as e,O as D}from"./index-5a8bf324.js";import{d as L,r as g}from"./vendor-2240c9f5.js";import{B as w,A as z,i as t,k as A,Q as H,l as T,m as B,n as S,a as l,g as O}from"./ui-2716f190.js";const y=()=>e.jsx("svg",{width:"24",height:"24",viewBox:"0 0 24 24",fill:"currentColor",children:e.jsx("path",{d:"M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"})}),b=()=>e.jsx("svg",{width:"24",height:"24",viewBox:"0 0 24 24",fill:"currentColor",children:e.jsx("path",{d:"M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z"})}),V=()=>e.jsx("svg",{width:"24",height:"24",viewBox:"0 0 24 24",fill:"currentColor",children:e.jsx("path",{d:"M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"})}),U=()=>e.jsx("svg",{width:"24",height:"24",viewBox:"0 0 24 24",fill:"currentColor",children:e.jsx("path",{d:"M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"})}),$=()=>e.jsx("svg",{width:"24",height:"24",viewBox:"0 0 24 24",fill:"currentColor",xmlns:"http://www.w3.org/2000/svg",children:e.jsx("path",{d:"M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM13.88 12.88L12 11V8H13V10.5L14.5 12L13.88 12.88ZM16.4 16.8C15.63 16.8 15 16.17 15 15.4C15 15.06 15.1 14.73 15.3 14.46L14.5 13.66C14.06 14.09 13.81 14.69 13.81 15.36C13.81 16.85 15.02 18.05 16.51 18.05C17.21 18.05 17.84 17.79 18.27 17.34L17.46 16.53C17.18 16.71 16.81 16.8 16.4 16.8Z"})}),Q=()=>{var v,C;const s=L(),[u,c]=g.useState(!1),[p,h]=g.useState(!1),[n,m]=g.useState(null),[x,o]=g.useState(!0);g.useEffect(()=>{(()=>I(void 0,null,function*(){try{o(!0);const a=localStorage.getItem("userData")||sessionStorage.getItem("userData"),f=localStorage.getItem("userId")||sessionStorage.getItem("userId"),j=localStorage.getItem("token")||sessionStorage.getItem("token");if(console.log("存储的用户数据:",a),console.log("存储的用户ID:",f),console.log("存储的token:",j),a){const i=JSON.parse(a);m(i),console.log("已从本地存储加载用户数据")}if(j&&f){console.log("正在从API获取最新用户数据");const i=yield D.get(`/api/user/profile/${f}`,{headers:{Authorization:`Bearer ${j}`}});i.data.success?(console.log("从API获取用户数据成功:",i.data.data),m(i.data.data),(localStorage.getItem("rememberMe")==="true"?localStorage:sessionStorage).setItem("userData",JSON.stringify(i.data.data))):(console.error("获取用户数据失败:",i.data.message),l.show({icon:"fail",content:"获取用户数据失败: "+i.data.message}))}else console.error("没有找到用户凭证，无法获取用户数据"),a||(l.show({icon:"fail",content:"请先登录"}),s("/login"))}catch(a){console.error("获取用户数据失败:",a),l.show({icon:"fail",content:"获取用户数据失败",duration:2e3})}finally{o(!1)}}))()},[s]);const d=()=>{O.confirm({content:"确定要退出登录吗？",confirmText:"退出",cancelText:"取消",onConfirm:()=>{localStorage.removeItem("userToken"),localStorage.removeItem("userData"),sessionStorage.removeItem("userToken"),sessionStorage.removeItem("userData"),s("/login"),l.show({content:"已退出登录",duration:1500})}})},k=r=>{c(r),document.body.classList.toggle("high-contrast",r),l.show({content:r?"已开启高对比度模式":"已关闭高对比度模式",duration:1500})},M=r=>{h(r),document.body.style.fontSize=r?"1.2rem":"",l.show({content:r?"已开启大字体模式":"已关闭大字体模式",duration:1500})},N=r=>{try{const a=new Date(r);return`${a.getFullYear()}年${a.getMonth()+1}月`}catch(a){return"未知"}};return x?e.jsx("div",{className:"profile-container",style:{textAlign:"center",padding:"50px 0"},children:"加载中..."}):n?e.jsxs("div",{className:"profile-container",children:[e.jsx("h1",{className:"page-title",children:"个人中心"}),e.jsxs("div",{className:"user-card",children:[e.jsx(z,{src:((v=n.profile)==null?void 0:v.avatar)||"",className:"user-avatar",style:{width:"80px",height:"80px"}}),e.jsxs("div",{className:"user-info",children:[e.jsx("div",{className:"user-name",children:((C=n.profile)==null?void 0:C.display_name)||n.username}),e.jsx("div",{className:"user-phone",children:n.phone||"未设置手机号"}),e.jsxs("div",{className:"user-join-date",children:["加入时间：",N(n.created_at)]})]})]}),e.jsxs("div",{className:"settings-section",children:[e.jsxs(t,{header:"设置",children:[e.jsx(t.Item,{prefix:e.jsx(U,{}),onClick:()=>s("/friends"),children:"好友管理"}),e.jsx(t.Item,{prefix:e.jsx($,{}),onClick:()=>s("/chat"),children:"AI助手"}),e.jsx(t.Item,{prefix:e.jsx(A,{}),onClick:()=>s("/settings"),children:"系统设置"}),e.jsx(t.Item,{prefix:e.jsx(H,{}),onClick:()=>s("/help"),children:"帮助中心"}),e.jsx(t.Item,{prefix:e.jsx(T,{}),onClick:()=>s("/about"),children:"关于我们"}),e.jsx(t.Item,{prefix:e.jsx(B,{}),onClick:d,style:{color:"#ff3141"},children:"退出登录"})]}),e.jsxs(t,{header:"辅助功能",className:"accessibility-section",children:[e.jsx(t.Item,{prefix:e.jsx(y,{}),extra:e.jsx(S,{checked:u,onChange:k}),children:"高对比度模式"}),e.jsx(t.Item,{prefix:e.jsx(y,{}),extra:e.jsx(S,{checked:p,onChange:M}),children:"大字体模式"})]}),e.jsxs(t,{header:"帮助与支持",children:[e.jsx(t.Item,{prefix:e.jsx(b,{}),onClick:()=>l.show("使用帮助功能即将上线"),children:"使用帮助"}),e.jsx(t.Item,{prefix:e.jsx(b,{}),onClick:()=>l.show("关于我们功能即将上线"),children:"关于我们"})]})]}),e.jsxs(w,{className:"logout-button",block:!0,color:"danger",onClick:d,children:[e.jsx(V,{}),e.jsx("span",{className:"logout-text",children:"退出登录"})]}),e.jsx("style",{children:`
        .profile-container {
          padding: 16px;
          padding-bottom: 80px;
        }
        
        .user-card {
          display: flex;
          align-items: center;
          background-color: white;
          border-radius: 12px;
          padding: 20px;
          margin-bottom: 20px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }
        
        .user-avatar {
          margin-right: 20px;
        }
        
        .user-name {
          font-size: 18px;
          font-weight: bold;
          margin-bottom: 4px;
        }
        
        .user-phone, .user-join-date {
          color: #999;
          margin-bottom: 4px;
        }
        
        .settings-section {
          margin-bottom: 20px;
        }
        
        .accessibility-section {
          margin-top: 16px;
        }
        
        .logout-button {
          display: flex;
          align-items: center;
          justify-content: center;
          margin-top: 32px;
          height: 50px;
          font-size: 16px;
        }
        
        .logout-text {
          margin-left: 8px;
        }
      `})]}):e.jsxs("div",{className:"profile-container",style:{textAlign:"center",padding:"50px 0"},children:[e.jsx("div",{children:"未找到用户信息，请重新登录"}),e.jsx(w,{color:"primary",onClick:()=>s("/login"),style:{marginTop:"20px"},children:"返回登录页"})]})};export{Q as default};

var E=Object.defineProperty,L=Object.defineProperties;var P=Object.getOwnPropertyDescriptors;var $=Object.getOwnPropertySymbols;var T=Object.prototype.hasOwnProperty,B=Object.prototype.propertyIsEnumerable;var y=Math.pow,C=(s,o,i)=>o in s?E(s,o,{enumerable:!0,configurable:!0,writable:!0,value:i}):s[o]=i,j=(s,o)=>{for(var i in o||(o={}))T.call(o,i)&&C(s,i,o[i]);if($)for(var i of $(o))B.call(o,i)&&C(s,i,o[i]);return s},R=(s,o)=>L(s,P(o));var k=(s,o,i)=>new Promise((u,w)=>{var p=a=>{try{g(i.next(a))}catch(h){w(h)}},r=a=>{try{g(i.throw(a))}catch(h){w(h)}},g=a=>a.done?u(a.value):Promise.resolve(a.value).then(p,r);g((i=i.apply(s,o)).next())});import{j as e}from"./index-5a8bf324.js";import{r as f}from"./vendor-2240c9f5.js";import{F as d,B as I,t as D,i as l,M as F,b as x,p as A,a as b}from"./ui-2716f190.js";const _=()=>{const[s,o]=f.useState([]),[i,u]=f.useState(!1),[w,p]=f.useState(!1),[r,g]=f.useState(null),[a]=d.useForm();f.useEffect(()=>{const t=localStorage.getItem("healthRecords");t&&o(JSON.parse(t))},[]);const h=t=>{localStorage.setItem("healthRecords",JSON.stringify(t)),o(t)},O=()=>k(void 0,null,function*(){try{const t=yield a.validateFields(),n=parseFloat(t.height),c=parseFloat(t.weight),m=n&&c?(c/y(n/100,2)).toFixed(1):"",S=R(j({id:Date.now().toString()},t),{bmi:m,lastModified:new Date().toISOString()}),v=[...s,S];h(v),u(!1),a.resetFields(),b.show({content:"添加成功",duration:1500})}catch(t){b.show({content:"请填写完整信息",duration:1500})}}),q=t=>{g(t),p(!0),a.setFieldsValue(j({},t))},N=()=>k(void 0,null,function*(){try{const t=yield a.validateFields(),n=parseFloat(t.height),c=parseFloat(t.weight),m=n&&c?(c/y(n/100,2)).toFixed(1):"",S=R(j(j({},r),t),{bmi:m,lastModified:new Date().toISOString()}),v=s.map(M=>M.id===(r==null?void 0:r.id)?S:M);h(v),p(!1),a.resetFields(),b.show({content:"更新成功",duration:1500})}catch(t){b.show({content:"请填写完整信息",duration:1500})}}),Y=t=>{F.confirm({content:"确定要删除这条记录吗？",onConfirm:()=>{const n=s.filter(c=>c.id!==t);h(n),b.show({content:"删除成功",duration:1500})}})},z=()=>{const t=JSON.stringify(s,null,2),n="data:application/json;charset=utf-8,"+encodeURIComponent(t),c=`health_records_${new Date().toISOString().split("T")[0]}.json`,m=document.createElement("a");m.setAttribute("href",n),m.setAttribute("download",c),m.click()};return e.jsxs("div",{className:"health-record-container",children:[e.jsxs("div",{className:"header",children:[e.jsx("h2",{children:"健康档案"}),e.jsxs(I,{onClick:()=>u(!0),color:"primary",fill:"outline",size:"small",children:[e.jsx(D,{})," 添加记录"]})]}),e.jsx(l,{header:"体检记录列表",children:s.map(t=>e.jsx(l.Item,{title:t.date,description:`血压: ${t.bloodPressure} | 血糖: ${t.bloodSugar}`,arrow:!1,onClick:()=>q(t),extra:e.jsx(I,{color:"danger",fill:"none",size:"small",onClick:n=>{n.stopPropagation(),Y(t.id)},children:"删除"})},t.id))}),s.length>0&&e.jsx(I,{block:!0,color:"primary",fill:"outline",onClick:z,style:{marginTop:"16px"},children:"导出记录"}),e.jsx(F,{visible:i,title:"添加体检记录",onClose:()=>{u(!1),a.resetFields()},content:e.jsxs(d,{form:a,layout:"vertical",footer:null,children:[e.jsx(d.Item,{name:"date",label:"体检日期",rules:[{required:!0},{pattern:/^\d{4}-\d{2}-\d{2}$/,message:"请按照YYYY-MM-DD格式输入日期"}],children:e.jsx(x,{placeholder:"请输入日期 (格式: YYYY-MM-DD，如2023-04-01)"})}),e.jsx(d.Item,{name:"bloodPressure",label:"血压 (mmHg)",rules:[{required:!0},{pattern:/^\d+\/\d+$/,message:"请输入正确的血压格式，如120/80"}],children:e.jsx(x,{placeholder:"例如: 120/80"})}),e.jsx(d.Item,{name:"bloodSugar",label:"血糖 (mmol/L)",rules:[{required:!0},{pattern:/^\d+(\.\d+)?$/,message:"请输入有效的血糖数值"}],children:e.jsx(x,{placeholder:"例如: 5.6"})}),e.jsx(d.Item,{name:"heartRate",label:"心率 (次/分)",rules:[{required:!0},{pattern:/^\d+$/,message:"请输入有效的心率数值"}],children:e.jsx(x,{placeholder:"例如: 75"})}),e.jsx(d.Item,{name:"height",label:"身高 (cm)",rules:[{required:!0},{pattern:/^\d+(\.\d+)?$/,message:"请输入有效的身高数值"}],children:e.jsx(x,{placeholder:"例如: 170"})}),e.jsx(d.Item,{name:"weight",label:"体重 (kg)",rules:[{required:!0},{pattern:/^\d+(\.\d+)?$/,message:"请输入有效的体重数值"}],children:e.jsx(x,{placeholder:"例如: 65.5"})}),e.jsx(d.Item,{name:"result",label:"体检结果",rules:[{required:!0}],children:e.jsx(A,{placeholder:"请输入体检结果概述",rows:3})}),e.jsx(d.Item,{name:"doctorAdvice",label:"医生建议",rules:[{required:!0}],children:e.jsx(A,{placeholder:"请输入医生的建议和注意事项",rows:3})})]}),closeOnAction:!0,actions:[{key:"confirm",text:"确认",onClick:O}]}),e.jsx(F,{visible:w,title:"体检记录详情",onClose:()=>p(!1),closeOnAction:!0,content:r&&e.jsxs(l,{children:[e.jsx(l.Item,{title:"体检日期",description:r.date}),e.jsx(l.Item,{title:"身高",description:`${r.height} cm`}),e.jsx(l.Item,{title:"体重",description:`${r.weight} kg`}),e.jsx(l.Item,{title:"BMI",description:r.bmi}),e.jsx(l.Item,{title:"血压",description:`${r.bloodPressure} mmHg`}),e.jsx(l.Item,{title:"血糖",description:`${r.bloodSugar} mmol/L`}),e.jsx(l.Item,{title:"心率",description:`${r.heartRate} 次/分`}),e.jsx(l.Item,{title:"体检结果",description:r.result}),e.jsx(l.Item,{title:"医生建议",description:r.doctorAdvice}),e.jsx(l.Item,{title:"最后修改时间",description:new Date(r.lastModified).toLocaleString()})]}),actions:[{key:"edit",text:"编辑",onClick:N},{key:"close",text:"关闭",onClick:()=>p(!1)}]}),e.jsx("div",{className:"fab-container",children:e.jsx(I,{className:"fab-button",color:"primary",size:"large",onClick:()=>u(!0),children:e.jsx(D,{fontSize:24})})}),e.jsx("style",{jsx:!0,children:`
        .health-record-container {
          padding: var(--spacing-md);
          padding-bottom: 80px;
          position: relative;
          min-height: 100vh;
        }

        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--spacing-lg);
        }

        h2 {
          margin: 0;
          font-size: var(--font-size-large);
        }
        
        .fab-container {
          position: fixed;
          bottom: 80px;
          right: 20px;
          z-index: 100;
        }
        
        .fab-button {
          width: 56px;
          height: 56px;
          border-radius: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        }
      `})]})};export{_ as default};

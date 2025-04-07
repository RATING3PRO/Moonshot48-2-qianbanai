var d=Object.defineProperty;var _=(i,e,t)=>e in i?d(i,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):i[e]=t;var g=(i,e,t)=>(_(i,typeof e!="symbol"?e+"":e,t),t);var m=(i,e,t)=>new Promise((s,n)=>{var l=r=>{try{a(t.next(r))}catch(c){n(c)}},o=r=>{try{a(t.throw(r))}catch(c){n(c)}},a=r=>r.done?s(r.value):Promise.resolve(r.value).then(l,o);a((t=t.apply(i,e)).next())});import{Q as I}from"./index-5a8bf324.js";import{R as S}from"./remoteOllamaService-1d39e648.js";const h=class h{static getInterests(){return this._interests}static setInterests(e){this.clearInterests(),this._interests=[...e],this.saveInterestsToStorage()}static addInterest(e){const t=this._interests.findIndex(s=>s.category===e.category&&s.name===e.name);t>=0?this._interests[t].level=Math.max(this._interests[t].level,e.level):this._interests.push(e),this.saveInterestsToStorage()}static clearInterests(){this._interests=[],this._askedQuestions=0,this.clearInterestsFromStorage()}static saveInterestsToStorage(){try{localStorage.setItem("userInterests",JSON.stringify(this._interests))}catch(e){console.error("保存兴趣到本地存储失败:",e)}}static clearInterestsFromStorage(){try{localStorage.removeItem("userInterests")}catch(e){console.error("从本地存储中清除兴趣失败:",e)}}static loadInterestsFromStorage(){try{const e=localStorage.getItem("userInterests");e&&(this._interests=JSON.parse(e))}catch(e){console.error("从本地存储加载兴趣失败:",e)}}static shouldShowInterestDialog(){return this._interests.length>=5||this._askedQuestions>=5}static getNextQuestion(){if(this._askedQuestions<this._interestQuestions.length){const e=this._interestQuestions[this._askedQuestions];return this._askedQuestions++,e}return"您还有其他兴趣爱好想和我分享吗？"}static analyzeInterests(e,t=!0){return m(this,null,function*(){try{const s=`
请从以下用户消息中识别出可能的兴趣爱好，并按以下JSON格式返回：
[
  {
    "category": "兴趣类别，如阅读、旅游、健身等",
    "name": "具体兴趣名称",
    "level": "兴趣程度，1-一般，2-喜欢，3-热爱"
  }
]

只返回JSON数组，不要有其他文字。如果没有识别到兴趣爱好，返回空数组[]。

用户消息：${e}
`;let n="";t?n=yield I.sendMessage(s,[],"gemma3:12b"):n=yield S.sendMessage(s,[],"gemma3:12b");const l=n.match(new RegExp("\\[\\s*\\{.*\\}\\s*\\]","s"));if(l)try{const o=JSON.parse(l[0]);return o.forEach(a=>{const r=this._interests.findIndex(c=>c.category===a.category&&c.name===a.name);r>=0?this._interests[r].level=Math.max(this._interests[r].level,a.level):this._interests.push(a)}),o}catch(o){return console.error("解析兴趣JSON失败:",o),[]}return[]}catch(s){return console.error("分析兴趣爱好失败:",s),[]}})}static generateInterestPrompt(){return this._interests.length===0?"":`
我观察到用户对以下兴趣爱好表现出兴趣:
${[...this._interests].sort((t,s)=>s.level-t.level).map(t=>`- ${t.category}/${t.name} (级别:${t.level})`).join(`
`)}

请在回复中自然地引用这些兴趣，让用户感到你理解他们的喜好。如果合适，继续提问收集更多兴趣爱好信息。
`}};g(h,"_interests",[]),g(h,"_askedQuestions",0),g(h,"_interestQuestions",["您平时有哪些休闲活动或爱好呢？","您喜欢什么类型的书籍或者电影？","您平时有没有运动的习惯，比如散步、太极或者其他运动？","您有没有特别喜欢的艺术活动，比如书法、绘画或者音乐？","您对烹饪或美食有兴趣吗？有什么特别喜欢做的菜或吃的食物？","您平时喜欢去哪些地方旅行或者游玩？","您有养花种草或园艺方面的爱好吗？","您喜欢什么样的音乐或者戏曲？","您有收藏什么东西的习惯吗？比如邮票、纪念币等。","您对手工艺品制作有兴趣吗，比如编织、剪纸或者其他手工活动？"]),typeof window!="undefined"&&window.localStorage&&h.loadInterestsFromStorage();let u=h;export{u as I};

// 添加这段代码到server.js的app定义之后，来记录所有API请求
app.use((req, res, next) => {
  const originalSend = res.send;
  const originalJson = res.json;
  const startTime = Date.now();
  
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} - 开始`);
  console.log('请求体:', req.body);
  
  // 重写json方法以记录响应
  res.json = function(data) {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} - 响应:`, data);
    console.log(`请求处理时间: ${Date.now() - startTime}ms`);
    return originalJson.call(this, data);
  };
  
  // 重写send方法以记录响应
  res.send = function(data) {
    if (typeof data === 'string' && data.startsWith('{')) {
      try {
        const jsonData = JSON.parse(data);
        console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} - 响应:`, jsonData);
      } catch (e) {
        console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} - 响应: [非JSON数据]`);
      }
    } else {
      console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} - 响应: [非JSON数据]`);
    }
    console.log(`请求处理时间: ${Date.now() - startTime}ms`);
    return originalSend.call(this, data);
  };
  
  next();
}); 
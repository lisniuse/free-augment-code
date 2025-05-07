// 后台脚本，用于管理扩展的生命周期
chrome.runtime.onInstalled.addListener(() => {
  console.log('Augment续杯扩展已安装');
});

// 监听来自内容脚本的消息
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'log') {
    console.log('来自内容脚本的消息:', message.data);
  }
  return true;
});

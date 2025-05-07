// 弹出窗口脚本
document.addEventListener('DOMContentLoaded', function() {
  // 获取DOM元素
  const emailDomainInput = document.getElementById('emailDomain');
  const saveButton = document.getElementById('saveButton');
  const statusMessage = document.getElementById('statusMessage');
  const link = document.querySelector('a');

  // 从存储中加载保存的邮箱后缀
  chrome.storage.sync.get(['emailDomain'], function(result) {
    if (result.emailDomain) {
      emailDomainInput.value = result.emailDomain;
    } else {
      // 默认值
      emailDomainInput.value = 'kaoshen.store';
    }
  });

  // 保存按钮点击事件
  saveButton.addEventListener('click', function() {
    let domain = emailDomainInput.value.trim();

    // 如果用户输入了@，自动去除
    if (domain.startsWith('@')) {
      domain = domain.substring(1);
    }

    // 验证输入是否为空
    if (!domain) {
      statusMessage.textContent = '请输入有效的邮箱后缀';
      statusMessage.style.color = '#f44336';
      return;
    }

    // 保存到Chrome存储
    chrome.storage.sync.set({emailDomain: domain}, function() {
      statusMessage.textContent = '设置已保存';
      statusMessage.style.color = '#4caf50';

      // 3秒后清除状态消息
      setTimeout(function() {
        statusMessage.textContent = '';
      }, 3000);
    });
  });

  // 添加点击事件，在新标签页中打开链接
  if (link) {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      chrome.tabs.create({ url: this.href });
    });
  }
});

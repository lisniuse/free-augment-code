// 弹出窗口脚本
document.addEventListener('DOMContentLoaded', function() {
  // 获取DOM元素
  const emailDomainInput = document.getElementById('emailDomain');
  const randomLengthInput = document.getElementById('randomLength');
  const saveButton = document.getElementById('saveButton');
  const statusMessage = document.getElementById('statusMessage');
  const link = document.querySelector('a');
  const increaseBtn = document.getElementById('increaseBtn');
  const decreaseBtn = document.getElementById('decreaseBtn');
  const currentValue = document.getElementById('currentValue');

  // 更新当前值显示
  function updateCurrentValue() {
    const value = randomLengthInput.value.trim();
    if (value) {
      currentValue.textContent = value + '位';
    } else {
      currentValue.textContent = '12位(默认)';
    }
  }

  // 从存储中加载保存的设置
  chrome.storage.sync.get(['emailDomain', 'randomLength'], function(result) {
    if (result.emailDomain) {
      emailDomainInput.value = result.emailDomain;
    }

    // 设置随机字符串位数
    if (result.randomLength) {
      randomLengthInput.value = result.randomLength;
    }

    // 初始化显示当前值
    updateCurrentValue();
  });

  // 增加按钮点击事件
  increaseBtn.addEventListener('click', function() {
    const currentVal = parseInt(randomLengthInput.value) || 0;
    if (currentVal < 32) {
      randomLengthInput.value = currentVal + 1;
      updateCurrentValue();
    }
  });

  // 减少按钮点击事件
  decreaseBtn.addEventListener('click', function() {
    const currentVal = parseInt(randomLengthInput.value) || 2;
    if (currentVal > 1) {
      randomLengthInput.value = currentVal - 1;
      updateCurrentValue();
    }
  });

  // 输入框值变化事件
  randomLengthInput.addEventListener('input', updateCurrentValue);

  // 保存按钮点击事件
  saveButton.addEventListener('click', function() {
    let domain = emailDomainInput.value.trim();
    let length = randomLengthInput.value.trim();

    // 如果用户输入了@，自动去除
    if (domain.startsWith('@')) {
      domain = domain.substring(1);
    }

    // 验证邮箱后缀输入是否为空
    if (!domain) {
      statusMessage.textContent = '请输入有效的邮箱后缀';
      statusMessage.style.color = '#f44336';
      return;
    }

    // 验证邮箱后缀格式
    if (domain.includes('@') || !domain.includes('.')) {
      statusMessage.textContent = '请输入正确的域名格式，如 example.com';
      statusMessage.style.color = '#f44336';
      return;
    }

    // 验证随机字符串位数
    if (length && (isNaN(length) || parseInt(length) < 1 || parseInt(length) > 32)) {
      statusMessage.textContent = '请输入1-32之间的有效位数';
      statusMessage.style.color = '#f44336';
      return;
    }

    // 准备要保存的数据
    const dataToSave = {
      emailDomain: domain
    };

    // 如果用户设置了位数，则保存
    if (length) {
      dataToSave.randomLength = length;
    }

    // 保存到Chrome存储
    chrome.storage.sync.set(dataToSave, function() {
      statusMessage.textContent = '设置已保存';
      statusMessage.style.color = '#4caf50';

      // 更新显示
      updateCurrentValue();

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

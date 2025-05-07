// 检查当前URL是否匹配目标页面
function checkUrl() {
  const targetUrl = 'login.augmentcode.com/u/login/identifier';
  const currentUrl = window.location.href;

  // 检查URL是否匹配目标页面
  // 由于state参数可能会变化，我们只检查基本路径
  if (currentUrl.includes(targetUrl)) {
    console.log('Augment续杯: 检测到登录页面');
    // 检查续杯按钮是否已存在
    if (!document.querySelector('.refill-button-added')) {
      addRefillButton();
    }
  }
}

// 添加续杯按钮
function addRefillButton() {
  // 等待原始按钮加载
  const checkExist = setInterval(() => {
    const originalButton = document.querySelector('button[name="action"][value="default"]');

    if (originalButton && !document.querySelector('.refill-button-added')) {
      clearInterval(checkExist);

      // 创建续杯按钮
      const refillButton = document.createElement('button');
      refillButton.type = 'button';
      refillButton.textContent = '续杯';
      refillButton.className = 'refill-button-added'; // 添加特殊类名用于检测

      // 复制原始按钮的样式类
      originalButton.classList.forEach(className => {
        refillButton.classList.add(className);
      });

      // 添加点击事件
      refillButton.addEventListener('click', handleRefill);

      // 将按钮插入到原始按钮后面
      originalButton.parentNode.insertBefore(refillButton, originalButton.nextSibling);
      // 设置标志，表示按钮已添加
      buttonAdded = true;
      // 停止观察DOM变化
      observer.disconnect();
      console.log('Augment续杯: 续杯按钮已添加');
    }
  }, 500);
}

// 处理续杯按钮点击
function handleRefill() {
  // 生成随机邮箱（现在返回Promise）
  generateRandomEmail().then(randomEmail => {
    console.log('Augment续杯: 生成随机邮箱', randomEmail);

    // 填入邮箱输入框
    const emailInput = document.querySelector('input[name="username"]');
    if (emailInput) {
      emailInput.value = randomEmail;
      // 触发input事件，确保表单验证能够识别值的变化
      const inputEvent = new Event('input', { bubbles: true });
      emailInput.dispatchEvent(inputEvent);

      // 自动点击原始按钮
      setTimeout(() => {
        const originalButton = document.querySelector('button[name="action"][value="default"]');
        if (originalButton) {
          originalButton.click();
          console.log('Augment续杯: 自动点击继续按钮');
        }
      }, 500);
    }
  }).catch(error => {
    console.error('Augment续杯: 生成邮箱时出错', error);
  });
}

// 生成随机邮箱
function generateRandomEmail() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const charactersLength = characters.length;

  // 从存储中获取邮箱后缀和随机字符串位数，如果没有则使用默认值
  return new Promise((resolve) => {
    chrome.storage.sync.get(['emailDomain', 'randomLength'], function(data) {
      const domain = data.emailDomain || 'kaoshen.store';
      // 使用设置的位数，默认为12位
      const length = data.randomLength ? parseInt(data.randomLength) : 12;

      // 生成随机字符串
      for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
      }

      resolve(result + '@' + domain);
    });
  });
}

// 创建一个标志，用于跟踪按钮是否已添加
let buttonAdded = false;

// 使用防抖函数来限制checkUrl的调用频率
function debounce(func, wait) {
  let timeout;
  return function() {
    clearTimeout(timeout);
    timeout = setTimeout(func, wait);
  };
}

// 防抖处理的checkUrl函数
const debouncedCheckUrl = debounce(checkUrl, 300);

// 在页面变化时检查URL，但使用更精确的选择器和配置
const observer = new MutationObserver((mutations) => {
  // 只有当按钮尚未添加时才继续检查
  if (!buttonAdded) {
    debouncedCheckUrl();
  }
});

// 使用更精确的配置来观察DOM变化
observer.observe(document.body, {
  childList: true,
  subtree: true,
  attributes: false,
  characterData: false
});

// 初始检查
setTimeout(checkUrl, 500);

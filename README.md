# Augment续杯 浏览器插件

这是一个Chrome浏览器扩展，用于在Augment登录页面添加"续杯"功能。

## 功能

- 在Augment登录页面添加"续杯"按钮
- 点击按钮后自动生成随机邮箱地址
- 自动填入登录表单并点击继续按钮
- 支持自定义邮箱后缀
- 支持自定义随机字符串位数（默认为12位）

## 开发指南

### 环境要求

- Node.js (推荐 v14 或更高版本)
- npm (推荐 v6 或更高版本)

### 安装依赖

```bash
npm install
```

### 构建扩展

```bash
npm run build
```

构建完成后，将在 `dist` 目录中生成一个 ZIP 文件，可以直接分享给其他人使用。

## 安装方法

### 开发版本

1. 克隆此仓库
2. 安装依赖: `npm install`
3. 构建扩展: `npm run build`
4. 打开Chrome浏览器，进入扩展管理页面 (chrome://extensions/)
5. 开启"开发者模式"
6. 点击"加载已解压的扩展程序"
7. 选择 `dist/build` 目录

### 用户版本

1. 下载最新的 ZIP 文件
2. 解压 ZIP 文件
3. 打开Chrome浏览器，进入扩展管理页面 (chrome://extensions/)
4. 开启"开发者模式"
5. 点击"加载已解压的扩展程序"
6. 选择解压后的文件夹

## 使用方法

1. 安装扩展后，点击扩展图标，可以设置自定义邮箱后缀（默认为 kaoshen.store）和随机字符串位数（默认为12位）
2. 访问 [Augment登录页面](https://login.augmentcode.com/u/login/identifier)
3. 在登录页面上，您将看到原始"Continue"按钮下方出现一个"续杯"按钮
4. 点击"续杯"按钮，它将自动生成随机邮箱并填入表单，然后自动点击继续按钮

## 项目结构

```
augment-refill/
├── dist/               # 构建输出目录
├── scripts/            # 构建脚本
├── src/                # 源代码
│   ├── background.js   # 后台脚本
│   ├── content.js      # 内容脚本
│   ├── icon.ico        # 扩展图标
│   ├── manifest.json   # 扩展配置
│   ├── popup.html      # 弹出窗口HTML
│   └── popup.js        # 弹出窗口脚本
├── package.json        # 项目配置
└── README.md           # 项目说明
```

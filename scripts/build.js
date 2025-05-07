/**
 * 构建脚本 - 将src目录中的文件打包成Chrome扩展
 */

const fs = require('fs-extra');
const path = require('path');
const archiver = require('archiver');

// 路径配置
const rootDir = path.resolve(__dirname, '..');
const srcDir = path.join(rootDir, 'src');
const distDir = path.join(rootDir, 'dist');
const buildDir = path.join(distDir, 'build');

// 需要打包的文件列表
const filesToInclude = [
  'manifest.json',
  'content.js',
  'background.js',
  'popup.html',
  'popup.js',
  'icon.ico'
];

/**
 * 清理目录
 */
async function cleanDirectories() {
  console.log('清理目录...');
  await fs.emptyDir(distDir);
  await fs.ensureDir(buildDir);
}

/**
 * 复制文件到构建目录
 */
async function copyFiles() {
  console.log('复制文件到构建目录...');
  
  for (const file of filesToInclude) {
    const srcPath = path.join(srcDir, file);
    const destPath = path.join(buildDir, file);
    
    if (await fs.pathExists(srcPath)) {
      await fs.copy(srcPath, destPath);
      console.log(`  复制: ${file}`);
    } else {
      console.warn(`  警告: 文件不存在 - ${file}`);
    }
  }
}

/**
 * 创建ZIP包
 */
async function createZipPackage() {
  console.log('创建ZIP包...');
  
  // 生成时间戳
  const timestamp = new Date().toISOString().replace(/[-:]/g, '').replace('T', '').substring(0, 14);
  const zipFileName = `Augment续杯_${timestamp}.zip`;
  const zipFilePath = path.join(distDir, zipFileName);
  
  // 创建写入流
  const output = fs.createWriteStream(zipFilePath);
  const archive = archiver('zip', {
    zlib: { level: 9 } // 最高压缩级别
  });
  
  // 监听错误
  archive.on('error', (err) => {
    throw err;
  });
  
  // 管道连接
  archive.pipe(output);
  
  // 添加文件
  archive.directory(buildDir, false);
  
  // 完成归档
  await archive.finalize();
  
  console.log(`ZIP包创建成功: ${zipFileName}`);
  return zipFilePath;
}

/**
 * 主构建函数
 */
async function build() {
  try {
    console.log('开始构建 Augment续杯 Chrome扩展...');
    
    // 清理目录
    await cleanDirectories();
    
    // 复制文件
    await copyFiles();
    
    // 创建ZIP包
    const zipFilePath = await createZipPackage();
    
    console.log(`\n构建成功! 文件已保存到: ${zipFilePath}`);
    console.log('\n您可以将此ZIP文件直接分享给其他人使用。');
    console.log('安装方法:');
    console.log('1. 解压ZIP文件');
    console.log('2. 打开Chrome浏览器，进入扩展管理页面 (chrome://extensions/)');
    console.log('3. 开启"开发者模式"');
    console.log('4. 点击"加载已解压的扩展程序"');
    console.log('5. 选择解压后的文件夹');
    
  } catch (error) {
    console.error('构建过程中出错:', error);
    process.exit(1);
  }
}

// 执行构建
build();

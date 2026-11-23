# LockTab

[![版本](https://img.shields.io/badge/version-1.0.1-4f46e5)](https://github.com/el9a7rawi/LockTab/releases)
[![许可证：Apache-2.0](https://img.shields.io/badge/license-Apache--2.0-047857)](LICENSE)
[![Manifest V3](https://img.shields.io/badge/Manifest-V3-7c3aed)](manifest.json)

**用 PIN 保护你的标签页。**

LockTab 是一款离线小型扩展，用 6 位 PIN 隐藏任意标签页。设置一个全局 PIN，必要时给敏感页面
单独设一个，然后放心离开座位。

> 其他语言：[English](README.md) · [Español](README.es.md) · [Français](README.fr.md) ·
> [Deutsch](README.de.md) · [Português (Brasil)](README.pt-BR.md) · [Русский](README.ru.md) ·
> [العربية](README.ar.md)

## 为什么选择 LockTab

- **真正隐藏页面。** 闭合 shadow root 覆盖层会遮住内容、锁定焦点并阻止底层滚动。页面若删除它，它会重新出现。
- **不明文保存密码。** PIN 通过 PBKDF2-HMAC-SHA256 派生（600,000 次迭代，独立的 16 字节盐）。只保存哈希，且只存在你的设备上。
- **弹窗无法绕过。** 任何扩大访问范围的操作都会再次要求输入 PIN。
- **共用计数器。** 连续错误会升级为 30 秒 → 60 秒 → 300 秒 → 900 秒的锁定。使用全局 PIN 时，切换标签页不会重置计数。
- **无需服务器的恢复方式。** 设置 PIN 时显示一次性恢复码；使用后即失效，并清除所有锁定。
- **隐私设计。** 无账号、无遥测、无远程代码、无网络请求。

## 安装

### Chrome、Edge、Brave、Opera

1. 从 [Releases](https://github.com/el9a7rawi/LockTab/releases) 下载 `locktab-chrome-1.0.1.zip`。
2. 解压到文件夹。
3. 打开 `chrome://extensions`，开启**开发者模式**。
4. 点击**加载已解压的扩展程序**，选择解压后的文件夹。

### Firefox 121+

1. 从 [Releases](https://github.com/el9a7rawi/LockTab/releases) 下载 `locktab-firefox-1.0.1.zip`。
2. 解压到文件夹。
3. 打开 `about:debugging#/runtime/this-firefox`，选择**载入临时附加组件**。
4. 选中解压文件夹里的 `manifest.json`。

## 使用

1. 点击 LockTab 图标。首次运行会要求创建 PIN（6 位数字）。
2. **保存恢复码** —— 它只显示一次。
3. 打开要保护的标签页，点击图标，选择**锁定此标签页**。
4. 再次查看时，在覆盖层输入 PIN。弹窗中的**暂时解锁**和**移除锁定**都会先要求 PIN。
5. 可在**此网站的 PIN** 卡片中为单个网站设置独立 PIN。

弹窗还提供主题切换、语言选择、解锁时长、图标计数开关、修改 PIN 和完全重置。

## 安全模型

| 决定 | 原因 |
| --- | --- |
| 仅在后台页面校验 | 内容脚本运行在网页可影响的环境中，永远看不到哈希、盐或尝试次数。 |
| 忽略查询字符串与片段 | 重定向不能靠添加 `?utm_source=…` 摆脱锁定。 |
| 覆盖层使用闭合 shadow root | 宿主页面无法读取或改写锁界面。 |
| 尝试次数串行写入 | 两次同时点击不会换来额外一次尝试。 |
| 临时解锁在浏览器启动时清除 | 关闭浏览器视为离开工位。 |

LockTab 用于防止他人坐到你的设备前看到页面。它不是磁盘加密，也无法防御被入侵的浏览器或有权删除扩展的管理员。

完整隐私政策见 [privacy.html](privacy.html)。

## 语言

English、Español、Français、Deutsch、Português (Brasil)、Русский、العربية（RTL）和简体中文。界面默认跟随浏览器语言，也可在弹窗中手动选择。

## 从源码构建

```bash
python tools/build.py          # 校验语言文件并生成两个发布包
node --test tests/core.test.mjs
```

无需打包工具，也没有 npm 依赖。

## 支持

如果 LockTab 帮你避免过尴尬时刻，可以支持这个项目：

- PayPal: <https://paypal.me/27medYousry>
- InstaPay: <https://ipn.eg/S/el9a7rawi/instapay/30U5SS>

## 许可证

Apache-2.0 © Ahmed Yousry

用心打造 ❤️ Ahmed Yousry · [GitHub](https://github.com/el9a7rawi/LockTab)

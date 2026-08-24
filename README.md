# AI 划词翻译 Windows

一个使用 Rust + Tauri 2 编写的 Windows 全局划词翻译工具。它不提供常驻的主翻译窗口：鼠标选中文字后，在选区附近显示一个红点；将鼠标悬停到红点上才会读取选区并打开翻译卡片。

当前版本：**v0.4.4**

## 功能

- Windows 全局鼠标划词，选区附近只显示一个小红点。
- 悬停红点自动打开翻译卡片，无需再次点击。
- 流式显示译文。
- 在卡片内选择目标语言和附加要求。
- 卡片可拖动、手动调整大小，也会按本次原文和译文自动调整初始大小。
- 可置顶；未置顶时点击其他程序会自动隐藏。
- 一键复制译文。
- 系统托盘打开设置或退出程序。
- 管理多个 OpenAI 兼容服务商和模型。
- 支持 Responses API 与 Chat Completions API。

本版本已经移除旧的主翻译窗口、全局快捷键划词和卡片内的设置入口。设置统一从系统托盘打开。

## 使用方法

1. 首次启动后，在系统托盘找到 **AI 划词翻译**，打开“设置”。
2. 添加服务商、API 地址、API Key 和模型真实名称，保存设置。
3. 在浏览器、Office、PDF 阅读器、编辑器等程序中用鼠标拖动选中文字。
4. 将鼠标移到选区附近出现的红点上。
5. 翻译卡片自动打开并开始翻译。

卡片右上角的 Windows 标题栏用于拖动、缩放和关闭。卡片中的置顶按钮位于“附加要求”右侧。

## 为什么不会再干扰 Snipaste

旧实现只要检测到鼠标拖动，就立即模拟一次 `Ctrl+C` 读取选区。Snipaste 截图时同样会发生鼠标拖动，因此这个模拟复制会被 Snipaste 接收，导致截图提前完成或窗口关闭。

v0.4.3 做了两层限制：

- 只有鼠标按下、开始拖动时位于标准文本 I-beam 光标区域，才把这次拖动视为文字选择；
- 松开鼠标时只显示红点，不复制内容；只有悬停红点后才模拟 `Ctrl+C`。

松开位置不再要求仍是文字光标，因此拖到行尾、空白处或窗口边缘也会显示红点；截图、绘图和框选操作不会因普通拖动而触发复制。若某个软件使用自绘文字光标，它可能无法被自动识别。

## 设置与数据

设置文件位于：

```text
%LOCALAPPDATA%\AI.Translator\settings.json
```

当前版本的服务商配置和 API Key 保存在这个本地 JSON 文件中，仅供当前 Windows 用户使用。请不要把该文件上传、共享或提交到 Git。划词内容只有在悬停红点、开始翻译后才会发送到你配置的模型服务商。

“保存”和窗口关闭按钮都会隐藏设置窗口，之后可从系统托盘再次打开。

## 服务商配置

基础网址填写服务商的 OpenAI 兼容 API 根地址，例如：

```text
https://api.openai.com/v1
```

模型“真实名称”必须与服务商文档一致。HTTP 状态码由服务商返回，例如：

- `401/403`：API Key、权限或接口地址有误；
- `402 Insufficient account balance`：服务商账户余额不足，需要充值或更换有额度的 Key；
- `429`：请求频率或额度限制。

## 本地构建

要求：

- Windows 10/11；
- Node.js 20 或更高版本；
- Rust 1.77.2 或更高版本；
- Visual Studio Build Tools 2022，并勾选“使用 C++ 的桌面开发”；
- WebView2 Runtime。

PowerShell：

```powershell
Set-ExecutionPolicy -Scope Process Bypass
.\build-windows.ps1
```

开发运行：

```powershell
npm install
npm run dev
```

NSIS 安装包生成到：

```text
src-tauri\target\release\bundle\nsis
```

## GitHub Actions 构建

仓库包含 `.github/workflows/build-windows.yml`。推送分支、提交 PR 或手动运行工作流后，会在 Windows Runner 上检查前端、编译 Rust，并生成可下载的 NSIS 安装包。

打开仓库的 **Actions** 页面，进入成功的 **Build Windows x64** 任务，在页面底部下载 Artifact。

## 项目结构

```text
src/
  selection.html/css/js   划词红点和翻译卡片
  settings.html/css/js    设置界面
src-tauri/
  src/main.rs             Windows 选区检测、窗口、托盘和模型请求
  tauri.conf.json         Tauri 窗口及安装包配置
.github/workflows/
  build-windows.yml       Windows CI 打包
```

## 已知限制

- 管理员权限程序与普通权限程序之间可能受 Windows UIPI 限制；需要让两边以相同权限运行。
- 禁止复制的 PDF、受保护页面、游戏和部分自绘控件可能无法读取文字。
- 仅恢复原剪贴板中的纯文本；图片、文件列表或复杂富文本不能保证完整恢复。
- 自动检测依赖拖动起点处的标准 I-beam 文本光标，因此部分自绘界面需要后续做专门兼容。

## 发布前建议测试

- Chrome/Edge、Word/WPS、常用 PDF 阅读器和代码编辑器；
- Snipaste/F1 截图、截图框选与复制；
- 单屏、多显示器、不同缩放比例；
- 置顶/非置顶、拖动、缩放、外部点击自动隐藏；
- 设置窗口的保存、关闭和从托盘重新打开。

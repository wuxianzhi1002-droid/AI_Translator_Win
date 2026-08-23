# AI 翻译工具 Windows 版

这是 `TranslatorMac` 的 Windows/Rust 移植工程。Rust 负责模型请求、流式响应、API Key、全局快捷键、剪贴板和窗口管理，界面由 Tauri 2 使用 Windows 自带的 WebView2 显示，不包含 Electron/Chromium 运行时。

## 已实现功能

- 原版左右双栏翻译界面、托盘式后台运行和窗口置顶。
- 多服务商、多模型、目标语言、附加要求和提示词配置。
- OpenAI Responses API 与兼容 Chat Completions。
- OpenAI、阿里云百炼、智谱 AI、小米 MiMo 的翻译优化参数。
- 流式显示、手动提交、7 秒自动提交、复制译文。
- API Key 通过 Windows Credential Manager 保存，不写入设置 JSON。
- 全局划词翻译：默认 `Ctrl+Alt+T`，可修改快捷键。
- 在鼠标附近弹出划词译文，可复制、固定或关闭。

## 划词翻译的工作方式

1. 在浏览器、Word、PDF 阅读器、聊天软件或编辑器中选中文字。
2. 按 `Ctrl+Alt+T`。
3. 程序模拟一次 `Ctrl+C`，读取文字后恢复原来的纯文本剪贴板内容。
4. 译文窗口显示在鼠标附近。

多数支持标准复制操作的软件都可以使用。管理员权限程序、受保护页面、游戏、自绘控件或禁止复制的 PDF 可能无法读取选区。当前版本只保证恢复剪贴板中的纯文本；如果剪贴板原来只有图片或复杂富文本，触发划词翻译后无法完整恢复全部格式。

## Windows 构建

要求：

- Windows 10 1803 或更高版本 / Windows 11；
- Node.js 20+；
- Rust 1.77.2+；
- Visual Studio Build Tools 2022，勾选“使用 C++ 的桌面开发”；
- WebView2 Runtime（Windows 11 默认自带，大多数 Windows 10 设备也已安装）。

在 PowerShell 中运行：

```powershell
Set-ExecutionPolicy -Scope Process Bypass
.\build-windows.ps1
```

生成的 `.msi` 和 NSIS 安装包位于：

```text
src-tauri\target\release\bundle
```

开发运行：

```powershell
npm install
npm run dev
```

## 数据位置

- 普通设置：`%LOCALAPPDATA%\AI.Translator\settings.json`
- API Key：Windows Credential Manager，服务名 `AI.Translator.ProviderAPIKey`

## 已知待完善项

- 当前配置编辑器为了保持依赖精简，服务商和模型编辑使用系统输入框；后续可换成更完整的表单。
- 网络诊断日志字段已保留，但详细日志轮换尚未接入。
- 发布前建议在真实 Windows 10 和 Windows 11 各执行一次安装、托盘、快捷键冲突和多显示器弹窗测试。

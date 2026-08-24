# AI 划词翻译 Windows

一个使用 **Rust + Tauri 2** 编写的轻量级 Windows 全局划词翻译工具。

鼠标选中文字后，软件会在选区附近显示一个小红点；将鼠标悬停到红点上即可打开翻译卡片并开始翻译，无需再次点击，也不需要全局快捷键。

当前版本：**v0.5.0**

## 主要功能

- 支持 Windows 全局划词翻译。
- 支持正向拖选、反向拖选和双击选词。
- 选区稳定约 0.12 秒后显示单个红点。
- 悬停红点自动打开翻译卡片。
- 流式显示翻译结果。
- 可在翻译卡片中选择目标语言和附加要求。
- 翻译卡片可拖动、缩放、置顶和复制译文。
- 未置顶时，点击其他程序会自动隐藏卡片。
- 系统托盘提供“设置”和“退出”入口。
- 支持 Windows 登录后自动启动，首次安装默认开启。
- 支持多个服务商和多个模型。
- 支持 OpenAI Responses API 与 Chat Completions API。
- 兼容 OpenAI、阿里云百炼、智谱 AI、小米 MiMo，以及 DeepSeek、硅基流动、OpenRouter 等 OpenAI 兼容服务。

v0.5.0 已移除旧版主翻译窗口、全局快捷键划词以及翻译卡片内的设置入口。所有设置统一从系统托盘打开。

## 下载与安装

### 从 GitHub Actions 下载

1. 打开仓库的 [Actions 页面](https://github.com/wuxianzhi1002-droid/AI_Translator_Win/actions)。
2. 进入一个成功完成的 **Build Windows Application** 工作流。
3. 在页面底部下载名为 **AI-Translator-Windows-x64** 的 Artifact。
4. 解压后运行其中的 NSIS 安装程序。

当前安装包尚未使用商业代码签名证书。Windows SmartScreen 可能显示安全提醒，请确认安装包来自本仓库后再继续。

软件需要 Microsoft Edge WebView2 Runtime。Windows 10/11 通常已经安装；若界面无法打开，可从 [Microsoft WebView2 官方页面](https://developer.microsoft.com/microsoft-edge/webview2/) 安装运行时。

## 快速使用

1. 安装并启动软件。
2. 在 Windows 系统托盘找到 **AI 划词翻译** 图标。
3. 右键托盘图标，打开“设置”。
4. 添加服务商，填写基础网址、API Key 和模型真实名称。
5. 保存设置。
6. 在浏览器、Office、WPS、PDF 阅读器或编辑器中选中文字。
7. 等待选区附近出现红点，然后将鼠标悬停到红点上。
8. 翻译卡片会自动打开并开始翻译。

翻译卡片支持：

- 修改目标语言和附加要求；
- 复制译文；
- 置顶或取消置顶；
- 拖动窗口；
- 手动调整窗口大小；
- 关闭后重新划词唤起。

## 设置说明

### 服务商字段

| 字段 | 填写说明 |
| --- | --- |
| 显示名称 | 只用于软件内辨认，可以自行命名。 |
| 基础网址 | 填写服务商的 API 根地址，或直接填写完整接口地址；不要填写网页版聊天地址。 |
| 接口格式 | 根据服务商选择 **Responses API** 或 **Chat Completions API**。除 OpenAI 外，大多数兼容服务请选择 Chat Completions。 |
| 优化方案 | 选择对应服务商；不在列表中的兼容服务选择“通用”。 |
| 启用优化参数 | 会向请求加入关闭思考等服务商专用参数。若出现参数不兼容的 400 错误，请关闭此项重试。 |
| API Key | 从服务商控制台创建。Key、接口地址、地区和套餐必须互相匹配。 |
| 模型显示名称 | 只用于界面显示，可以自行填写。 |
| 模型真实名称 | 必须填写服务商 API 文档或控制台提供的准确模型 ID。 |

### 地址自动补全规则

软件会根据“接口格式”自动补全请求路径：

- Responses API：自动补上 `/responses`；
- Chat Completions API：自动补上 `/chat/completions`。

例如，填写：

```text
https://api.xiaomimimo.com/v1
```

并选择 Chat Completions 后，最终请求地址是：

```text
https://api.xiaomimimo.com/v1/chat/completions
```

也可以直接填写完整接口地址。只要地址已经以 `responses` 或 `chat/completions` 结尾，软件就不会重复追加。地址末尾是否有 `/` 均可。

## 常用服务商地址

以下地址来自各服务商官方 API 文档。服务商可能调整地址、模型和套餐规则；如果请求失败，请优先核对对应官方文档和控制台。

| 服务商 | 建议填写的基础网址 | 接口格式 | 优化方案 | 说明 |
| --- | --- | --- | --- | --- |
| OpenAI | `https://api.openai.com/v1` | Responses 或 Chat Completions | OpenAI | 新项目优先使用 Responses；具体取决于模型是否支持。 |
| 阿里云百炼（北京） | `https://dashscope.aliyuncs.com/compatible-mode/v1` | Chat Completions | 阿里云 | API Key 必须属于相同地区。 |
| 阿里云百炼（新加坡） | `https://dashscope-intl.aliyuncs.com/compatible-mode/v1` | Chat Completions | 阿里云 | API Key 必须属于相同地区。 |
| 阿里云百炼（美国） | `https://dashscope-us.aliyuncs.com/compatible-mode/v1` | Chat Completions | 阿里云 | API Key 必须属于相同地区。 |
| 智谱 AI 开放平台 | `https://open.bigmodel.cn/api/paas/v4` | Chat Completions | 智谱 | 普通开放平台按量 API 地址。 |
| 小米 MiMo 按量 API | `https://api.xiaomimimo.com/v1` | Chat Completions | 小米 | 使用按量 API Key，并保证账户有可用余额。 |
| 小米 MiMo Token Plan | `https://token-plan-cn.xiaomimimo.com/v1` | Chat Completions | 小米 | 仅使用 Token Plan 创建的 `tp-` Key，并遵守套餐用途限制。 |
| DeepSeek | `https://api.deepseek.com` | Chat Completions | 通用 | 软件会补成 `https://api.deepseek.com/chat/completions`。 |
| 硅基流动 SiliconFlow | `https://api.siliconflow.cn/v1` | Chat Completions | 通用 | 模型真实名称以硅基流动控制台为准。 |
| OpenRouter | `https://openrouter.ai/api/v1` | Chat Completions | 通用 | 模型真实名称通常包含提供方前缀，以控制台为准。 |

官方文档：

- [OpenAI Responses API](https://platform.openai.com/docs/api-reference/responses)
- [OpenAI Chat Completions API](https://platform.openai.com/docs/api-reference/chat)
- [阿里云百炼 Base URL 与地域说明](https://help.aliyun.com/zh/model-studio/base-url)
- [阿里云百炼 OpenAI 兼容接口](https://help.aliyun.com/zh/model-studio/compatibility-of-openai-with-dashscope)
- [阿里云百炼 Token Plan 适用范围](https://help.aliyun.com/zh/model-studio/other-tools-token-plan)
- [智谱 AI API 快速开始](https://docs.bigmodel.cn/cn/api/introduction)
- [小米 MiMo 首次 API 调用](https://mimo.mi.com/docs/zh-CN/quick-start/first-api-call)
- [小米 MiMo OpenAI 兼容接口](https://mimo.mi.com/docs/zh-CN/api/chat/openai-api)
- [DeepSeek API 文档](https://api-docs.deepseek.com/)
- [硅基流动 API 文档](https://docs.siliconflow.cn/)
- [OpenRouter API 文档](https://openrouter.ai/docs/quickstart)

### 阿里云百炼工作空间地址

如果使用百炼工作空间专属 API，请将 `{WorkspaceId}` 替换成真实工作空间 ID：

| 地区 | 工作空间基础网址 |
| --- | --- |
| 北京 | `https://{WorkspaceId}.cn-beijing.maas.aliyuncs.com/compatible-mode/v1` |
| 新加坡 | `https://{WorkspaceId}.ap-southeast-1.maas.aliyuncs.com/compatible-mode/v1` |
| 日本 | `https://{WorkspaceId}.ap-northeast-1.maas.aliyuncs.com/compatible-mode/v1` |

百炼不同地区的 API Key 与数据相互独立。不要把北京地区的 Key 与新加坡或美国地址混用。

阿里云 Token Plan/Coding Plan 有特定工具和使用场景限制。这个桌面翻译软件属于自定义应用，通常应使用百炼通用按量 API Key；只有服务商当前套餐条款明确允许时，才使用套餐专用地址和 Key。

### 智谱 Coding Plan

智谱普通开放平台建议使用：

```text
https://open.bigmodel.cn/api/paas/v4
```

Coding Plan 的地址与普通开放平台不同。除非你的套餐明确允许用于本软件，否则不要把 Coding Plan 地址或 Key 与普通 API 混用。

### 目标语言、附加要求与提示词

- “目标语言”决定译文输出语言。
- “附加要求”可以设置语气、专业领域或表达风格。
- 自定义提示词模板时，保留设置界面要求的变量标记，否则软件无法正确插入原文、目标语言和附加要求。
- 修改设置后点击“保存”。保存和关闭按钮都会隐藏设置窗口，可随时从托盘重新打开。

### 开机自启动

设置中的“登录 Windows 后自动启动”默认开启。软件使用当前用户的注册表启动项：

```text
HKCU\Software\Microsoft\Windows\CurrentVersion\Run
```

值名称：

```text
AI Translator Windows
```

关闭自启动开关并保存即可移除。由于使用的是当前用户启动项，不需要管理员权限，也不会为其他 Windows 用户启用。

## 常见错误

| 错误 | 常见原因与处理方式 |
| --- | --- |
| HTTP 400 | 模型不支持当前接口格式或优化参数。核对模型真实名称，切换 API 格式，或关闭“启用优化参数”。 |
| HTTP 401 | API Key 无效、过期，或没有随请求正确授权。重新创建并填写 Key。 |
| HTTP 403 | Key 没有模型权限，或套餐、地区、基础网址不匹配。 |
| HTTP 402 | 账户余额或套餐额度不足。小米 MiMo 返回 `Insufficient account balance` 时需要充值、更换有余额的按量 Key，或正确配置 Token Plan 地址与 `tp-` Key；这不是软件界面故障。 |
| HTTP 404 | 基础网址、完整路径或接口格式错误。检查是否选错 Responses/Chat Completions。 |
| HTTP 429 | 请求过于频繁、并发受限，或账户额度已经用完。稍后重试并查看服务商控制台。 |
| 一直没有译文 | 服务商可能不兼容 SSE 流式返回，或模型没有返回文本内容。先检查服务商日志和模型能力。 |

排查时建议依次确认：

1. 基础网址是否为 API 地址，而不是网页版地址；
2. API Key 是否属于同一服务商、地区和套餐；
3. 接口格式是否正确；
4. 模型真实名称是否完全一致；
5. 关闭优化参数后是否恢复；
6. 服务商账户是否有余额和调用权限。

## 选区检测原理

v0.5.0 使用“真实选区优先”的混合方案：

- 鼠标松开后等待约 0.12 秒；期间如果发生新的鼠标操作，旧检测会被取消，只处理最后一次稳定选区；
- 优先通过 Windows UI Automation Text Pattern 读取非空文本选区，因此正向拖选、反向拖选和双击选词使用同一规则；
- UI Automation 不可用时，仅对文本光标区域内的拖选或双击启用后备检测；
- 后备检测只显示红点，鼠标悬停红点后才模拟一次复制并开始翻译；
- 密码控件会被排除；
- 普通点击、截图框选和绘图拖动不会主动发送复制快捷键。

### Snipaste 兼容

旧版在鼠标松开时直接发送 `Ctrl+C`，可能使 Snipaste 把复制动作误认为确认截图，从而提前关闭截图窗口。v0.5.0 改为优先读取真实 UI Automation 选区，并把后备复制延迟到悬停红点之后，因此普通 F1 截图和框选过程不会触发模拟复制。

少数自绘控件、受保护 PDF 或未公开 UI Automation 文本选区的软件仍可能使用后备模式。

## 设置、隐私与数据

设置文件位于：

```text
%LOCALAPPDATA%\AI.Translator\settings.json
```

当前版本的服务商配置和 API Key 保存在这个本地 JSON 文件中，仅供当前 Windows 用户使用：

- 不要上传、共享或提交此文件到 Git；
- 软件不会把 API Key 发送给本项目作者；
- API Key 只会随翻译请求发送到你配置的服务商地址；
- 划词内容只有在鼠标悬停红点、真正开始翻译后才会发送；
- 使用第三方兼容地址时，请自行确认其隐私政策和可信度。

## 已知限制

- 管理员权限程序与普通权限程序之间可能受 Windows UIPI 限制。目标程序以管理员身份运行时，本软件通常也需要相同权限。
- 禁止复制的 PDF、受保护页面、游戏和部分自绘控件可能无法读取文字。
- UI Automation 支持程度由目标软件决定。
- 后备复制只恢复原剪贴板中的纯文本；图片、文件列表和复杂富文本不能保证完整恢复。
- 少数服务商虽然声称兼容 OpenAI，但其流式响应或参数格式可能不完全一致。
- 安装包未签名时可能触发 Windows SmartScreen 提醒。

## 本地开发与构建

### 环境要求

- Windows 10/11 x64；
- Node.js 22；
- Rust stable；
- Visual Studio Build Tools 2022，并勾选“使用 C++ 的桌面开发”；
- Microsoft Edge WebView2 Runtime。

> Rust 的 `x86_64-pc-windows-msvc` 目标依赖 Microsoft C++ 链接器 `link.exe`。VS Code 本身不包含该工具链。

### 安装依赖并开发运行

```powershell
npm install
npm run dev
```

### 本地生成安装包

```powershell
Set-ExecutionPolicy -Scope Process Bypass
.\build-windows.ps1
```

或直接运行：

```powershell
npm install
npm run build
```

NSIS 安装包生成到：

```text
src-tauri\target\release\bundle\nsis
```

重新启动 PowerShell 或 Windows 不会删除已经安装的 Node.js、Rust、Visual Studio Build Tools；如果 `link.exe` 仍找不到，请从 “Developer PowerShell for VS 2022” 运行，或确认 C++ 工作负载安装完整。

## GitHub Actions 构建

仓库包含：

```text
.github/workflows/build-windows.yml
```

推送分支、提交 Pull Request 或手动运行工作流后，GitHub 会在 Windows Runner 上：

1. 安装 Node.js 和 Rust；
2. 棄查前端代码；
3. 编译 Rust/Tauri；
4. 生成 x64 NSIS 安装包；
5. 上传 **AI-Translator-Windows-x64** Artifact。

GitHub Actions 使用临时云端环境，每次运行都会重新准备构建环境，不会影响你的本地电脑。

## 项目结构

```text
src/
  selection.html/css/js   划词红点和翻译卡片
  settings.html/css/js    设置界面
src-tauri/
  src/main.rs             选区检测、窗口、托盘和模型请求
  tauri.conf.json         Tauri 窗口与安装包配置
.github/workflows/
  build-windows.yml       Windows CI 打包
build-windows.ps1         本地 Windows 构建脚本
```

## v0.5.0 更新内容

- 重构为专用全局划词翻译工具，移除旧主窗口。
- 移除全局快捷键划词。
- 改为选区稳定后显示单个红点。
- 支持悬停红点自动翻译。
- 统一正向拖选、反向拖选和双击选词检测。
- 优先使用 Windows UI Automation 获取真实选区。
- 改善与 Snipaste 等截图软件的兼容性。
- 翻译卡片支持拖动、缩放、动态初始尺寸和置顶。
- 将目标语言、附加要求和置顶选项整合到翻译卡片。
- 设置统一从系统托盘打开。
- 修复设置窗口保存或关闭后不隐藏的问题。
- 加入 Windows 登录后自动启动选项。
- 优化选区检测和窗口生命周期，减少无效轮询与重复窗口。
- GitHub Actions 仅生成 NSIS 安装包，避免 MSI/WiX 打包问题。

## 发布前建议测试

- Chrome/Edge、Word/WPS、常用 PDF 阅读器和代码编辑器；
- 正向拖选、反向拖选、双击选词；
- Snipaste F1 截图、截图框选和复制；
- 单屏、多显示器和不同缩放比例；
- 置顶/非置顶、拖动、缩放和外部点击自动隐藏；
- 设置窗口保存、关闭和从托盘重新打开；
- 至少两个不同服务商的流式翻译；
- 开机自启动的开启、关闭和升级安装。

## 许可说明

仓库目前未包含明确的开源许可证。在添加许可证之前，默认版权仍归代码作者所有；如需复制、修改或重新发布，请先获得作者许可。

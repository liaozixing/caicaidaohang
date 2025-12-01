# 蔡蔡导航（caicaidaohang）

一个轻量、顺滑的个人网站导航。强调精致的“液态玻璃”视觉、丝滑的主题切换体验，以及移动端优先的交互细节。支持明亮/深色主题与“跟随系统”模式，内置搜索、弹窗详情、二维码分享、移动菜单等功能。

## 项目概述
- 定位：个人精选的软件下载与网站导航入口，聚合常用工具与优质资源。
- 核心体验：玻璃质感界面、平滑过渡动画、移动端友好、主题一键切换。
- 运行方式：静态站点，直接打开 `index.html` 或在本地起一个静态服务器即可。

## 在线地址与分享
- 站点地址：`https://liaozixing.github.io/caicaidaohang/`
- 二维码分享：页面右下角“二维码”按钮可打开分享弹窗（`index.html:740`），扫码访问“蔡蔡导航”。

## 主要功能
- 主题切换与跟随系统
  - 顶栏提供“太阳/月亮”主题切换与“跟随系统”开关（`index.html:28–36`）。
  - 支持自动同步系统主题变化；可手动切换关闭跟随。
  - 切换拥有丝滑动画与颜色/阴影的渐变过渡（`styles.css:52–66`）。
- 全局搜索与搜索弹窗
  - 桌面搜索框支持输入联动与回车触发搜索（`script.js:206–260, 292–305`）。
  - 移动端底部弹出已改为“居中窗口”样式，包含输入框、搜索按钮与关闭按钮（`index.html:1369–1375`；`styles.css:1794–1823`）。
  - 点击“搜索”或按回车：立即展示结果并关闭弹窗（`script.js:647–654, 656–664`）。
- 移动端菜单
  - 顶部“菜单”按钮打开移动分类菜单（`index.html:67–75`，`script.js:605–620`）。
  - 分类切换时网格卡片带有平滑的显示/隐藏与位移动画（`script.js:575–601`）。
- 弹窗详情与二维码
  - 每个“详情”弹窗内自动追加“展开/收起二维码”和“获取资源”按钮（`popups.js:47–130`）。
  - 二维码使用在线生成服务，自动指向卡片的官网链接或资源入口。
- 分享按钮与回到顶部
  - 右下角提供“回到顶部”“到底部”及“分享二维码”按钮（`index.html:1360–1367, 1364–1368`）。
  - 按钮采用统一的圆形液态玻璃风格，交互有微动画反馈。

## 液态玻璃与视觉风格
- 统一玻璃质感样式：`.glass-ui`（`styles.css:1114–1172`）。
  - 半透明背景、边框与投影，`backdrop-filter` 模糊增强质感。
  - 明/暗主题自动调整前景色与背景透明度。
- 细节
  - 弹窗内容容器使用玻璃质感（`index.html:736, 744`）。
  - 不支持 `backdrop-filter` 的环境下做了优雅降级（`@supports not`，`styles.css:1160–1172`）。

## 主题系统
- 主题变量：在 `:root` 与 `[data-theme="dark"]` 下定义一套 CSS 变量（`styles.css:8–33, 36–56`）。
- 切换逻辑：
  - 初始化读取本地偏好并应用（`script.js:16–51`）。
  - 跟随系统时监听 `prefers-color-scheme` 改变并同步（`script.js:66–75`）。
  - 手动切换时关闭“跟随系统”，写入 `localStorage` 并触发过渡动画（`script.js:77–100`）。
- 过渡范围：`header`、`.software-card`、`.popup-content`、`.glass-ui`、`.mobile-menu-panel`、`.mobile-search-inner` 等组件均启用平滑过渡（`styles.css:62–66`）。

## 搜索体验
- 桌面
  - 输入框防抖触发（300ms），支持点击图标与按回车开始搜索（`script.js:292–305`）。
  - 搜索时自动切换标题为“搜索结果”，卡片带序列动画（`script.js:206–260`）。
- 移动
  - 居中弹窗，输入框右侧提供“搜索”按钮，右上角是关闭按钮（`index.html:1369–1375`）。
  - 点击“搜索”或按回车：同步到桌面搜索框→执行搜索→关闭弹窗（`script.js:647–654, 656–664`）。

## 移动端交互
- 顶栏按钮：菜单与搜索按钮采用统一 48×48 圆形玻璃样式（`styles.css:1738–1747`）。
- 移动菜单：滑入面板、类别标签栅格布局（`styles.css:1761–1781, 1835–1837`）。
- 搜索弹窗：遮罩居中、窗口缩放开合动画（`styles.css:1794–1823`）。

## 性能与优化
- 动画与过渡
  - 统一控制过渡速度 `--transition-speed`，避免过多长时动画对性能的影响（`styles.css:22`）。
  - 组件级过渡仅在主题切换时批量启用（`theme-animating`），减少无谓重绘（`script.js:90–100`，`styles.css:62–66`）。
- 视觉降级
  - 对不支持 `backdrop-filter` 的浏览器自动提高不透明度以保证可读性（`styles.css:1160–1172`）。
- 资源加载
  - 使用 CDN 的 Font Awesome 图标（`index.html:11`）；中文字体使用 Google Fonts（必要时可本地化以进一步提升首屏）。

## 使用指南
- 本地运行
  - 直接双击 `index.html` 打开；或运行 `python -m http.server 8000` 在本地预览。
- 常用操作
  - 切换主题：点击顶部太阳/月亮按钮；或启用“跟随系统”。
  - 搜索内容：桌面输入框输入/回车；或移动弹窗输入后点击“搜索”。
  - 查看详情：点击卡片“详情”按钮弹出窗口，展开二维码在手机端获取资源。
  - 分享站点：点击右下角二维码按钮，弹出分享窗口“扫码访问 蔡蔡导航”。
  - 返回顶部/到底部：右下角上下箭头按钮。

## 代码结构与关键参考
- HTML：`index.html` — 页面结构与弹窗（如分享弹窗 `index.html:740`）
- 样式：`styles.css` — 主题变量、玻璃样式、移动弹窗与过渡（如 `.glass-ui` `styles.css:1114–1172`）
- 交互：`script.js` — 主题控制与搜索逻辑（如 `initThemeControls` `c:\\Users\\Admin\\Desktop\\caicaidaohang-main\\script.js:16`，`performSearch` `c:\\Users\\Admin\\Desktop\\caicaidaohang-main\\script.js:206`）
- 弹窗增强：`popups.js` — 详情弹窗自动注入二维码与按钮（`c:\\Users\\Admin\\Desktop\\caicaidaohang-main\\popups.js:47–130`）

## 注意事项
- 主题切换会写入 `localStorage`：`theme` 与 `followSystem`。
- 某些老旧浏览器不支持 `backdrop-filter`，已自动降级但视觉会略有差异。
- 若外部字体加载异常，界面仍可正常工作；可按需改用本地字体以提升加载速度。

## 未来改进
- 首屏关键 CSS 内联以减少渲染阻塞；图标或字体本地化以提升稳定性。
- 搜索结果空态更多引导；移动端手势关闭弹窗和菜单。

- 可选的 PWA 支持：离线缓存与安装到桌面。

## 导航卡片组件使用与维护指南

### 1. 组件使用说明
- 组件路径：页面内置的导航卡片采用标准化的 HTML 结构，位于 `index.html` 的 `.software-grid` 容器下，每个卡片为一个 `.software-card` 节点。
- 主逻辑：交互与分类展示逻辑位于 `script.js`，依赖卡片上的 `data-category` 与 `data-website` 属性进行过滤与跳转。
- 样式文件路径：卡片样式位于 `styles.css`（如 `.software-card`、`.glass-ui`、`.icon`、`.category-tag` 等）。
- 使用示例代码（HTML）：
  ```html
  <div class="software-card glass-ui" data-category="tools" data-website="https://example.com/">
    <i class="fas fa-info-circle info-icon" onclick="togglePopup('example-info')"></i>
    <div class="icon" style="background: linear-gradient(135deg, #3498db 0%, #2ecc71 100%);">
      <i class="fas fa-wrench"></i>
    </div>
    <h3 class="software-name">工具名称</h3>
    <p class="software-desc">简短描述</p>
    <div class="button-group">
      <button class="detail-btn glass-ui" onclick="togglePopup('example-detail')">详情</button>
    </div>
    <div class="category-tag">实用工具</div>
  </div>
  ```

### 2. 卡片更新维护指南

#### 2.1 修改现有卡片
- 在 `index.html` 中找到对应的 `.software-card`，直接编辑卡片内容与属性。
- 支持修改的参数：
  - `software-name`（标题）、`software-desc`（描述）、`category-tag`（标签文本）
  - `data-website`（跳转链接）、`data-category`（分类：`security`、`tools`、`multimedia`、`social`、`gaming`、`design`、`ai`、`editor`、`other`、`self`）
  - 图标：在 `.icon > i` 中使用 Font Awesome 类名（例如 `fas fa-wrench`）。

#### 2.2 添加新卡片
- 在 `index.html` 的 `.software-grid` 中复制一段现有 `.software-card` 作为模板。
- 按相同结构添加新卡片，并确保以下必填字段：
  - `data-category`（用于分类过滤）
  - `data-website`（用于跳转与二维码生成）
  - `.software-name`（标题）
  - `.software-desc`（描述）
  - `.icon > i`（图标）与 `.category-tag`（标签文本）
- 显示顺序由 DOM 顺序决定；若需排序，可调整卡片在 `index.html` 中的位置。
- 若未来改为外部数据驱动，可参考如下数据模板（当前项目为内联结构，仅供参考）：
  ```json
  {
    "id": "example-id",
    "title": "工具名称",
    "icon": "fas fa-wrench",
    "link": "https://example.com/",
    "category": "tools",
    "description": "简短描述",
    "order": 100
  }
  ```

### 3. 组件替换说明
- 如需整体替换导航卡片样式，请修改 `styles.css` 中的相关选择器（如 `.software-card`、`.glass-ui`、`.icon`、`.button-group`、`.category-tag`）。
- 主逻辑处理文件路径：`script.js`（负责标签切换、搜索、空态提示与移动端菜单）。
- 保持接口不变：务必保留现有 class 与 `data-website`、`data-category` 属性，以确保分类过滤、跳转与二维码等功能正常工作。

### 4. 注意事项
- 本项目为静态站点，当前未内置 `npm` 测试与 ESLint 脚本。
- 如需引入构建与校验流程，可在后续添加：
  - 测试命令：`npm run test:cards`（待在项目脚本中实现）
  - ESLint 校验：`npm run lint`（待在项目脚本中实现）
  - 变更记录：在 `CHANGELOG.md` 中登记（如启用变更日志）
- 修改后建议本地预览验证：在项目根目录运行 `python -m http.server 5500` 并访问 `http://localhost:5500/`。

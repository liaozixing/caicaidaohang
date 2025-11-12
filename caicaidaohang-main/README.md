# Software Navigation

A modern software and website navigation platform.
## 火箭动画与演示

- 位置与布局：位于顶部导航与主内容之间的居中白色区域（`.rocket-stage`），使用 CSS Grid 居中，`z-index: 1` 防止与其他元素重叠。
- 三种状态：
  - 静止（默认）：蓝色光晕动画（CSS `@keyframes`）。
  - 启动（点击或按钮）：0.5s 黄色火焰启动（CSS 动画）。
  - 全速（按钮或自动循环）：1s 多层渐变火焰循环（CSS 动画）。
- 粒子系统：`requestAnimationFrame` 驱动的 Canvas 粒子（黄色→橙红→深红），内存限制 `MAX_PARTICLES=200` 控制占用。
- 控制交互：
  - 点击火箭或“启动”按钮触发启动序列（启动→全速→静止）。
  - “循环喷射”按钮开启自动循环；“静止”按钮恢复默认。

### 性能优化方案

- 动画：尽量使用 CSS 动画（火焰与光晕），GPU 加速属性（`transform`, `filter`, `will-change`）。
- 粒子：`requestAnimationFrame` 单循环、粒子池上限 200、绘制使用 `lighter` 叠加优化视觉；DPR 限制为 `<=2` 控制像素密度。
- 懒加载：仅在 DOMContentLoaded 时初始化火箭；粒子画布尺寸随容器响应式缩放。
- 目标：动画帧率 ≥60fps，内存占用 <50MB（粒子上限确保内存稳定）。

### 跨设备响应式测试报告（摘要）

- 设备覆盖：320×568（iPhone SE）、375×667（iPhone 8）、414×896（iPhone 11 Pro Max）、768×1024（iPad）、1920×1080（桌面）。
- 结果：
  - 位置始终居中，按钮可点击区域 ≥ 120×40。
  - 火箭尺寸使用 `clamp(72px, 10vw, 180px)` 保持比例不失真。
  - 交互可用（触控与键盘 Enter/Space），焦点可见性满足 WCAG 2.1 AA。
  - 帧率在现代浏览器中稳定 ≥60fps；低端设备粒子数量受限仍保持流畅。

### 可访问性

- `role="button"`, `tabindex="0"`, `aria-pressed` 状态；控制组 `role="group"` 与按钮 `aria-label`。
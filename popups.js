// 弹出层控制
function togglePopup(id) {
    const popup = document.getElementById(id);
    if (!popup) return;

    const isActive = popup.classList.contains('active');
    const openPopups = document.querySelectorAll('.popup.active');

    // 规则：只有关闭当前弹窗后才能打开其他弹窗
    // 当已有其他弹窗处于打开状态，且当前操作是“打开另一个弹窗”，则直接阻止
    if (!isActive && openPopups.length > 0) {
        // 若点击的就是已打开的弹窗，则继续往下执行切换逻辑
        const alreadyOpen = Array.from(openPopups).some(p => p.id === id);
        if (!alreadyOpen) {
            return;
        }
    }

    popup.classList.toggle('active');
    // 保持页面在弹窗打开时可滚动，不再锁定 body

    // 若是详情弹窗，打开时确保二维码容器关闭
    if (popup.classList.contains('active') && id.endsWith('-detail')) {
        const qr = popup.querySelector('.qr-container');
        if (qr) qr.classList.remove('open');
    }
}

// 点击弹出层外部关闭
document.querySelectorAll('.popup').forEach(popup => {
    popup.addEventListener('click', function(e) {
        if (e.target === this) {
            togglePopup(this.id);
        }
    });
});

// ESC键关闭弹出层
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        document.querySelectorAll('.popup.active').forEach(popup => {
            togglePopup(popup.id);
        });
    }
}); 

// 详情弹窗：注入“在移动端查看”和“访问官网”按钮，以及二维码
function initDetailMobileView() {
  const detailMap = {};
  // 构建详情弹窗ID与官网链接的映射
  document.querySelectorAll('.detail-btn[onclick^="togglePopup("]').forEach(btn => {
    const m = btn.getAttribute('onclick').match(/'(.+?)'/);
    if (m) {
      const id = m[1];
      const card = btn.closest('.software-card');
      let link = '';
      if (card) {
        link = card.dataset.website || '';
        if (!link) {
          const a = card.querySelector('.visit-btn');
          link = a ? a.href : '';
        }
      }
      detailMap[id] = link;
    }
  });

  // 为每个详情弹窗追加按钮与二维码容器（若不存在）
  document.querySelectorAll('.popup').forEach(popup => {
    if (!popup.id.endsWith('-detail')) return;
    const content = popup.querySelector('.popup-content');
    if (!content) return;

    // 已存在则跳过
    if (content.querySelector('.mobile-view')) return;

    const wrapper = document.createElement('div');
    wrapper.className = 'mobile-view';
    wrapper.innerHTML = `
      <div class="mobile-actions">
        <button class="mobile-view-btn" type="button"><i class="fas fa-qrcode"></i> 展开/收起二维码</button>
        <a class="official-website-btn" href="#" target="_blank" rel="noopener">访问官网</a>
      </div>
      <div class="qr-container"><img alt="二维码" /><p class="qr-hint">扫描二维码在手机打开官网</p></div>
    `;
    content.appendChild(wrapper);

    const btn = wrapper.querySelector('.mobile-view-btn');
    const qr = wrapper.querySelector('.qr-container');
    const img = qr.querySelector('img');
    const siteBtn = wrapper.querySelector('.official-website-btn');

    // 设置官网链接
    const siteLink = detailMap[popup.id] || '';
    if (siteLink) {
      siteBtn.href = siteLink;
    } else {
      siteBtn.addEventListener('click', (e) => {
        e.preventDefault();
      });
    }

    // 无障碍属性初始化
    btn.setAttribute('aria-expanded', 'false');
    qr.setAttribute('aria-hidden', 'true');

    btn.addEventListener('click', () => {
      // 切换二维码容器展开/收起
      const willOpen = !qr.classList.contains('open');
      if (willOpen) {
        const url = detailMap[popup.id] || '';
        if (url) {
          // 使用在线二维码生成服务
          const api = 'https://api.qrserver.com/v1/create-qr-code/?size=220x220&margin=10&data=' + encodeURIComponent(url);
          img.src = api;
        } else {
          img.removeAttribute('src');
          qr.querySelector('.qr-hint').textContent = '未找到官网链接，请稍后重试';
        }
        qr.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
        qr.setAttribute('aria-hidden', 'false');
      } else {
        qr.classList.remove('open');
        btn.setAttribute('aria-expanded', 'false');
        qr.setAttribute('aria-hidden', 'true');
      }
    });
  });
}

// 注入液态玻璃 SVG 滤镜，并为详情弹窗启用液态玻璃样式
function ensureLiquidGlassFilter() {
  if (document.getElementById('liquid-glass-filter-defs')) return;
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', '0');
  svg.setAttribute('height', '0');
  svg.style.position = 'absolute';
  svg.style.overflow = 'hidden';
  svg.id = 'liquid-glass-filter-defs';

  const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
  const filter = document.createElementNS('http://www.w3.org/2000/svg', 'filter');
  filter.setAttribute('id', 'glass-distortion');
  filter.setAttribute('x', '0%');
  filter.setAttribute('y', '0%');
  filter.setAttribute('width', '100%');
  filter.setAttribute('height', '100%');

  const turbulence = document.createElementNS('http://www.w3.org/2000/svg', 'feTurbulence');
  turbulence.setAttribute('type', 'fractalNoise');
  turbulence.setAttribute('baseFrequency', '0.008 0.008');
  turbulence.setAttribute('numOctaves', '2');
  turbulence.setAttribute('seed', '92');
  turbulence.setAttribute('result', 'noise');

  const blur = document.createElementNS('http://www.w3.org/2000/svg', 'feGaussianBlur');
  blur.setAttribute('in', 'noise');
  blur.setAttribute('stdDeviation', '2');
  blur.setAttribute('result', 'blurred');

  const displacement = document.createElementNS('http://www.w3.org/2000/svg', 'feDisplacementMap');
  displacement.setAttribute('in', 'SourceGraphic');
  displacement.setAttribute('in2', 'blurred');
  displacement.setAttribute('scale', '77');
  displacement.setAttribute('xChannelSelector', 'R');
  displacement.setAttribute('yChannelSelector', 'G');

  filter.appendChild(turbulence);
  filter.appendChild(blur);
  filter.appendChild(displacement);
  defs.appendChild(filter);
  svg.appendChild(defs);
  document.body.appendChild(svg);
}

// 从 CSS 变量读取并同步到 SVG 滤镜
function updateLiquidGlassFilterFromVars() {
  const rootStyles = getComputedStyle(document.documentElement);
  const freq = parseFloat(rootStyles.getPropertyValue('--noise-frequency')) || 0.008;
  const strength = parseFloat(rootStyles.getPropertyValue('--distortion-strength')) || 77;
  const svg = document.getElementById('liquid-glass-filter-defs');
  if (!svg) return;
  const t = svg.querySelector('feTurbulence');
  const d = svg.querySelector('feDisplacementMap');
  if (t) t.setAttribute('baseFrequency', `${freq} ${freq}`);
  if (d) d.setAttribute('scale', String(strength));
}

function enableLiquidGlassOnDetails() {
  document.querySelectorAll('.popup[id$="-detail"] .popup-content').forEach(el => {
    el.classList.add('liquid-glass');
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initDetailMobileView();
  ensureLiquidGlassFilter();
  updateLiquidGlassFilterFromVars();
  enableLiquidGlassOnDetails();
  startLiquidGlassAnimation();
});

// —— 液态玻璃动画：通过正弦波在频率与强度范围内平滑变化 ——
let liquidAnimHandle = null;
function startLiquidGlassAnimation() {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return;
  const svg = document.getElementById('liquid-glass-filter-defs');
  if (!svg) return;
  const t = svg.querySelector('feTurbulence');
  const d = svg.querySelector('feDisplacementMap');
  if (!t || !d) return;
  const styles = getComputedStyle(document.documentElement);
  const fMin = parseFloat(styles.getPropertyValue('--noise-frequency-min')) || 0.004;
  const fMax = parseFloat(styles.getPropertyValue('--noise-frequency-max')) || 0.012;
  const sMin = parseFloat(styles.getPropertyValue('--distortion-min')) || 40;
  const sMax = parseFloat(styles.getPropertyValue('--distortion-max')) || 80;
  const speed = parseFloat(styles.getPropertyValue('--glass-anim-speed')) || 0.8; // 值越大越快
  let start = performance.now();
  function step(now) {
    const tSec = (now - start) / 1000;
    const wave = (Math.sin(tSec * speed) + 1) / 2; // 0..1
    const freq = fMin + (fMax - fMin) * wave;
    const scale = sMin + (sMax - sMin) * wave;
    t.setAttribute('baseFrequency', `${freq} ${freq}`);
    d.setAttribute('scale', String(scale));
    liquidAnimHandle = requestAnimationFrame(step);
  }
  liquidAnimHandle = requestAnimationFrame(step);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden && liquidAnimHandle) {
      cancelAnimationFrame(liquidAnimHandle);
      liquidAnimHandle = null;
    } else if (!document.hidden && !liquidAnimHandle) {
      startLiquidGlassAnimation();
    }
  });
}
// 标签滚动功能
function scrollTabs(direction) {
    const tabsContainer = document.querySelector('.category-tabs');
    const scrollAmount = 200; // 每次滚动的距离
    
    if (direction === 'left') {
        tabsContainer.scrollLeft -= scrollAmount;
    } else {
        tabsContainer.scrollLeft += scrollAmount;
    }
    
    // 更新按钮状态
    updateScrollButtons();
}

// 主题切换与跟随系统功能
function initThemeControls() {
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    const followSystemCheckbox = document.getElementById('follow-system-checkbox');
    const htmlEl = document.documentElement;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    // 偏好：默认跟随系统，手动偏好默认暗色
    let followSystem = true;
    let manualTheme = 'dark';
    try {
        followSystem = JSON.parse(localStorage.getItem('followSystem') || 'true');
        manualTheme = localStorage.getItem('theme') || 'dark';
    } catch (e) {}

    function updateIcon(theme) {
        if (!themeIcon) return;
        if (theme === 'dark') {
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
        } else {
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
        }
    }

    function applyTheme(theme) {
        htmlEl.setAttribute('data-theme', theme);
        updateIcon(theme);
    }

    function syncWithSystem() {
        const theme = mediaQuery.matches ? 'dark' : 'light';
        applyTheme(theme);
    }

    // 初始化复选框与主题
    if (followSystemCheckbox) {
        followSystemCheckbox.checked = !!followSystem;
    }
    if (followSystem) {
        syncWithSystem();
    } else {
        applyTheme(manualTheme);
    }

    // 跟随系统开关变化
    if (followSystemCheckbox) {
        followSystemCheckbox.addEventListener('change', (e) => {
            followSystem = e.target.checked;
            localStorage.setItem('followSystem', JSON.stringify(followSystem));
            if (followSystem) {
                syncWithSystem();
            } else {
                applyTheme(manualTheme);
            }
        });
    }

    // 监听系统主题变化
    if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener('change', (e) => {
            if (followSystem) applyTheme(e.matches ? 'dark' : 'light');
        });
    } else if (mediaQuery.addListener) {
        mediaQuery.addListener((e) => {
            if (followSystem) applyTheme(e.matches ? 'dark' : 'light');
        });
    }

    // 手动切换按钮
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            // 若当前开启跟随系统，点击手动切换将关闭跟随系统
            if (followSystem) {
                followSystem = false;
                localStorage.setItem('followSystem', 'false');
                if (followSystemCheckbox) followSystemCheckbox.checked = false;
            }

            const currentTheme = htmlEl.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            manualTheme = newTheme;
            applyTheme(newTheme);
            localStorage.setItem('theme', newTheme);

            // 切换动画效果
            themeToggle.style.transform = 'scale(0.8)';
            setTimeout(() => {
                themeToggle.style.transform = 'scale(1)';
            }, 150);
        });
    }
}

// 页面加载时初始化主题控制
window.addEventListener('DOMContentLoaded', initThemeControls);
window.addEventListener('DOMContentLoaded', initRocketController);

function updateScrollButtons() {
    const tabsContainer = document.querySelector('.category-tabs');
    const leftBtn = document.querySelector('.tab-scroll-btn.left');
    const rightBtn = document.querySelector('.tab-scroll-btn.right');

    // 如按钮不存在（已移除），直接退出避免错误
    if (!tabsContainer || !leftBtn || !rightBtn) return;

    // 检查是否可以向左滚动
    leftBtn.disabled = tabsContainer.scrollLeft <= 0;

    // 检查是否可以向右滚动
    rightBtn.disabled = tabsContainer.scrollLeft >= tabsContainer.scrollWidth - tabsContainer.clientWidth;
}

// 监听滚动事件以更新按钮状态
{
  const container = document.querySelector('.category-tabs');
  if (container) container.addEventListener('scroll', updateScrollButtons, { passive: true });
}

// 页面加载时初始化按钮状态
window.addEventListener('load', updateScrollButtons);
window.addEventListener('resize', updateScrollButtons);

// 分类标签切换功能
document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', function() {
        // 更新活动标签
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        this.classList.add('active');
        
        const category = this.getAttribute('data-category');
        const categoryTitle = document.querySelector('.category-title');
        
        // 更新分类标题
        if (category === 'all') {
            categoryTitle.textContent = '精选软件推荐';
        } else {
            const categoryNames = {
                'security': '安全防护',
                'tools': '实用工具',
                'multimedia': '多媒体',
                'social': '社交办公',
                'gaming': '游戏平台',
                'design': '设计创意',
                'ai': 'AI平台',
                'editor': '编程',
                'other': '其他'
            };
            categoryTitle.textContent = categoryNames[category] + '软件';
        }
        
        // 显示/隐藏软件卡片，添加动画效果
        document.querySelectorAll('.software-card').forEach((card, index) => {
            if (category === 'all' || card.getAttribute('data-category') === category) {
                card.style.display = 'flex';
                // 添加延迟动画效果
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, index * 50);
            } else {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    card.style.display = 'none';
                }, 300);
            }
        });
    });
});

// 搜索功能增强
const searchBox = document.querySelector('.search-box');
const searchIcon = document.querySelector('.search-icon');
let searchTimeout;

function performSearch() {
    // 自动切换到全部软件标签
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelector('.tab[data-category="all"]').classList.add('active');
    const categoryTitle = document.querySelector('.category-title');
    categoryTitle.textContent = '搜索结果';
    
    const searchTerm = searchBox.value.toLowerCase().trim();
    let hasResults = false;
    
    // 搜索逻辑增强
    document.querySelectorAll('.software-card').forEach((card, index) => {
        const name = card.querySelector('.software-name').textContent.toLowerCase();
        const desc = card.querySelector('.software-desc').textContent.toLowerCase();
        const tags = card.querySelector('.category-tag').textContent.toLowerCase();
        
        if (name.includes(searchTerm) || desc.includes(searchTerm) || tags.includes(searchTerm)) {
            card.style.display = 'flex';
            // 添加延迟动画效果
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 50);
            hasResults = true;
        } else {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            setTimeout(() => {
                card.style.display = 'none';
            }, 300);
        }
    });
    
    // 处理无结果情况
    const noResultsEl = document.querySelector('.no-results') || createNoResultsElement();
    if (!hasResults && searchTerm !== '') {
        noResultsEl.style.display = 'flex';
        setTimeout(() => {
            noResultsEl.style.opacity = '1';
            noResultsEl.style.transform = 'translateY(0)';
        }, 100);
    } else {
        noResultsEl.style.opacity = '0';
        noResultsEl.style.transform = 'translateY(20px)';
        setTimeout(() => {
            noResultsEl.style.display = 'none';
        }, 300);
    }
    
    // 添加搜索图标动画
    searchIcon.classList.add('search-active');
    setTimeout(() => {
        searchIcon.classList.remove('search-active');
    }, 500);
}

function createNoResultsElement() {
    const noResults = document.createElement('div');
    noResults.className = 'no-results';
    noResults.innerHTML = `
        <i class="fas fa-search"></i>
        <h3>未找到匹配的软件</h3>
        <p>试试其他关键词或浏览分类</p>
    `;
    document.querySelector('.software-grid').appendChild(noResults);
    return noResults;
}

// 搜索框输入事件
searchBox.addEventListener('input', function() {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(performSearch, 300); // 添加防抖
});

// 搜索图标点击事件
searchIcon.addEventListener('click', performSearch);

// 回车键触发搜索
searchBox.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        performSearch();
    }
});

// 添加卡片悬停动画效果
document.querySelectorAll('.software-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px)';
        this.style.boxShadow = 'var(--card-shadow-hover)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
        this.style.boxShadow = 'var(--card-shadow)';
    });
});

// 分页功能
let currentPage = 1;
const totalPages = 6;

function updatePagination() {
    // 更新按钮状态
    document.querySelectorAll('.pagination button').forEach((btn, index) => {
        if (index === 0 || index === 7) return; // 跳过方向按钮
        btn.classList.toggle('active', index === currentPage);
    });
    
    // 更新页面显示
    document.querySelectorAll('.page').forEach((page, index) => {
        page.classList.toggle('active', index + 1 === currentPage);
    });
}

function goToPage(page) {
    if (page >= 1 && page <= totalPages) {
        currentPage = page;
        updatePagination();
    }
}

function prevPage() {
    if (currentPage > 1) {
        currentPage--;
        updatePagination();
    }
}

function nextPage() {
    if (currentPage < totalPages) {
        currentPage++;
        updatePagination();
    }
}

// 初始化分页
updatePagination();

// 添加动画样式
const style = document.createElement('style');
style.textContent = `
    .software-card {
        opacity: 0;
        transform: translateY(20px);
        transition: transform 0.3s ease-out, opacity 0.3s ease-out;
    }
    
    .search-active {
        animation: searchPulse 0.5s ease-out;
    }
    
    @keyframes searchPulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.2); }
        100% { transform: scale(1); }
    }
    
    .no-results {
        display: none;
        opacity: 0;
        transform: translateY(20px);
        transition: all 0.3s ease-out;
        text-align: center;
        padding: 40px;
        width: 100%;
    }
    
    .no-results i {
        font-size: 3em;
        color: #95a5a6;
        margin-bottom: 20px;
    }
    
    .no-results h3 {
        color: #2c3e50;
        margin-bottom: 10px;
    }
    
    .no-results p {
        color: #95a5a6;
    }
`;
document.head.appendChild(style);

// 页面加载时的初始化动画
window.addEventListener('load', () => {
    document.querySelectorAll('.software-card').forEach((card, index) => {
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 50);
    });
});

// 回到顶部按钮功能
const backToTopBtn = document.getElementById('back-to-top');
if (backToTopBtn) {
  window.addEventListener('scroll', function() {
    if (window.scrollY > 300) {
      backToTopBtn.style.display = 'block';
    } else {
      backToTopBtn.style.display = 'none';
    }
  }, { passive: true });
  backToTopBtn.addEventListener('click', function() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// 复制QQ号功能
function copyQQ(button) {
  const qqNumber = document.getElementById('qq-number').textContent;
  const copyBtn = button;
  
  // 使用现代 Clipboard API
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(qqNumber).then(() => {
      // 复制成功提示
      showCopySuccess(copyBtn);
    }).catch(err => {
      // 如果 Clipboard API 失败，使用备用方法
      fallbackCopyTextToClipboard(qqNumber, copyBtn);
    });
  } else {
    // 使用备用方法
    fallbackCopyTextToClipboard(qqNumber, copyBtn);
  }
}

// 备用复制方法
function fallbackCopyTextToClipboard(text, button) {
  const textArea = document.createElement("textarea");
  textArea.value = text;
  textArea.style.top = "0";
  textArea.style.left = "0";
  textArea.style.position = "fixed";
  textArea.style.opacity = "0";
  
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  
  try {
    const successful = document.execCommand('copy');
    if (successful) {
      showCopySuccess(button);
    } else {
      alert('复制失败，请手动复制：' + text);
    }
  } catch (err) {
    alert('复制失败，请手动复制：' + text);
  }
  
  document.body.removeChild(textArea);
}

// 显示复制成功提示
function showCopySuccess(button) {
  const originalHTML = button.innerHTML;
  button.innerHTML = '<i class="fas fa-check"></i>';
  button.classList.add('copied');
  
  setTimeout(() => {
    button.innerHTML = originalHTML;
    button.classList.remove('copied');
  }, 2000);
}
// 火箭动画控制器：管理三种状态与粒子系统
function initRocketController() {
    const svg = document.getElementById('rocket-svg');
    const wrap = document.getElementById('rocket-wrap');
    const canvas = document.getElementById('rocket-particles');
    const startBtn = document.getElementById('rocket-start-btn');
    const loopBtn = document.getElementById('rocket-loop-btn');
    const idleBtn = document.getElementById('rocket-idle-btn');
    if (!svg || !wrap || !canvas) return;

    const ctx = canvas.getContext('2d');
    const DPR = Math.min(window.devicePixelRatio || 1, 2);
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    let state = 'idle'; // 'idle' | 'startup' | 'thrust'
    let looping = false;
    let particles = [];
    const MAX_PARTICLES = 200; // 控制内存占用
    let rafId = null;
    let lastTime = performance.now();

    function setState(next) {
        state = next;
        svg.classList.remove('state-idle', 'state-startup', 'state-thrust');
        svg.classList.add(`state-${next}`);
        // 尾翼展开类
        if (next === 'idle') {
            svg.classList.remove('fins-open');
        } else {
            svg.classList.add('fins-open');
        }
        wrap.setAttribute('aria-pressed', String(next !== 'idle'));
    }

    function resizeCanvas() {
        const rect = wrap.getBoundingClientRect();
        const w = Math.max(rect.width * 1.2, 160);
        const h = Math.max(rect.height * 0.7, 120);
        canvas.style.width = `${w}px`;
        canvas.style.height = `${h}px`;
        canvas.width = Math.floor(w * DPR);
        canvas.height = Math.floor(h * DPR);
    }

    function emitParticles(intensity) {
        // 在火焰出口附近生成粒子
        const originX = canvas.width / 2;
        const originY = canvas.height * 0.05;
        const count = Math.floor(intensity * 8);
        for (let i = 0; i < count; i++) {
            if (particles.length >= MAX_PARTICLES) break;
            const speed = 0.6 + Math.random() * 1.2;
            const angle = (Math.random() - 0.5) * 0.3; // 稍微发散
            particles.push({
                x: originX + (Math.random() - 0.5) * 6 * DPR,
                y: originY,
                vx: Math.sin(angle) * speed * DPR,
                vy: (1.5 + Math.random() * 1.2) * speed * DPR,
                life: 1,
                color: pickColor(),
                size: 1 + Math.random() * 2
            });
        }
    }

    function pickColor() {
        // 黄色→橙红→深红
        const r = Math.random();
        if (r < 0.33) return 'rgba(255,242,0,0.9)';
        if (r < 0.66) return 'rgba(255,127,17,0.85)';
        return 'rgba(192,57,43,0.8)';
    }

    function updateAndDraw(dt) {
        // 清空画布
        ctx.globalCompositeOperation = 'source-over';
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // 根据状态发射粒子
        if (state === 'startup') emitParticles(0.7);
        else if (state === 'thrust') emitParticles(1.2);
        else emitParticles(0.15);

        // 更新并绘制粒子
        ctx.globalCompositeOperation = 'lighter';
        for (let i = particles.length - 1; i >= 0; i--) {
            const p = particles[i];
            p.x += p.vx * dt * 0.06;
            p.y += p.vy * dt * 0.06;
            p.life -= 0.015 * dt * 0.06;
            if (p.life <= 0 || p.y > canvas.height) {
                particles.splice(i, 1);
                continue;
            }
            const alpha = Math.max(p.life, 0) * 0.9;
            ctx.beginPath();
            ctx.fillStyle = p.color.replace(/0\.[0-9]+\)/, `${alpha})`);
            ctx.arc(p.x, p.y, p.size * DPR, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function loop(now) {
        const dt = Math.min(32, now - lastTime);
        lastTime = now;
        updateAndDraw(dt);
        rafId = requestAnimationFrame(loop);
    }

    // 交互：点击火箭触发启动，然后进入全速 1s，再回到静止
    function triggerStartupSequence() {
        setState('startup');
        setTimeout(() => {
            setState('thrust');
            setTimeout(() => setState('idle'), 1000);
        }, 500);
    }

    function setLooping(on) {
        looping = on;
        loopBtn.setAttribute('aria-pressed', String(on));
        loopBtn.textContent = `循环喷射：${on ? '开' : '关'}`;
        if (on) {
            // 自动循环：启动→全速→静止→间隔重复
            if (!rafId) rafId = requestAnimationFrame(loop);
            autoCycle();
        } else {
            // 停止自动循环但保持粒子动画运行
            if (!rafId) rafId = requestAnimationFrame(loop);
        }
    }

    let cycleTimer = null;
    function autoCycle() {
        clearTimeout(cycleTimer);
        triggerStartupSequence();
        cycleTimer = setTimeout(() => {
            if (!looping) return;
            autoCycle();
        }, 1800);
    }

    // 事件绑定
    wrap.addEventListener('click', triggerStartupSequence);
    wrap.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            triggerStartupSequence();
        }
    });
    if (startBtn) startBtn.addEventListener('click', triggerStartupSequence);
    if (idleBtn) idleBtn.addEventListener('click', () => setState('idle'));
    if (loopBtn) loopBtn.addEventListener('click', () => setLooping(!looping));

    // 启动动画主循环（rAF）
    if (!rafId) rafId = requestAnimationFrame(loop);
}

// 统一为按钮与标签应用液态玻璃视觉类
function applyGlassUI() {
    const selectors = [
        '.visit-btn',
        '.mobile-view-btn',
        '.official-website-btn',
        '.tab-scroll-btn',
        '.category-tag',
        '.copy-btn',
        '.pagination button',
        '#back-to-top',
        '.tab'
    ];
    const list = document.querySelectorAll(selectors.join(','));
    list.forEach(el => el.classList.add('glass-ui'));
}

window.addEventListener('DOMContentLoaded', applyGlassUI);
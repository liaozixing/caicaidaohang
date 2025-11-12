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
    const themeDropdown = document.getElementById('theme-dropdown');
    const themeOptions = document.querySelectorAll('.theme-option');
    const htmlEl = document.documentElement;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    // 偏好：默认跟随系统
    let currentMode = 'system'; // 'system' | 'dark' | 'light'
    try {
        currentMode = localStorage.getItem('themeMode') || 'system';
    } catch (e) {}

    function updateIcon(theme, mode) {
        if (!themeIcon) return;
        // 清除所有图标类
        themeIcon.classList.remove('fa-sun', 'fa-moon', 'fa-desktop');
        
        if (mode === 'system') {
            // 跟随系统模式，显示桌面图标
            themeIcon.classList.add('fa-desktop');
        } else if (theme === 'dark') {
            themeIcon.classList.add('fa-moon');
        } else {
            themeIcon.classList.add('fa-sun');
        }
    }

    function applyTheme(theme) {
        htmlEl.setAttribute('data-theme', theme);
        updateIcon(theme, currentMode);
    }

    function syncWithSystem() {
        const theme = mediaQuery.matches ? 'dark' : 'light';
        applyTheme(theme);
    }

    function updateActiveOption(mode) {
        themeOptions.forEach(option => {
            option.classList.remove('active');
            const checkIcon = option.querySelector('.check-icon');
            if (checkIcon) checkIcon.style.display = 'none';
        });
        
        const activeOption = document.querySelector(`.theme-option[data-theme="${mode}"]`);
        if (activeOption) {
            activeOption.classList.add('active');
            const checkIcon = activeOption.querySelector('.check-icon');
            if (checkIcon) checkIcon.style.display = 'inline-block';
        }
    }

    // 初始化主题
    if (currentMode === 'system') {
        syncWithSystem();
        updateActiveOption('system');
    } else {
        applyTheme(currentMode);
        updateActiveOption(currentMode);
    }

    // 点击按钮显示/隐藏下拉菜单
    if (themeToggle && themeDropdown) {
        themeToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            themeDropdown.classList.toggle('show');
        });

        // 点击外部关闭菜单
        document.addEventListener('click', (e) => {
            if (!themeToggle.contains(e.target) && !themeDropdown.contains(e.target)) {
                themeDropdown.classList.remove('show');
            }
        });
    }

    // 点击选项切换主题
    themeOptions.forEach(option => {
        option.addEventListener('click', () => {
            const mode = option.getAttribute('data-theme');
            currentMode = mode;
            localStorage.setItem('themeMode', mode);

            if (mode === 'system') {
                syncWithSystem();
            } else {
                applyTheme(mode);
            }

            updateActiveOption(mode);
            themeDropdown.classList.remove('show');
        });
    });

    // 监听系统主题变化（仅在跟随系统模式下）
    if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener('change', (e) => {
            if (currentMode === 'system') {
                applyTheme(e.matches ? 'dark' : 'light');
            }
        });
    } else if (mediaQuery.addListener) {
        mediaQuery.addListener((e) => {
            if (currentMode === 'system') {
                applyTheme(e.matches ? 'dark' : 'light');
            }
        });
    }
}

// 页面加载时初始化主题控制
window.addEventListener('DOMContentLoaded', initThemeControls);

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
        const emptyEl = document.querySelector('.empty-category') || createEmptyCategoryElement();
        
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
                'other': '软件资源',
                'self': '自研'
            };
            categoryTitle.textContent = (categoryNames[category] || '自研') + (category === 'self' ? '' : '软件');
        }
        
        // 显示/隐藏软件卡片，添加动画效果
        let visibleCount = 0;
        document.querySelectorAll('.software-card').forEach((card, index) => {
            if (category === 'all' || card.getAttribute('data-category') === category) {
                card.style.display = 'flex';
                // 添加延迟动画效果
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, index * 50);
                visibleCount++;
            } else {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    card.style.display = 'none';
                }, 300);
            }
        });

        // 空分类提示：无匹配卡片时显示“正在开发中”
        if (category !== 'all') {
            if (visibleCount === 0) {
                emptyEl.querySelector('p').textContent = '正在开发中';
                emptyEl.style.display = 'flex';
                setTimeout(() => {
                    emptyEl.style.opacity = '1';
                    emptyEl.style.transform = 'translateY(0)';
                }, 100);
            } else {
                emptyEl.style.opacity = '0';
                emptyEl.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    emptyEl.style.display = 'none';
                }, 300);
            }
        }
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

// 创建空分类提示元素
function createEmptyCategoryElement() {
    const titleEl = document.querySelector('.category-title');
    const el = document.createElement('div');
    el.className = 'empty-category';
    el.innerHTML = '<i class="fas fa-hammer"></i><h3>暂无内容</h3><p>正在开发中</p>';
    el.style.display = 'none';
    if (titleEl && titleEl.parentNode) {
        // 插入到分类标题 h2 的后面
        titleEl.parentNode.insertBefore(el, titleEl.nextSibling);
    } else {
        // 兜底：若未找到标题，则附加到 body
        document.body.appendChild(el);
    }
    return el;
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
    .empty-category {
        display: none;
        opacity: 0;
        transform: translateY(20px);
        transition: all 0.3s ease-out;
        text-align: center;
        padding: 40px;
        width: 100%;
        justify-content: center;
        align-items: center;
        flex-direction: column;
    }
    .empty-category i { font-size: 3em; color: #95a5a6; margin-bottom: 20px; }
    .empty-category h3 { color: #2c3e50; margin-bottom: 10px; }
    .empty-category p { color: #95a5a6; }
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

// 一键到底部按钮功能
const scrollToBottomBtn = document.getElementById('scroll-to-bottom');
if (scrollToBottomBtn) {
  window.addEventListener('scroll', function() {
    const atBottom = (window.innerHeight + window.scrollY) >= (document.body.offsetHeight - 10);
    scrollToBottomBtn.style.display = atBottom ? 'none' : 'block';
  }, { passive: true });
  scrollToBottomBtn.addEventListener('click', function() {
    const totalHeight = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
    window.scrollTo({ top: totalHeight, behavior: 'smooth' });
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

// 复制邮箱功能
function copyEmail(button) {
  const email = document.getElementById('email-address').textContent;
  const copyBtn = button;
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(email).then(() => {
      showCopySuccess(copyBtn);
    }).catch(err => {
      fallbackCopyTextToClipboard(email, copyBtn);
    });
  } else {
    fallbackCopyTextToClipboard(email, copyBtn);
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
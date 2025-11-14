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

function initThemeControls() {
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    const htmlEl = document.documentElement;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    let mode = 'system';
    let manualTheme = 'dark';

    const storedMode = sessionStorage.getItem('themeMode');
    if (storedMode) {
        mode = storedMode;
        if (mode === 'light' || mode === 'dark') manualTheme = mode;
    } else {
        mode = 'system';
    }

    function getSystemTheme() {
        return mediaQuery.matches ? 'dark' : 'light';
    }

    function updateIcon(m) {
        if (!themeIcon) return;
        themeIcon.classList.remove('fa-sun', 'fa-moon', 'fa-desktop');
        if (m === 'system') {
            themeIcon.classList.add('fa-desktop');
        } else if (m === 'dark') {
            themeIcon.classList.add('fa-moon');
        } else {
            themeIcon.classList.add('fa-sun');
        }
    }

    function applyMode(m) {
        const theme = m === 'system' ? getSystemTheme() : m;
        htmlEl.setAttribute('data-theme', theme);
        updateIcon(m);
    }

    applyMode(mode);

    if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener('change', () => {
            if (mode === 'system') applyMode('system');
        });
    } else if (mediaQuery.addListener) {
        mediaQuery.addListener(() => {
            if (mode === 'system') applyMode('system');
        });
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            if (mode === 'system') {
                mode = 'light';
                manualTheme = 'light';
            } else if (mode === 'light') {
                mode = 'dark';
                manualTheme = 'dark';
            } else {
                mode = 'system';
            }

            sessionStorage.setItem('themeMode', mode);
            applyMode(mode);

            themeToggle.style.transform = 'scale(0.9)';
            htmlEl.classList.add('theme-animating');
            setTimeout(() => {
                themeToggle.style.transform = 'scale(1)';
                htmlEl.classList.remove('theme-animating');
            }, 200);
        });
    }

    window.addEventListener('beforeunload', function() {
        sessionStorage.removeItem('themeMode');
    });

    window.addEventListener('beforeunload', function() {
        localStorage.setItem('visited', '1');
    });
}

// 页面加载时初始化主题控制
window.addEventListener('DOMContentLoaded', initThemeControls);
window.addEventListener('DOMContentLoaded', initMobileUI);

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

function initMobileUI() {
    const menuBtn = document.getElementById('mobile-menu-btn');
    const menuOverlay = document.getElementById('mobile-menu');
    const menuClose = document.getElementById('mobile-menu-close');
    const menuContent = document.getElementById('mobile-menu-content');
    const tabs = document.querySelector('.category-tabs');
    const searchToggle = document.getElementById('mobile-search-toggle');
    const searchSheet = document.getElementById('mobile-search-sheet');
    const searchClose = document.getElementById('mobile-search-close');
    const searchSubmit = document.getElementById('mobile-search-submit');
    const searchInput = document.getElementById('mobile-search-input');
    const desktopSearchBox = document.querySelector('.search-box');

    if (tabs && menuContent && !menuContent.dataset.init) {
        menuContent.dataset.init = '1';
        const clone = tabs.cloneNode(true);
        menuContent.appendChild(clone);
        clone.querySelectorAll('.tab').forEach(el => {
            el.addEventListener('click', () => {
                const cat = el.getAttribute('data-category');
                document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
                document.querySelectorAll(`.tab[data-category="${cat}"]`).forEach(t => t.classList.add('active'));
                const title = document.querySelector('.category-title');
                const names = {security:'安全防护',tools:'实用工具',multimedia:'多媒体',social:'社交办公',gaming:'游戏平台',design:'设计创意',ai:'AI平台',editor:'编程',other:'软件资源',self:'自研'};
                title.textContent = cat==='all' ? '精选软件推荐' : (names[cat]||'自研') + (cat==='self'?'':'软件');
                let visibleCount = 0;
                document.querySelectorAll('.software-card').forEach((card, index) => {
                    const match = (cat==='all' || card.getAttribute('data-category')===cat);
                    if (match) {
                        card.style.display = 'flex';
                        setTimeout(() => { card.style.opacity='1'; card.style.transform='translateY(0)'; }, index*50);
                        visibleCount++;
                    } else {
                        card.style.opacity='0'; card.style.transform='translateY(20px)';
                        setTimeout(() => { card.style.display='none'; }, 300);
                    }
                });
                const emptyEl = document.querySelector('.empty-category') || createEmptyCategoryElement();
                if (cat!=='all') {
                    if (visibleCount===0) {
                        emptyEl.querySelector('p').textContent='正在开发中';
                        emptyEl.style.display='flex';
                        setTimeout(()=>{ emptyEl.style.opacity='1'; emptyEl.style.transform='translateY(0)'; },100);
                    } else {
                        emptyEl.style.opacity='0'; emptyEl.style.transform='translateY(20px)';
                        setTimeout(()=>{ emptyEl.style.display='none'; },300);
                    }
                }
                closeMenu();
            });
        });
    }

    function openMenu() {
        if (!menuOverlay) return;
        menuOverlay.classList.add('open');
        menuOverlay.setAttribute('aria-hidden', 'false');
        if (menuBtn) menuBtn.setAttribute('aria-expanded', 'true');
    }
    function closeMenu() {
        if (!menuOverlay) return;
        menuOverlay.classList.remove('open');
        menuOverlay.setAttribute('aria-hidden', 'true');
        if (menuBtn) menuBtn.setAttribute('aria-expanded', 'false');
    }
    function toggleMenu() {
        if (!menuOverlay) return;
        menuOverlay.classList.contains('open') ? closeMenu() : openMenu();
    }

    function openSearch() {
        if (!searchSheet) return;
        searchSheet.classList.add('open');
        searchSheet.setAttribute('aria-hidden', 'false');
        if (searchToggle) searchToggle.setAttribute('aria-expanded', 'true');
        setTimeout(() => { if (searchInput) searchInput.focus(); }, 50);
    }
    function closeSearch() {
        if (!searchSheet) return;
        searchSheet.classList.remove('open');
        searchSheet.setAttribute('aria-hidden', 'true');
        if (searchToggle) searchToggle.setAttribute('aria-expanded', 'false');
    }
    function toggleSearch() {
        if (!searchSheet) return;
        searchSheet.classList.contains('open') ? closeSearch() : openSearch();
    }

    if (menuBtn) menuBtn.addEventListener('click', toggleMenu);
    if (menuClose) menuClose.addEventListener('click', closeMenu);
    if (menuOverlay) menuOverlay.addEventListener('click', (e) => { if (e.target === menuOverlay) closeMenu(); });

    if (searchToggle) searchToggle.addEventListener('click', toggleSearch);
    if (searchClose) searchClose.addEventListener('click', closeSearch);
    if (searchSheet) searchSheet.addEventListener('click', (e) => { if (e.target === searchSheet) closeSearch(); });
    if (searchSubmit) searchSubmit.addEventListener('click', () => {
        if (desktopSearchBox) {
            desktopSearchBox.value = searchInput ? searchInput.value : '';
            performSearch();
            closeSearch();
        }
    });

    if (searchInput) {
        searchInput.addEventListener('input', () => {
            if (desktopSearchBox) desktopSearchBox.value = searchInput.value;
        });
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                if (desktopSearchBox) {
                    desktopSearchBox.value = searchInput.value;
                    performSearch();
                    closeSearch();
                }
            }
        });
    }
}
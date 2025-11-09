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

// 主题切换功能
function initThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    const body = document.body;
    
    // 从localStorage获取保存的主题
    const savedTheme = localStorage.getItem('theme') || 'light';
    
    // 应用保存的主题
    if (savedTheme === 'dark') {
        body.setAttribute('data-theme', 'dark');
        themeIcon.classList.remove('fa-sun');
        themeIcon.classList.add('fa-moon');
    }
    
    // 主题切换事件
    themeToggle.addEventListener('click', () => {
        const currentTheme = body.getAttribute('data-theme');
        
        if (currentTheme === 'dark') {
            body.setAttribute('data-theme', 'light');
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
            localStorage.setItem('theme', 'light');
        } else {
            body.setAttribute('data-theme', 'dark');
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
            localStorage.setItem('theme', 'dark');
        }
        
        // 添加切换动画效果
        themeToggle.style.transform = 'scale(0.8)';
        setTimeout(() => {
            themeToggle.style.transform = 'scale(1)';
        }, 150);
    });
}

// 页面加载时初始化主题切换
window.addEventListener('DOMContentLoaded', initThemeToggle);

function updateScrollButtons() {
    const tabsContainer = document.querySelector('.category-tabs');
    const leftBtn = document.querySelector('.tab-scroll-btn.left');
    const rightBtn = document.querySelector('.tab-scroll-btn.right');
    
    // 检查是否可以向左滚动
    leftBtn.disabled = tabsContainer.scrollLeft <= 0;
    
    // 检查是否可以向右滚动
    rightBtn.disabled = tabsContainer.scrollLeft >= tabsContainer.scrollWidth - tabsContainer.clientWidth;
}

// 监听滚动事件以更新按钮状态
document.querySelector('.category-tabs').addEventListener('scroll', updateScrollButtons);

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
        transition: all 0.3s ease-out;
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
  });
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
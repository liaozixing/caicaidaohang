// 弹出层控制
function togglePopup(id) {
    const popup = document.getElementById(id);
    popup.classList.toggle('active');
    document.body.style.overflow = popup.classList.contains('active') ? 'hidden' : '';

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
        <button class="mobile-view-btn" type="button"><i class="fas fa-qrcode"></i> 在移动端查看</button>
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

    btn.addEventListener('click', () => {
      const url = detailMap[popup.id] || '';
      if (url) {
        // 使用在线二维码生成服务
        const api = 'https://api.qrserver.com/v1/create-qr-code/?size=220x220&margin=10&data=' + encodeURIComponent(url);
        img.src = api;
        qr.classList.add('open');
      } else {
        img.removeAttribute('src');
        qr.classList.add('open');
        qr.querySelector('.qr-hint').textContent = '未找到官网链接，请稍后重试';
      }
    });
  });
}

document.addEventListener('DOMContentLoaded', initDetailMobileView);
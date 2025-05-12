document.addEventListener('DOMContentLoaded', function() {
    const ITEMS_PER_PAGE = 9; // 每页显示9篇文章
    const blogGrid = document.querySelector('.blog-grid');
    const pagination = document.querySelector('.pagination');
    const prevButton = pagination.querySelector('.prev-page');
    const nextButton = pagination.querySelector('.next-page');
    let currentPage = 1;

    // 刷新分页和显示
    function refreshBlogCards() {
        const blogCards = Array.from(document.querySelectorAll('.blog-card'));
        const totalPages = Math.ceil(blogCards.length / ITEMS_PER_PAGE);
        updatePagination(totalPages);
        showPage(1);
    }

    // 显示指定页码的文章
    function showPage(pageNum) {
        const blogCards = Array.from(document.querySelectorAll('.blog-card'));
        const start = (pageNum - 1) * ITEMS_PER_PAGE;
        const end = start + ITEMS_PER_PAGE;
        blogCards.forEach((card, index) => {
            if (index >= start && index < end) {
                card.style.display = '';
                setTimeout(() => {
                    card.classList.add('fade-in');
                }, 50 * (index - start));
            } else {
                card.style.display = 'none';
                card.classList.remove('fade-in');
            }
        });
        // 更新页码按钮状态
        const pageNumbers = pagination.querySelectorAll('.page-number');
        pageNumbers.forEach(btn => {
            btn.classList.toggle('active', parseInt(btn.dataset.page) === pageNum);
        });
        prevButton.disabled = pageNum === 1;
        nextButton.disabled = pageNum === Math.ceil(blogCards.length / ITEMS_PER_PAGE);
        currentPage = pageNum;
    }

    // 更新分页按钮
    function updatePagination(totalPages) {
        const pageNumbersContainer = pagination.querySelector('.page-numbers');
        pageNumbersContainer.innerHTML = '';
        for (let i = 1; i <= totalPages; i++) {
            const button = document.createElement('button');
            button.type = 'button';
            button.className = 'page-number' + (i === 1 ? ' active' : '');
            button.dataset.page = i;
            button.textContent = i;
            button.addEventListener('click', () => showPage(i));
            pageNumbersContainer.appendChild(button);
        }
    }

    // 绑定上一页/下一页按钮点击事件
    prevButton.addEventListener('click', () => {
        if (currentPage > 1) {
            showPage(currentPage - 1);
        }
    });
    nextButton.addEventListener('click', () => {
        const blogCards = Array.from(document.querySelectorAll('.blog-card'));
        const totalPages = Math.ceil(blogCards.length / ITEMS_PER_PAGE);
        if (currentPage < totalPages) {
            showPage(currentPage + 1);
        }
    });

    // 处理分类筛选
    const filterTags = document.querySelectorAll('.filter-tag');
    filterTags.forEach(tag => {
        tag.addEventListener('click', () => {
            const category = tag.dataset.filter;
            filterTags.forEach(t => t.classList.remove('active'));
            tag.classList.add('active');
            const blogCards = Array.from(document.querySelectorAll('.blog-card'));
            blogCards.forEach(card => {
                if (category === 'all' || card.dataset.category === category) {
                    card.classList.remove('hidden');
                } else {
                    card.classList.add('hidden');
                }
            });
            refreshBlogCards();
        });
    });

    // 初始化显示第一页
    refreshBlogCards();

    // 时间格式化函数
    function formatDate(dateStr) {
        const date = new Date(dateStr);
        if (isNaN(date)) return dateStr;
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, '0');
        const d = String(date.getDate()).padStart(2, '0');
        return `${y}-${m}-${d}`;
    }

    // 自动加载 Markdown 文章并渲染为卡片
    fetch('articles/index.json')
      .then(res => res.json())
      .then(files => {
        files.forEach(file => {
          fetch(file)
            .then(res => res.text())
            .then(md => {
              const match = md.match(/^---([\s\S]+?)---([\s\S]*)$/);
              if (match) {
                const meta = jsyaml.load(match[1]);
                const content = match[2].trim();
                const firstParagraph = content.split(/\n\s*\n/)[0].trim();
                const card = document.createElement('article');
                card.className = 'blog-card fade-in';
                card.setAttribute('data-category', meta.category || '');
                card.innerHTML = `
                  <div class=\"blog-image\">\n                    <img src=\"${meta.cover}\" alt=\"${meta.title}\" loading=\"lazy\">\n                  </div>\n                  <div class=\"blog-content\">\n                    <div class=\"blog-meta\">\n                      <span class=\"blog-date\">${formatDate(meta.date)}</span>\n                      <span class=\"blog-category\">${meta.category}</span>\n                    </div>\n                    <h2>${meta.title}</h2>\n                    <div class=\"blog-description\">\n                      <p>${firstParagraph}</p>\n                    </div>\n                    <ul class=\"blog-tags\">\n                      ${(meta.tags || []).map(tag => `<li class=\"blog-tag\">${tag}</li>`).join('')}\n                    </ul>\n                    <a href=\"${meta.link}\" class=\"read-more\" target=\"_blank\" rel=\"noopener\">\n                      阅读全文\n                      <span class=\"arrow\">→</span>\n                    </a>\n                  </div>\n                `;
                blogGrid.prepend(card);
                refreshBlogCards();
              }
            });
        });
      });
}); 
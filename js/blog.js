document.addEventListener('DOMContentLoaded', async function() {
    const blogGrid = document.getElementById('blog-grid');
    if (!blogGrid) return;

    // 读取 index.json
    async function fetchArticlesList() {
        const res = await fetch('articles/index.json');
        return await res.json();
    }

    // 读取 md 文件并解析 YAML 头部
    async function fetchArticleMeta(mdPath) {
        const res = await fetch(mdPath);
        const text = await res.text();
        // 提取YAML头部
        const match = text.match(/^---([\s\S]*?)---/);
        if (!match) return null;
        const meta = jsyaml.load(match[1]);
        return meta;
    }

    // 日期格式化函数
    function formatDate(date) {
        if (typeof date === 'string') return date;
        if (date instanceof Date) {
            const y = date.getFullYear();
            const m = String(date.getMonth() + 1).padStart(2, '0');
            const d = String(date.getDate()).padStart(2, '0');
            return `${y}-${m}-${d}`;
        }
        return '';
    }

    // 生成卡片HTML
    function createCard(meta) {
        return `
        <article class="blog-card fade-in" data-category="${meta.category}">
            <div class="blog-image">
                <img src="${meta.cover}" alt="${meta.title}" loading="lazy">
            </div>
            <div class="blog-content">
                <div class="blog-meta">
                    <span class="blog-date">${formatDate(meta.date)}</span>
                    <span class="blog-category">${meta.category}</span>
                </div>
                <h2>${meta.title}</h2>
                <div class="blog-description">
                    <p>${meta.description || ''}</p>
                </div>
                <ul class="blog-tags">
                    ${(meta.tags || []).map(tag => `<li class="blog-tag">${tag}</li>`).join('')}
                </ul>
                <a href="${meta.link}" class="read-more" target="_blank" rel="noopener">
                    阅读全文
                    <span class="arrow">→</span>
                </a>
            </div>
        </article>
        `;
    }

    // 每页显示文章数
    const ARTICLES_PER_PAGE = 9;
    let currentPage = 1;
    let totalPages = 1;
    let allMetas = [];

    // 生成分页按钮
    function renderPagination() {
        const pagination = document.querySelector('.pagination');
        if (!pagination) return;
        const pageNumbers = pagination.querySelector('.page-numbers');
        if (!pageNumbers) return;
        pageNumbers.innerHTML = '';
        for (let i = 1; i <= totalPages; i++) {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'page-number' + (i === currentPage ? ' active' : '');
            btn.dataset.page = i;
            btn.textContent = i;
            btn.addEventListener('click', () => {
                if (currentPage !== i) {
                    currentPage = i;
                    renderBlogCards();
                }
            });
            pageNumbers.appendChild(btn);
        }
        // 上一页/下一页按钮状态
        const prevBtn = pagination.querySelector('.prev-page');
        const nextBtn = pagination.querySelector('.next-page');
        prevBtn.disabled = currentPage === 1;
        nextBtn.disabled = currentPage === totalPages;
    }

    // 渲染所有文章卡片（分页）
    async function renderBlogCards() {
        blogGrid.innerHTML = '加载中...';
        if (allMetas.length === 0) {
            const files = await fetchArticlesList();
            let metas = await Promise.all(files.map(fetchArticleMeta));
            metas = metas.filter(meta => meta && meta.date);
            metas.sort((a, b) => b.date - a.date);
            allMetas = metas;
            totalPages = Math.ceil(allMetas.length / ARTICLES_PER_PAGE);
        }
        // 分页
        const startIdx = (currentPage - 1) * ARTICLES_PER_PAGE;
        const endIdx = startIdx + ARTICLES_PER_PAGE;
        const pageMetas = allMetas.slice(startIdx, endIdx);
        blogGrid.innerHTML = pageMetas.map(meta => createCard(meta)).join('');
        renderPagination();
    }

    // 上一页/下一页按钮事件
    document.querySelector('.pagination .prev-page').addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            renderBlogCards();
        }
    });
    document.querySelector('.pagination .next-page').addEventListener('click', () => {
        if (currentPage < totalPages) {
            currentPage++;
            renderBlogCards();
        }
    });

    renderBlogCards();
}); 
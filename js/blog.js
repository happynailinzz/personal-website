document.addEventListener('DOMContentLoaded', function() {
    const ITEMS_PER_PAGE = 6; // 每页显示6篇文章
    const blogGrid = document.querySelector('.blog-grid');
    const blogCards = Array.from(document.querySelectorAll('.blog-card'));
    const pagination = document.querySelector('.pagination');
    const prevButton = pagination.querySelector('.prev-page');
    const nextButton = pagination.querySelector('.next-page');
    const pageNumbers = pagination.querySelectorAll('.page-number');
    
    let currentPage = 1;
    const totalPages = Math.ceil(blogCards.length / ITEMS_PER_PAGE);

    // 显示指定页码的文章
    function showPage(pageNum) {
        const start = (pageNum - 1) * ITEMS_PER_PAGE;
        const end = start + ITEMS_PER_PAGE;
        
        blogCards.forEach((card, index) => {
            if (index >= start && index < end) {
                card.style.display = '';
                // 添加渐入动画
                setTimeout(() => {
                    card.classList.add('fade-in');
                }, 50 * (index - start));
            } else {
                card.style.display = 'none';
                card.classList.remove('fade-in');
            }
        });

        // 更新页码按钮状态
        pageNumbers.forEach(btn => {
            btn.classList.toggle('active', parseInt(btn.dataset.page) === pageNum);
        });

        // 更新上一页/下一页按钮状态
        prevButton.disabled = pageNum === 1;
        nextButton.disabled = pageNum === totalPages;

        currentPage = pageNum;
    }

    // 绑定页码按钮点击事件
    pageNumbers.forEach(btn => {
        btn.addEventListener('click', () => {
            const pageNum = parseInt(btn.dataset.page);
            showPage(pageNum);
        });
    });

    // 绑定上一页/下一页按钮点击事件
    prevButton.addEventListener('click', () => {
        if (currentPage > 1) {
            showPage(currentPage - 1);
        }
    });

    nextButton.addEventListener('click', () => {
        if (currentPage < totalPages) {
            showPage(currentPage + 1);
        }
    });

    // 初始化显示第一页
    showPage(1);

    // 处理分类筛选
    const filterTags = document.querySelectorAll('.filter-tag');
    filterTags.forEach(tag => {
        tag.addEventListener('click', () => {
            const category = tag.dataset.filter;
            
            // 更新筛选按钮状态
            filterTags.forEach(t => t.classList.remove('active'));
            tag.classList.add('active');

            // 筛选文章
            blogCards.forEach(card => {
                if (category === 'all' || card.dataset.category === category) {
                    card.classList.remove('hidden');
                } else {
                    card.classList.add('hidden');
                }
            });

            // 重新计算分页并显示第一页
            const visibleCards = blogCards.filter(card => !card.classList.contains('hidden'));
            const newTotalPages = Math.ceil(visibleCards.length / ITEMS_PER_PAGE);

            // 更新页码按钮
            updatePagination(newTotalPages);
            showPage(1);
        });
    });

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
}); 
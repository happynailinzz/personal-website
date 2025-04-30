// 项目卡片和博客卡片淡入动画
document.addEventListener('DOMContentLoaded', function() {
    const animatedElements = document.querySelectorAll('.project-card, .blog-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });

    animatedElements.forEach(element => {
        observer.observe(element);
    });

    // 书籍分类过滤功能
    const filterTags = document.querySelectorAll('.filter-tag');
    const bookCards = document.querySelectorAll('.book-card');

    // 初始化 Intersection Observer 用于淡入动画
    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                fadeObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });

    // 为所有书籍卡片添加观察
    bookCards.forEach(card => {
        fadeObserver.observe(card);
    });

    // 分类过滤功能
    filterTags.forEach(tag => {
        tag.addEventListener('click', () => {
            // 移除所有标签的active类
            filterTags.forEach(t => t.classList.remove('active'));
            // 为当前点击的标签添加active类
            tag.classList.add('active');

            const category = tag.getAttribute('data-filter');

            bookCards.forEach(card => {
                // 重置卡片的淡入动画
                card.classList.remove('fade-in');
                
                if (category === 'all' || card.getAttribute('data-category') === category) {
                    card.style.display = 'block';
                    // 重新添加观察
                    fadeObserver.observe(card);
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // 更新页脚年份
    const currentYearElement = document.getElementById('current-year');
    if (currentYearElement) {
        currentYearElement.textContent = new Date().getFullYear();
    }

    // 项目过滤功能
    const projectCards = document.querySelectorAll('.project-card');

    filterTags.forEach(tag => {
        tag.addEventListener('click', () => {
            // 更新激活状态
            filterTags.forEach(t => t.classList.remove('active'));
            tag.classList.add('active');

            const filter = tag.getAttribute('data-filter');

            projectCards.forEach(card => {
                if (filter === 'all' || card.getAttribute('data-category') === filter) {
                    card.style.display = 'block';
                    // 重新触发淡入动画
                    card.classList.remove('fade-in');
                    void card.offsetWidth; // 触发重排
                    card.classList.add('fade-in');
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // 博客过滤功能
    const blogFilterTags = document.querySelectorAll('.blog-filter .filter-tag');
    const blogCards = document.querySelectorAll('.blog-card');

    // 初始化博客卡片的 Intersection Observer
    const blogFadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                blogFadeObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });

    // 为所有博客卡片添加观察
    blogCards.forEach(card => {
        blogFadeObserver.observe(card);
    });

    // 博客分类过滤功能
    blogFilterTags.forEach(tag => {
        tag.addEventListener('click', () => {
            // 更新激活状态
            blogFilterTags.forEach(t => t.classList.remove('active'));
            tag.classList.add('active');

            const filter = tag.getAttribute('data-filter');

            blogCards.forEach(card => {
                // 重置卡片的淡入动画
                card.classList.remove('fade-in');
                
                if (filter === 'all' || card.getAttribute('data-category') === filter) {
                    card.style.display = 'block';
                    // 重新添加观察
                    blogFadeObserver.observe(card);
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
});

// 响应式导航栏处理
const handleResponsiveNav = () => {
    const nav = document.querySelector('.nav-container');
    if (window.innerWidth <= 768) {
        nav.classList.add('mobile');
    } else {
        nav.classList.remove('mobile');
    }
};

// 监听窗口大小变化
window.addEventListener('resize', handleResponsiveNav);
// 初始化时执行一次
handleResponsiveNav();

// 博客分页功能
const ITEMS_PER_PAGE = 6; // 每页显示的博客文章数量
let currentPage = 1;
let filteredBlogPosts = [];

function initBlogPagination() {
    const blogGrid = document.querySelector('.blog-grid');
    if (!blogGrid) return;

    // 获取所有博客文章
    const blogPosts = Array.from(blogGrid.querySelectorAll('.blog-card'));
    filteredBlogPosts = blogPosts;

    // 初始化分页
    updatePagination();
    showPage(1);

    // 绑定分页按钮事件
    const prevBtn = document.querySelector('.pagination-prev');
    const nextBtn = document.querySelector('.pagination-next');

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            if (currentPage > 1) {
                showPage(currentPage - 1);
            }
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            if (currentPage < getTotalPages()) {
                showPage(currentPage + 1);
            }
        });
    }

    // 绑定过滤标签事件
    const filterTags = document.querySelectorAll('.filter-tag');
    filterTags.forEach(tag => {
        tag.addEventListener('click', () => {
            filterTags.forEach(t => t.classList.remove('active'));
            tag.classList.add('active');
            
            const category = tag.dataset.category;
            filterBlogPosts(category);
        });
    });

    // 绑定搜索功能
    const searchInput = document.querySelector('.search-input');
    const searchBtn = document.querySelector('.search-btn');

    if (searchInput && searchBtn) {
        searchBtn.addEventListener('click', () => {
            searchBlogPosts(searchInput.value.trim());
        });

        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                searchBlogPosts(searchInput.value.trim());
            }
        });
    }
}

function getTotalPages() {
    return Math.ceil(filteredBlogPosts.length / ITEMS_PER_PAGE);
}

function updatePagination() {
    const totalPages = getTotalPages();
    const paginationCurrent = document.querySelector('.pagination-current');
    const paginationTotal = document.querySelector('.pagination-total');
    const prevBtn = document.querySelector('.pagination-prev');
    const nextBtn = document.querySelector('.pagination-next');

    if (paginationCurrent) {
        paginationCurrent.textContent = currentPage;
    }
    if (paginationTotal) {
        paginationTotal.textContent = totalPages;
    }
    if (prevBtn) {
        prevBtn.disabled = currentPage === 1;
    }
    if (nextBtn) {
        nextBtn.disabled = currentPage === totalPages;
    }
}

function showPage(page) {
    currentPage = page;
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;

    // 隐藏所有博客文章
    filteredBlogPosts.forEach(post => {
        post.style.display = 'none';
    });

    // 显示当前页的博客文章
    filteredBlogPosts.slice(startIndex, endIndex).forEach(post => {
        post.style.display = 'block';
    });

    updatePagination();
}

function filterBlogPosts(category) {
    const blogGrid = document.querySelector('.blog-grid');
    if (!blogGrid) return;

    const allPosts = Array.from(blogGrid.querySelectorAll('.blog-card'));
    
    if (category === 'all') {
        filteredBlogPosts = allPosts;
    } else {
        filteredBlogPosts = allPosts.filter(post => {
            const postCategory = post.querySelector('.blog-category').textContent.toLowerCase();
            return postCategory === category.toLowerCase();
        });
    }

    currentPage = 1;
    updatePagination();
    showPage(1);
}

function searchBlogPosts(query) {
    const blogGrid = document.querySelector('.blog-grid');
    if (!blogGrid) return;

    const allPosts = Array.from(blogGrid.querySelectorAll('.blog-card'));
    
    if (!query) {
        filteredBlogPosts = allPosts;
    } else {
        query = query.toLowerCase();
        filteredBlogPosts = allPosts.filter(post => {
            const title = post.querySelector('h2').textContent.toLowerCase();
            const excerpt = post.querySelector('.blog-excerpt').textContent.toLowerCase();
            const category = post.querySelector('.blog-category').textContent.toLowerCase();
            
            return title.includes(query) || 
                   excerpt.includes(query) || 
                   category.includes(query);
        });
    }

    currentPage = 1;
    updatePagination();
    showPage(1);
}

// 在页面加载完成后初始化分页功能
document.addEventListener('DOMContentLoaded', () => {
    initBlogPagination();
});

// 博客列表页面功能
document.addEventListener('DOMContentLoaded', function() {
    // 获取博客列表页面元素
    const blogList = document.querySelector('.blog-grid');
    if (!blogList) return; // 如果不在博客列表页面，则返回

    const searchInput = document.querySelector('.blog-search input');
    const searchButton = document.querySelector('.blog-search button');
    const categoryButtons = document.querySelectorAll('.category-btn');
    const paginationButtons = document.querySelectorAll('.pagination button');

    // 博客文章数据（实际应用中应该从后端获取）
    let blogPosts = [
        {
            id: 1,
            title: 'AI驱动的数字化转型：企业实践指南',
            category: 'transformation',
            date: '2024-03-20',
            excerpt: '探讨如何利用人工智能技术推动企业数字化转型，包括实施策略、挑战应对和最佳实践案例分析...',
            tags: ['AI', '数字化转型', '企业创新'],
            image: 'images/blog/ai-transformation.jpg'
        },
        {
            id: 2,
            title: '现代企业敏捷管理方法论',
            category: 'management',
            date: '2024-03-15',
            excerpt: '深入探讨现代企业如何实施敏捷管理，提高团队效率和项目成功率，包含实际案例分析...',
            tags: ['敏捷管理', '项目管理', '团队协作'],
            image: 'images/blog/agile-management.jpg'
        },
        {
            id: 3,
            title: '区块链技术在企业中的创新应用',
            category: 'tech',
            date: '2024-03-10',
            excerpt: '探索区块链技术如何在现代企业中发挥作用，包括供应链管理、金融服务和数据安全等领域的应用...',
            tags: ['区块链', '技术创新', '企业应用'],
            image: 'images/blog/blockchain.jpg'
        },
        {
            id: 4,
            title: '大数据分析与商业智能的融合',
            category: 'tech',
            date: '2024-03-08',
            excerpt: '探讨大数据分析技术如何与商业智能相结合，帮助企业做出更明智的决策，提升竞争优势...',
            tags: ['大数据', '商业智能', '数据分析'],
            image: 'images/blog/big-data.jpg'
        },
        {
            id: 5,
            title: '创新文化：打造高效创新型组织',
            category: 'innovation',
            date: '2024-03-05',
            excerpt: '分析如何在企业中培养创新文化，建立支持创新的组织结构和激励机制，促进持续创新...',
            tags: ['创新文化', '组织管理', '团队建设'],
            image: 'images/blog/innovation-culture.jpg'
        },
        {
            id: 6,
            title: '云原生架构转型实践',
            category: 'transformation',
            date: '2024-03-01',
            excerpt: '分享企业级应用迁移到云原生架构的实践经验，包括技术选型、架构设计和最佳实践...',
            tags: ['云原生', '架构设计', '技术转型'],
            image: 'images/blog/cloud-native.jpg'
        },
        {
            id: 7,
            title: '数据驱动的产品决策',
            category: 'management',
            date: '2024-02-28',
            excerpt: '探讨如何利用数据分析支持产品决策，优化产品策略，提升用户体验和商业价值...',
            tags: ['产品管理', '数据分析', '决策优化'],
            image: 'images/blog/data-driven.jpg'
        },
        {
            id: 8,
            title: '5G技术与物联网创新',
            category: 'tech',
            date: '2024-02-25',
            excerpt: '深入分析5G技术在物联网领域的应用前景，探讨未来发展趋势和商业机会...',
            tags: ['5G', '物联网', '技术创新'],
            image: 'images/blog/5g-iot.jpg'
        },
        {
            id: 9,
            title: '企业数字化转型路线图',
            category: 'transformation',
            date: '2024-02-20',
            excerpt: '为企业提供数字化转型的系统性指导，包括战略规划、实施步骤和关键成功因素...',
            tags: ['数字化转型', '战略规划', '变革管理'],
            image: 'images/blog/digital-roadmap.jpg'
        },
        {
            id: 10,
            title: '开放创新：突破传统创新边界',
            category: 'innovation',
            date: '2024-02-15',
            excerpt: '探讨开放创新模式如何帮助企业突破创新瓶颈，整合外部资源，加速创新进程...',
            tags: ['开放创新', '创新管理', '资源整合'],
            image: 'images/blog/open-innovation.jpg'
        },
        {
            id: 11,
            title: '人工智能在客户服务中的应用',
            category: 'tech',
            date: '2024-02-10',
            excerpt: '分析AI技术如何改革传统客户服务模式，提升服务质量和效率，降低运营成本...',
            tags: ['人工智能', '客户服务', '服务创新'],
            image: 'images/blog/ai-customer-service.jpg'
        },
        {
            id: 12,
            title: '敏捷领导力：数字时代的管理艺术',
            category: 'management',
            date: '2024-02-05',
            excerpt: '探讨数字时代领导者需要具备的核心能力，以及如何培养和提升敏捷领导力...',
            tags: ['领导力', '敏捷管理', '人才发展'],
            image: 'images/blog/agile-leadership.jpg'
        }
    ];

    // 当前状态
    let currentState = {
        category: 'all',
        searchTerm: '',
        currentPage: 1,
        postsPerPage: 6
    };

    // 搜索功能
    function handleSearch() {
        const searchTerm = searchInput.value.toLowerCase().trim();
        currentState.searchTerm = searchTerm;
        currentState.currentPage = 1; // 重置页码
        filterAndRenderPosts();
    }

    // 分类过滤功能
    function handleCategoryFilter(category) {
        currentState.category = category;
        currentState.currentPage = 1; // 重置页码
        
        // 更新按钮状态
        categoryButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.category === category);
        });

        filterAndRenderPosts();
    }

    // 过滤并渲染博客文章
    function filterAndRenderPosts() {
        let filteredPosts = blogPosts;

        // 应用分类过滤
        if (currentState.category !== 'all') {
            filteredPosts = filteredPosts.filter(post => 
                post.category === currentState.category
            );
        }

        // 应用搜索过滤
        if (currentState.searchTerm) {
            filteredPosts = filteredPosts.filter(post => 
                post.title.toLowerCase().includes(currentState.searchTerm) ||
                post.excerpt.toLowerCase().includes(currentState.searchTerm) ||
                post.tags.some(tag => tag.toLowerCase().includes(currentState.searchTerm))
            );
        }

        // 分页处理
        const startIndex = (currentState.currentPage - 1) * currentState.postsPerPage;
        const paginatedPosts = filteredPosts.slice(startIndex, startIndex + currentState.postsPerPage);

        // 渲染文章
        renderPosts(paginatedPosts);

        // 更新分页控件
        updatePagination(filteredPosts.length);
    }

    // 渲染博客文章
    function renderPosts(posts) {
        blogList.innerHTML = posts.map(post => `
            <article class="blog-card fade-in">
                <img src="${post.image}" alt="${post.title}" loading="lazy">
                <div class="blog-card-content">
                    <div class="blog-meta">
                        <span class="blog-category">${getCategoryName(post.category)}</span>
                        <time datetime="${post.date}">${post.date}</time>
                    </div>
                    <h3>${post.title}</h3>
                    <p class="blog-excerpt">${post.excerpt}</p>
                    <div class="blog-tags">
                        ${post.tags.map(tag => `<span class="blog-tag">${tag}</span>`).join('')}
                    </div>
                </div>
            </article>
        `).join('');
    }

    // 获取分类名称
    function getCategoryName(category) {
        const categoryNames = {
            'tech': '技术',
            'management': '管理',
            'innovation': '创新',
            'transformation': '数字化转型'
        };
        return categoryNames[category] || category;
    }

    // 更新分页控件
    function updatePagination(totalPosts) {
        const totalPages = Math.ceil(totalPosts / currentState.postsPerPage);
        const paginationContainer = document.querySelector('.pagination');
        
        let paginationHTML = '';
        
        // 上一页按钮
        paginationHTML += `<button ${currentState.currentPage === 1 ? 'disabled' : ''}>上一页</button>`;
        
        // 页码按钮
        for (let i = 1; i <= totalPages; i++) {
            paginationHTML += `<button class="${currentState.currentPage === i ? 'active' : ''}">${i}</button>`;
        }
        
        // 下一页按钮
        paginationHTML += `<button ${currentState.currentPage === totalPages ? 'disabled' : ''}>下一页</button>`;
        
        paginationContainer.innerHTML = paginationHTML;
        
        // 重新添加事件监听器
        attachPaginationListeners();
    }

    // 添加分页事件监听器
    function attachPaginationListeners() {
        const newPaginationButtons = document.querySelectorAll('.pagination button');
        newPaginationButtons.forEach(button => {
            button.addEventListener('click', () => {
                if (button.disabled) return;
                
                const buttonText = button.textContent;
                const totalPages = Math.ceil(blogPosts.length / currentState.postsPerPage);
                
                if (buttonText === '上一页') {
                    currentState.currentPage--;
                } else if (buttonText === '下一页') {
                    currentState.currentPage++;
                } else {
                    currentState.currentPage = parseInt(buttonText);
                }
                
                filterAndRenderPosts();
            });
        });
    }

    // 添加事件监听器
    searchInput.addEventListener('input', handleSearch);
    searchButton.addEventListener('click', handleSearch);
    
    categoryButtons.forEach(button => {
        button.addEventListener('click', () => {
            handleCategoryFilter(button.dataset.category);
        });
    });

    // 初始化渲染
    filterAndRenderPosts();
});

// 更新页脚年份
document.getElementById('current-year').textContent = new Date().getFullYear();

// 打字机效果实现
document.addEventListener('DOMContentLoaded', function() {
    const typewriterLines = document.querySelectorAll('.typewriter-text');
    const totalLines = typewriterLines.length;
    let currentLine = 0;
    
    // 设置每行打字的速度 (毫秒/字符)
    const typingSpeed = 80;
    // 设置每行完成后暂停时间 (毫秒)
    const pauseBetweenLines = 700;

    // 开始打字效果
    function startTypingEffect() {
        if (currentLine < totalLines) {
            const line = typewriterLines[currentLine];
            const text = line.textContent;
            line.textContent = '';
            line.style.visibility = 'visible';
            
            // 添加当前行标记和打字效果
            line.classList.add('current', 'typing');
            
            // 逐字打字效果
            let charIndex = 0;
            const typeChar = () => {
                if (charIndex < text.length) {
                    line.textContent += text.charAt(charIndex);
                    charIndex++;
                    setTimeout(typeChar, typingSpeed);
                } else {
                    // 当前行打字完成
        setTimeout(() => {
                        line.classList.remove('current', 'typing');
                        line.classList.add('typed');
                        currentLine++;
                        startTypingEffect();
                    }, pauseBetweenLines);
                }
            };

            // 开始当前行的打字
            typeChar();
        }
    }
    
    // 初始化元素样式
    typewriterLines.forEach(line => {
        line.style.visibility = 'hidden';
    });
    
    // 延迟启动打字效果
    setTimeout(startTypingEffect, 800);
});

// 渐入动画触发
document.addEventListener('DOMContentLoaded', function() {
    const fadeElements = document.querySelectorAll('.fade-in');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeIn 0.6s ease forwards';
                observer.unobserve(entry.target);
        }
    });
    }, { threshold: 0.1 });
    
    fadeElements.forEach(element => {
        observer.observe(element);
        });
    });

// 表单提交处理
function handleSubmit(event) {
    event.preventDefault();
    
    // 在这里添加表单处理逻辑
    const name = document.querySelector('input[name="name"]').value;
    const email = document.querySelector('input[name="email"]').value;
    const subject = document.querySelector('input[name="subject"]').value;
    const message = document.querySelector('textarea[name="message"]').value;

    // 模拟表单提交 - 实际项目中替换为真实的API调用
    console.log('表单提交:', { name, email, subject, message });
    
    // 清空表单
    document.getElementById('contactForm').reset();
    
    // 显示成功消息
    alert('消息已发送，谢谢您的留言！');
    
    return false;
}

// 响应式导航菜单
const header = document.querySelector('.header');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll <= 0) {
        header.classList.remove('scroll-up');
        return;
    }
    
    if (currentScroll > lastScroll && !header.classList.contains('scroll-down')) {
        // 向下滚动
        header.classList.remove('scroll-up');
        header.classList.add('scroll-down');
    } else if (currentScroll < lastScroll && header.classList.contains('scroll-down')) {
        // 向上滚动
        header.classList.remove('scroll-down');
        header.classList.add('scroll-up');
    }
    
    lastScroll = currentScroll;
});

// 博客详情页面功能
document.addEventListener('DOMContentLoaded', function() {
    // 检查是否在博客详情页面
    const blogDetailSection = document.querySelector('.blog-detail-section');
    if (!blogDetailSection) return;

    // 从URL获取文章ID
    const urlParams = new URLSearchParams(window.location.search);
    const articleId = urlParams.get('id');

    if (!articleId) {
        console.error('未找到文章ID');
        return;
    }

    // 获取文章内容
    const article = findArticleById(articleId);
    if (!article) {
        console.error('未找到文章');
        return;
    }

    // 更新页面标题
    document.title = `${article.title} - 我的个人网站`;

    // 更新文章元数据
    updateArticleMetadata(article);

    // 更新文章内容
    updateArticleContent(article);

    // 更新作者信息
    updateAuthorInfo();

    // 加载相关文章
    loadRelatedArticles(article);
});

// 根据ID查找文章
function findArticleById(id) {
    // 这里使用之前定义的博客文章数据
    const blogPosts = [
        {
            id: 1,
            title: 'AI驱动的数字化转型：企业实践指南',
            category: 'transformation',
            date: '2024-03-20',
            excerpt: '探讨如何利用人工智能技术推动企业数字化转型，包括实施策略、挑战应对和最佳实践案例分析...',
            tags: ['AI', '数字化转型', '企业创新'],
            image: 'images/blog/ai-transformation.jpg',
            content: `
                <h2>引言</h2>
                <p>在当今数字化时代，人工智能技术正在深刻改变企业的运营方式和商业模式。本文将深入探讨AI驱动的数字化转型实践，为企业提供可行的实施指南。</p>

                <h2>AI驱动的数字化转型核心要素</h2>
                <p>成功的AI驱动数字化转型需要考虑以下关键要素：</p>
                <ul>
                    <li>明确的转型战略和目标</li>
                    <li>数据治理和管理</li>
                    <li>技术架构升级</li>
                    <li>人才培养和组织变革</li>
                </ul>

                <h2>实施路径和方法论</h2>
                <p>企业可以通过以下步骤实现AI驱动的数字化转型：</p>
                <ol>
                    <li>评估现状和确定目标</li>
                    <li>制定详细的实施计划</li>
                    <li>建立数据基础设施</li>
                    <li>开展试点项目</li>
                    <li>推广成功经验</li>
                </ol>

                <h2>案例分析</h2>
                <p>以下是几个成功实施AI驱动数字化转型的企业案例：</p>
                <ul>
                    <li>案例1：制造业智能工厂转型</li>
                    <li>案例2：金融服务智能化升级</li>
                    <li>案例3：零售业数字化革新</li>
                </ul>

                <h2>挑战与应对</h2>
                <p>在实施过程中，企业可能面临以下挑战：</p>
                <ul>
                    <li>技术选型和整合</li>
                    <li>数据安全和隐私保护</li>
                    <li>组织变革阻力</li>
                    <li>投资回报评估</li>
                </ul>

                <h2>未来展望</h2>
                <p>AI驱动的数字化转型将继续深化，企业需要保持创新意识，持续优化和调整转型策略，以适应快速变化的市场环境。</p>
            `
        },
        // ... 其他文章数据 ...
    ];

    return blogPosts.find(post => post.id === parseInt(id));
}

// 更新文章元数据
function updateArticleMetadata(article) {
    // 更新分类
    const categoryElement = document.querySelector('.blog-category');
    if (categoryElement) {
        categoryElement.textContent = getCategoryName(article.category);
    }

    // 更新发布日期
    const dateElement = document.querySelector('.blog-meta time');
    if (dateElement) {
        dateElement.textContent = article.date;
        dateElement.setAttribute('datetime', article.date);
    }

    // 更新标题
    const titleElement = document.querySelector('.blog-title');
    if (titleElement) {
        titleElement.textContent = article.title;
    }

    // 更新标签
    const tagsContainer = document.querySelector('.blog-tags');
    if (tagsContainer) {
        tagsContainer.innerHTML = article.tags.map(tag => 
            `<span class="blog-tag">${tag}</span>`
        ).join('');
    }

    // 更新封面图片
    const coverImage = document.querySelector('.blog-cover img');
    if (coverImage) {
        coverImage.src = article.image;
        coverImage.alt = article.title;
    }
}

// 更新文章内容
function updateArticleContent(article) {
    const contentElement = document.getElementById('article-content');
    if (contentElement) {
        contentElement.innerHTML = article.content;
    }
}

// 更新作者信息
function updateAuthorInfo() {
    const authorInfo = {
        name: '张三',
        avatar: 'images/avatar.jpg',
        bio: '资深技术专家，专注于人工智能、数字化转型和技术创新。拥有多年企业数字化转型咨询和实施经验。',
        github: 'https://github.com/zhangsan',
        linkedin: 'https://linkedin.com/in/zhangsan'
    };

    const authorNameElement = document.querySelector('.author-details h3');
    if (authorNameElement) {
        authorNameElement.textContent = authorInfo.name;
    }

    const authorAvatarElement = document.querySelector('.author-avatar img');
    if (authorAvatarElement) {
        authorAvatarElement.src = authorInfo.avatar;
        authorAvatarElement.alt = `${authorInfo.name}的头像`;
    }

    const authorBioElement = document.querySelector('.author-bio');
    if (authorBioElement) {
        authorBioElement.textContent = authorInfo.bio;
    }

    const [githubLink, linkedinLink] = document.querySelectorAll('.author-social a');
    if (githubLink) {
        githubLink.href = authorInfo.github;
    }
    if (linkedinLink) {
        linkedinLink.href = authorInfo.linkedin;
    }
}

// 加载相关文章
function loadRelatedArticles(currentArticle) {
    // 获取相同分类的其他文章
    const relatedPosts = blogPosts
        .filter(post => 
            post.id !== currentArticle.id && 
            (post.category === currentArticle.category || 
             post.tags.some(tag => currentArticle.tags.includes(tag)))
        )
        .slice(0, 3); // 最多显示3篇相关文章

    const relatedGrid = document.querySelector('.related-posts-grid');
    if (relatedGrid) {
        relatedGrid.innerHTML = relatedPosts.map(post => `
            <article class="blog-card fade-in">
                <img src="${post.image}" alt="${post.title}" loading="lazy">
                <div class="blog-card-content">
                    <div class="blog-meta">
                        <span class="blog-category">${getCategoryName(post.category)}</span>
                        <time datetime="${post.date}">${post.date}</time>
                    </div>
                    <h3>${post.title}</h3>
                    <p class="blog-excerpt">${post.excerpt}</p>
                    <div class="blog-tags">
                        ${post.tags.map(tag => `<span class="blog-tag">${tag}</span>`).join('')}
                    </div>
                    <a href="blog-detail.html?id=${post.id}" class="read-more">
                        阅读更多
                        <svg class="arrow" width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M1 8h14M8 1l7 7-7 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </a>
                </div>
            </article>
        `).join('');
    }
}

// 评论功能
if (document.querySelector('.comments-section')) {
    // 评论数据存储
    let comments = JSON.parse(localStorage.getItem('blogComments')) || {};
    
    // 获取当前文章ID
    const articleId = new URLSearchParams(window.location.search).get('id');
    
    // 初始化当前文章的评论
    if (!comments[articleId]) {
        comments[articleId] = [];
    }

    // 更新评论计数
    function updateCommentCount() {
        const count = comments[articleId].length;
        document.getElementById('commentCount').textContent = `(${count})`;
    }

    // 渲染评论列表
    function renderComments() {
        const commentsList = document.querySelector('.comments-list');
        const commentsContainer = commentsList.querySelector('.comments-container');
        commentsContainer.innerHTML = '';

        if (comments[articleId].length === 0) {
            commentsContainer.innerHTML = '<p class="no-comments">暂无评论，快来发表第一条评论吧！</p>';
            return;
        }

        comments[articleId].forEach((comment, index) => {
            const commentElement = document.createElement('div');
            commentElement.className = 'comment-item';
            commentElement.innerHTML = `
                <div class="comment-header">
                    <span class="comment-author">${comment.name}</span>
                    <span class="comment-date">${comment.date}</span>
                </div>
                <div class="comment-content">${comment.content}</div>
                <div class="comment-actions">
                    <span class="comment-action reply-btn" data-index="${index}">回复</span>
                    <span class="comment-action like-btn" data-index="${index}">
                        点赞 ${comment.likes ? `(${comment.likes})` : ''}
                    </span>
                </div>
            `;
            commentsContainer.appendChild(commentElement);
        });

        // 绑定点赞事件
        document.querySelectorAll('.like-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const index = parseInt(this.dataset.index);
                if (!comments[articleId][index].likes) {
                    comments[articleId][index].likes = 0;
                }
                comments[articleId][index].likes++;
                localStorage.setItem('blogComments', JSON.stringify(comments));
                renderComments();
            });
        });

        // 绑定回复事件
        document.querySelectorAll('.reply-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const index = parseInt(this.dataset.index);
                const replyTo = comments[articleId][index].name;
                const textarea = document.querySelector('#commentContent');
                textarea.value = `@${replyTo} `;
                textarea.focus();
            });
        });
    }

    // 提交评论
    const commentForm = document.getElementById('commentForm');
    commentForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const nameInput = document.getElementById('commentName');
        const emailInput = document.getElementById('commentEmail');
        const contentInput = document.getElementById('commentContent');

        // 表单验证
        if (!nameInput.value.trim() || !emailInput.value.trim() || !contentInput.value.trim()) {
            alert('请填写完整的评论信息！');
            return;
        }

        // 创建新评论
        const newComment = {
            name: nameInput.value.trim(),
            email: emailInput.value.trim(),
            content: contentInput.value.trim(),
            date: new Date().toLocaleString('zh-CN', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
            }),
            likes: 0
        };

        // 添加评论到存储
        comments[articleId].unshift(newComment);
        localStorage.setItem('blogComments', JSON.stringify(comments));

        // 重置表单
        commentForm.reset();

        // 更新显示
        updateCommentCount();
        renderComments();

        // 显示成功提示
        alert('评论发表成功！');
    });

    // 初始化评论显示
    updateCommentCount();
    renderComments();
}

// 留言板功能
const STORAGE_KEY = 'site_messages';

// 获取所有留言
function getMessages() {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
}

// 保存留言
function saveMessage(message) {
    const messages = getMessages();
    messages.unshift(message); // 新消息放在前面
    
    // 只保留最新的20条留言
    if (messages.length > 20) {
        messages.length = 20;
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
}

// 格式化日期
function formatDate(date) {
    return new Date(date).toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// 渲染留言列表
function renderMessages() {
    const messages = getMessages();
    const messagesList = document.querySelector('.messages-list');
    if (!messagesList) return;

    messagesList.innerHTML = messages.map(msg => `
        <div class="message-item fade-in">
            <div class="message-header">
                <span class="message-author">${msg.name}</span>
                <span class="message-date">${formatDate(msg.date)}</span>
            </div>
            <div class="message-content">
                <h4>${msg.subject}</h4>
                <p>${msg.message}</p>
            </div>
        </div>
    `).join('');
}

// 处理表单提交
function handleSubmit(event) {
    event.preventDefault();
    
    const form = event.target;
    const submitBtn = form.querySelector('button[type="submit"]');
    
    // 禁用提交按钮
    submitBtn.disabled = true;
    submitBtn.textContent = '提交中...';
    
    try {
        // 获取表单数据
        const formData = new FormData(form);
        const message = {
            name: formData.get('name'),
            email: formData.get('email'),
            subject: formData.get('subject'),
            message: formData.get('message'),
            date: new Date().toISOString()
        };
        
        // 保存留言
        saveMessage(message);
        
        // 重新渲染留言列表
        renderMessages();
        
        // 重置表单
        form.reset();
        
        // 显示成功提示
        alert('留言提交成功！');
    } catch (error) {
        console.error('提交留言失败:', error);
        alert('抱歉，提交留言时出现错误，请稍后重试。');
    } finally {
        // 恢复提交按钮
        submitBtn.disabled = false;
        submitBtn.textContent = '发送留言';
    }
    
    return false;
}

// 页面加载完成后渲染留言列表
document.addEventListener('DOMContentLoaded', () => {
    renderMessages();
});

// 添加Font Awesome图标
document.addEventListener('DOMContentLoaded', function() {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css';
    document.head.appendChild(link);
}); 
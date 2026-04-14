/**
 * QwenPaw 技术方案报告 - 页面导航脚本
 */

// 获取所有页面
const pages = document.querySelectorAll('.page');
let currentPage = 0;

// 初始化
function init() {
    updatePageIndicator();
    scrollToPage(0);
}

// 滚动到指定页面
function scrollToPage(index) {
    if (index < 0 || index >= pages.length) return;
    
    currentPage = index;
    pages[index].scrollIntoView({ behavior: 'smooth', block: 'start' });
    updatePageIndicator();
    updateURLHash();
}

// 下一页
function nextPage() {
    if (currentPage < pages.length - 1) {
        scrollToPage(currentPage + 1);
    }
}

// 上一页
function prevPage() {
    if (currentPage > 0) {
        scrollToPage(currentPage - 1);
    }
}

// 更新页面指示器
function updatePageIndicator() {
    const indicator = document.getElementById('pageIndicator');
    if (indicator) {
        indicator.textContent = `${currentPage + 1} / ${pages.length}`;
    }
}

// 更新 URL hash
function updateURLHash() {
    const pageId = pages[currentPage].id;
    if (pageId) {
        history.replaceState(null, null, `#${pageId}`);
    }
}

// 键盘导航
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        nextPage();
    } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        e.preventDefault();
        prevPage();
    } else if (e.key === 'Home') {
        e.preventDefault();
        scrollToPage(0);
    } else if (e.key === 'End') {
        e.preventDefault();
        scrollToPage(pages.length - 1);
    }
});

// 滚轮导航（可选）
let wheelTimeout;
document.addEventListener('wheel', (e) => {
    clearTimeout(wheelTimeout);
    wheelTimeout = setTimeout(() => {
        if (e.deltaY > 50) {
            nextPage();
        } else if (e.deltaY < -50) {
            prevPage();
        }
    }, 50);
}, { passive: true });

// 触摸滑动支持
let touchStartY = 0;
document.addEventListener('touchstart', (e) => {
    touchStartY = e.touches[0].clientY;
}, { passive: true });

document.addEventListener('touchend', (e) => {
    const touchEndY = e.changedTouches[0].clientY;
    const diff = touchStartY - touchEndY;
    
    if (Math.abs(diff) > 50) {
        if (diff > 0) {
            nextPage();
        } else {
            prevPage();
        }
    }
}, { passive: true });

// 目录链接点击处理
document.querySelectorAll('.toc-nav a').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href').substring(1);
        const targetPage = document.getElementById(targetId);
        if (targetPage) {
            const index = Array.from(pages).indexOf(targetPage);
            scrollToPage(index);
        }
    });
});

// 页面可见性变化时更新
document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
        updatePageIndicator();
    }
});

// 滚动时更新当前页面
const observerOptions = {
    root: null,
    rootMargin: '-50% 0px -50% 0px',
    threshold: 0
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const index = Array.from(pages).indexOf(entry.target);
            if (index !== -1) {
                currentPage = index;
                updatePageIndicator();
            }
        }
    });
}, observerOptions);

pages.forEach(page => observer.observe(page));

// 初始化
document.addEventListener('DOMContentLoaded', init);

// 导出函数供全局使用
window.nextPage = nextPage;
window.prevPage = prevPage;
window.scrollToPage = scrollToPage;

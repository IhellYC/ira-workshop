/**
 * 主逻辑交互模块
 * 处理页面交互、表单提交、结果展示
 */

document.addEventListener('DOMContentLoaded', function() {
    // 初始化
    initYearSelects();
    initDaySelects();
    initNavigation();
    initForms();
});

/**
 * 初始化年份选择器
 */
function initYearSelects() {
    const currentYear = new Date().getFullYear();
    const startYear = 1900;
    
    const yearSelects = ['birthYear', 'baziYear'];
    yearSelects.forEach(id => {
        const select = document.getElementById(id);
        if (select) {
            for (let year = currentYear; year >= startYear; year--) {
                const option = document.createElement('option');
                option.value = year;
                option.textContent = year + '年';
                select.appendChild(option);
            }
            // 默认选中1990年
            select.value = 1990;
        }
    });
}

/**
 * 初始化日期选择器
 */
function initDaySelects() {
    const daySelects = ['birthDay', 'baziDay'];
    daySelects.forEach(id => {
        const select = document.getElementById(id);
        if (select) {
            updateDaySelect(select, 1990, 1);
        }
    });
    
    // 监听年月变化，更新日期
    ['birth', 'bazi'].forEach(prefix => {
        const yearSelect = document.getElementById(prefix + 'Year');
        const monthSelect = document.getElementById(prefix + 'Month');
        const daySelect = document.getElementById(prefix + 'Day');
        
        if (yearSelect && monthSelect && daySelect) {
            const updateDays = () => {
                updateDaySelect(daySelect, parseInt(yearSelect.value), parseInt(monthSelect.value));
            };
            yearSelect.addEventListener('change', updateDays);
            monthSelect.addEventListener('change', updateDays);
        }
    });
}

/**
 * 更新日期选择器选项
 */
function updateDaySelect(select, year, month) {
    const daysInMonth = new Date(year, month, 0).getDate();
    const currentValue = select.value;
    
    select.innerHTML = '';
    for (let day = 1; day <= daysInMonth; day++) {
        const option = document.createElement('option');
        option.value = day;
        option.textContent = day + '日';
        select.appendChild(option);
    }
    
    // 保持之前的选择，如果有效
    if (currentValue && currentValue <= daysInMonth) {
        select.value = currentValue;
    }
}

/**
 * 初始化导航
 */
function initNavigation() {
    const navBtns = document.querySelectorAll('.nav-btn');
    const sections = document.querySelectorAll('.section');
    
    navBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetSection = btn.dataset.section;
            
            // 更新按钮状态
            navBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // 更新内容显示
            sections.forEach(s => {
                s.classList.remove('active');
                if (s.id === targetSection) {
                    s.classList.add('active');
                }
            });
        });
    });
}

/**
 * 初始化表单
 */
function initForms() {
    // 起名表单
    const namingForm = document.getElementById('namingForm');
    if (namingForm) {
        namingForm.addEventListener('submit', handleNamingSubmit);
        namingForm.addEventListener('reset', () => {
            document.getElementById('namingResult').style.display = 'none';
            document.getElementById('namingEmpty').style.display = 'block';
        });
    }
    
    // 名字拆解表单
    const analysisForm = document.getElementById('analysisForm');
    if (analysisForm) {
        analysisForm.addEventListener('submit', handleAnalysisSubmit);
        analysisForm.addEventListener('reset', () => {
            document.getElementById('analysisResult').style.display = 'none';
            document.getElementById('analysisEmpty').style.display = 'block';
        });
    }
    
    // 八字分析表单
    const baziForm = document.getElementById('baziForm');
    if (baziForm) {
        baziForm.addEventListener('submit', handleBaziSubmit);
        baziForm.addEventListener('reset', () => {
            document.getElementById('baziResult').style.display = 'none';
            document.getElementById('baziEmpty').style.display = 'block';
        });
    }
}

/**
 * 处理起名表单提交
 */
function handleNamingSubmit(e) {
    e.preventDefault();
    
    const surname = document.getElementById('surname').value.trim();
    const gender = document.querySelector('input[name="gender"]:checked').value;
    const year = parseInt(document.getElementById('birthYear').value);
    const month = parseInt(document.getElementById('birthMonth').value);
    const day = parseInt(document.getElementById('birthDay').value);
    const hour = parseInt(document.getElementById('birthHour').value);
    
    if (!surname) {
        alert('请输入姓氏');
        return;
    }
    
    // 显示加载状态
    const resultContainer = document.getElementById('namingResult');
    const emptyContainer = document.getElementById('namingEmpty');
    const nameList = document.getElementById('nameList');
    
    resultContainer.style.display = 'block';
    emptyContainer.style.display = 'none';
    nameList.innerHTML = '<div class="loading"><div class="loading-spinner"></div><div class="loading-text">正在推算吉名...</div></div>';
    
    // 模拟计算延迟
    setTimeout(() => {
        const names = NamingEngine.generateNames(surname, gender, { year, month, day, hour }, 8);
        renderNameList(names);
    }, 800);
}

/**
 * 渲染名字列表
 */
function renderNameList(names) {
    const nameList = document.getElementById('nameList');
    
    if (names.length === 0) {
        nameList.innerHTML = '<p style="text-align: center; color: var(--text-muted);">暂无推荐结果</p>';
        return;
    }
    
    nameList.innerHTML = names.map((name, index) => `
        <div class="name-card" style="animation: fadeIn 0.3s ease ${index * 0.1}s both;">
            <div class="name-info">
                <div class="name-text">${name.name}</div>
                <div class="name-pinyin">${name.pinyin || ''}</div>
                <div class="name-meaning">${name.meaning || ''}</div>
            </div>
            <div class="name-meta">
                <div class="name-score">${name.score}分</div>
                <div class="name-wuxing">${name.wuXing}</div>
                <div class="name-type">${name.type}</div>
            </div>
        </div>
    `).join('');
}

/**
 * 处理名字拆解表单提交
 */
function handleAnalysisSubmit(e) {
    e.preventDefault();
    
    const fullName = document.getElementById('fullName').value.trim();
    
    if (!fullName || fullName.length < 2) {
        alert('请输入有效的姓名（至少2个字）');
        return;
    }
    
    // 分析名字
    const analysis = NamingEngine.analyzeName(fullName);
    renderAnalysisResult(analysis);
}

/**
 * 渲染名字分析结果
 */
function renderAnalysisResult(analysis) {
    const resultContainer = document.getElementById('analysisResult');
    const emptyContainer = document.getElementById('analysisEmpty');
    
    resultContainer.style.display = 'block';
    emptyContainer.style.display = 'none';
    
    // 综合评分
    document.getElementById('overallScore').textContent = analysis.overallScore;
    document.getElementById('scoreComment').textContent = getScoreComment(analysis.overallScore);
    
    // 逐字分析
    const charAnalysisEl = document.getElementById('charAnalysis');
    charAnalysisEl.innerHTML = analysis.chars.map(char => `
        <div class="char-box">
            <div class="char">${char.char}</div>
            <div class="pinyin">${char.pinyin}</div>
            <div class="wuxing">${char.wuXing}</div>
        </div>
    `).join('');
    
    // 字义详解
    const charDetailsEl = document.getElementById('charDetails');
    charDetailsEl.innerHTML = analysis.chars.map(char => `
        <div class="analysis-item" style="margin-bottom: 15px;">
            <h4>${char.char} (${char.pinyin}) - ${char.position}</h4>
            <p><strong>五行：</strong>${char.wuXing} | <strong>笔画：</strong>${char.strokes}画</p>
            <p style="margin-top: 8px;">${char.meaning}</p>
        </div>
    `).join('');
    
    // 五行分布图表
    renderNameWuxingChart(analysis.wuXing);
    
    // 五行分析文字
    const wuxingAnalysisEl = document.getElementById('nameWuxingAnalysis');
    const dominantWuxing = Object.entries(analysis.wuXing)
        .sort((a, b) => b[1] - a[1])
        .filter(([_, count]) => count > 0);
    
    wuxingAnalysisEl.innerHTML = `
        <p><strong>五行分布：</strong>${dominantWuxing.map(([wx, count]) => `${wx}${count}个`).join('，')}</p>
        ${analysis.wuXingMissing.length > 0 ? 
            `<p style="margin-top: 8px; color: var(--accent-red);"><strong>五行缺失：</strong>${analysis.wuXingMissing.join('、')}</p>` : 
            '<p style="margin-top: 8px; color: var(--wuxing-wood);"><strong>五行齐全</strong></p>'
        }
    `;
    
    // 三才五格
    if (analysis.sanCaiWuGe) {
        const wuGe = analysis.sanCaiWuGe.wuGe;
        const wugeNumbersEl = document.getElementById('wugeNumbers');
        wugeNumbersEl.innerHTML = `
            <td class="number">${wuGe.tianGe}</td>
            <td class="number">${wuGe.renGe}</td>
            <td class="number">${wuGe.diGe}</td>
            <td class="number">${wuGe.waiGe}</td>
            <td class="number">${wuGe.zongGe}</td>
        `;
        
        const sanCai = analysis.sanCaiWuGe.sanCai;
        document.getElementById('sancaiAnalysis').innerHTML = `
            <p><strong>三才配置：</strong>天格${sanCai.tian} → 人格${sanCai.ren} → 地格${sanCai.di}</p>
            <p style="margin-top: 8px;">${getSancaiComment(sanCai)}</p>
        `;
    }
}

/**
 * 渲染名字五行图表
 */
function renderNameWuxingChart(wuXing) {
    const chartEl = document.getElementById('nameWuxingChart');
    const maxValue = Math.max(...Object.values(wuXing)) || 1;
    
    const wuxingNames = {
        '金': { label: '金', class: 'metal' },
        '木': { label: '木', class: 'wood' },
        '水': { label: '水', class: 'water' },
        '火': { label: '火', class: 'fire' },
        '土': { label: '土', class: 'earth' }
    };
    
    chartEl.innerHTML = Object.entries(wuXing).map(([wx, count]) => {
        const height = Math.max(10, (count / maxValue) * 100);
        const info = wuxingNames[wx];
        return `
            <div class="wuxing-item">
                <div class="wuxing-bar" style="height: ${height}px;" data-value="${count}"></div>
                <div class="wuxing-label ${info.class}">${info.label}</div>
            </div>
        `;
    }).join('');
}

/**
 * 处理八字分析表单提交
 */
function handleBaziSubmit(e) {
    e.preventDefault();
    
    const year = parseInt(document.getElementById('baziYear').value);
    const month = parseInt(document.getElementById('baziMonth').value);
    const day = parseInt(document.getElementById('baziDay').value);
    const hour = parseInt(document.getElementById('baziHour').value);
    
    // 计算八字
    const analysis = BaZiCalculator.fullAnalysis(year, month, day, hour);
    renderBaziResult(analysis);
}

/**
 * 渲染八字分析结果
 */
function renderBaziResult(analysis) {
    const resultContainer = document.getElementById('baziResult');
    const emptyContainer = document.getElementById('baziEmpty');
    
    resultContainer.style.display = 'block';
    emptyContainer.style.display = 'none';
    
    // 八字四柱
    const baziDisplayEl = document.getElementById('baziDisplay');
    const pillars = [
        { key: 'year', label: '年柱' },
        { key: 'month', label: '月柱' },
        { key: 'day', label: '日柱' },
        { key: 'hour', label: '时柱' }
    ];
    
    baziDisplayEl.innerHTML = pillars.map(p => {
        const pillar = analysis.baZi[p.key];
        return `
            <div class="bazi-pillar">
                <div class="pillar-label">${p.label}</div>
                <div class="pillar-gan">${pillar.gan}</div>
                <div class="pillar-zhi">${pillar.zhi}</div>
                <div class="pillar-wuxing">
                    ${BaZiCalculator.tianGanWuXing[pillar.gan]} · 
                    ${BaZiCalculator.diZhiWuXing[pillar.zhi]}
                </div>
            </div>
        `;
    }).join('');
    
    // 生肖
    document.getElementById('shengxiao').textContent = `生肖属${analysis.shengXiao}`;
    
    // 五行分布图表
    renderWuxingChart(analysis.wuXing.distribution);
    
    // 五行分析
    const wuxingAnalysisEl = document.getElementById('wuxingAnalysis');
    const wuXingEntries = Object.entries(analysis.wuXing.distribution)
        .sort((a, b) => b[1] - a[1]);
    const dominant = wuXingEntries[0];
    const weakest = wuXingEntries[wuXingEntries.length - 1];
    
    wuxingAnalysisEl.innerHTML = `
        <p><strong>五行强弱：</strong>以${dominant[0]}最旺(${dominant[1]}分)，${weakest[0]}最弱(${weakest[1]}分)</p>
        <p style="margin-top: 8px;">${getWuxingComment(analysis.wuXing.distribution)}</p>
    `;
    
    // 日主分析
    const dayMasterEl = document.getElementById('dayMasterAnalysis');
    dayMasterEl.innerHTML = `
        <div class="analysis-item">
            <h4>日主信息</h4>
            <p>日主为<strong style="color: var(--gold-primary);">${analysis.dayMaster.dayGan}${analysis.dayMaster.dayWuXing}</strong></p>
            <p style="margin-top: 8px;">代表您自己的五行属性</p>
        </div>
        <div class="analysis-item">
            <h4>身强身弱</h4>
            <p><strong style="color: var(--gold-primary);">${analysis.dayMaster.strength}</strong></p>
            <p style="margin-top: 8px;">${analysis.dayMaster.seasonSupport ? '得月令生助' : '不得月令生助'}</p>
        </div>
    `;
    
    // 喜用神分析
    const xiyongshenEl = document.getElementById('xiyongshenAnalysis');
    xiyongshenEl.innerHTML = `
        <div class="analysis-item">
            <h4>喜用神</h4>
            <p style="color: var(--wuxing-wood);">${analysis.xiYongShen.xiYongShen.join('、') || '平和'}</p>
            <p style="margin-top: 8px;">对您有利的五行，起名时宜用</p>
        </div>
        <div class="analysis-item">
            <h4>忌神</h4>
            <p style="color: var(--accent-red);">${analysis.xiYongShen.jiShen.join('、') || '无'}</p>
            <p style="margin-top: 8px;">对您不利的五行，起名时宜避</p>
        </div>
    `;
    
    // 性格分析
    document.getElementById('personalityAnalysis').textContent = analysis.personality;
}

/**
 * 渲染五行图表
 */
function renderWuxingChart(distribution) {
    const chartEl = document.getElementById('wuxingChart');
    const maxValue = Math.max(...Object.values(distribution)) || 1;
    
    const wuxingNames = {
        '金': { label: '金', class: 'metal' },
        '木': { label: '木', class: 'wood' },
        '水': { label: '水', class: 'water' },
        '火': { label: '火', class: 'fire' },
        '土': { label: '土', class: 'earth' }
    };
    
    chartEl.innerHTML = Object.entries(distribution).map(([wx, count]) => {
        const height = Math.max(15, (count / maxValue) * 100);
        const info = wuxingNames[wx];
        return `
            <div class="wuxing-item">
                <div class="wuxing-bar" style="height: ${height}px;" data-value="${count.toFixed(1)}"></div>
                <div class="wuxing-label ${info.class}">${info.label}</div>
            </div>
        `;
    }).join('');
}

/**
 * 获取评分评语
 */
function getScoreComment(score) {
    if (score >= 90) return '大吉之名，五行相生，寓意深远';
    if (score >= 80) return '吉名，五行调和，利于发展';
    if (score >= 70) return '中平之名，略有不足，整体尚可';
    if (score >= 60) return '名字一般，建议斟酌';
    return '名字欠佳，建议重新考虑';
}

/**
 * 获取三才评语
 */
function getSancaiComment(sanCai) {
    const comments = {
        '金金金': '三才皆金，过于刚硬，宜柔化',
        '木木木': '三才皆木，过于偏执，宜调和',
        '水水水': '三才皆水，过于流动，宜稳定',
        '火火火': '三才皆火，过于急躁，宜冷静',
        '土土土': '三才皆土，过于固执，宜变通'
    };
    
    const key = sanCai.tian + sanCai.ren + sanCai.di;
    return comments[key] || '三才配置平和，运势稳定';
}

/**
 * 获取五行评语
 */
function getWuxingComment(distribution) {
    const entries = Object.entries(distribution);
    const hasZero = entries.some(([_, count]) => count === 0);
    const allPresent = entries.every(([_, count]) => count > 0);
    
    if (allPresent) {
        return '五行齐全，命理平衡，一生顺遂';
    } else if (hasZero) {
        const missing = entries.filter(([_, count]) => count === 0).map(([wx, _]) => wx);
        return `五行缺${missing.join('、')}，建议通过名字补足`;
    }
    return '五行基本平衡，略有偏颇';
}

/**
 * 工具函数：防抖
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * 工具函数：节流
 */
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

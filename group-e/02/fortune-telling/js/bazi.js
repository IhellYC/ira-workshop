/**
 * 八字计算核心算法
 * 包含：阳历转农历、四柱计算、五行分析、喜用神判断
 */

const BaZiCalculator = {
    // 天干
    tianGan: ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'],
    
    // 地支
    diZhi: ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'],
    
    // 天干五行属性
    tianGanWuXing: {
        '甲': '木', '乙': '木',
        '丙': '火', '丁': '火',
        '戊': '土', '己': '土',
        '庚': '金', '辛': '金',
        '壬': '水', '癸': '水'
    },
    
    // 地支五行属性
    diZhiWuXing: {
        '子': '水', '丑': '土', '寅': '木', '卯': '木',
        '辰': '土', '巳': '火', '午': '火', '未': '土',
        '申': '金', '酉': '金', '戌': '土', '亥': '水'
    },
    
    // 地支藏干
    diZhiCangGan: {
        '子': ['癸'],
        '丑': ['己', '癸', '辛'],
        '寅': ['甲', '丙', '戊'],
        '卯': ['乙'],
        '辰': ['戊', '乙', '癸'],
        '巳': ['丙', '庚', '戊'],
        '午': ['丁', '己'],
        '未': ['己', '丁', '乙'],
        '申': ['庚', '壬', '戊'],
        '酉': ['辛'],
        '戌': ['戊', '辛', '丁'],
        '亥': ['壬', '甲']
    },
    
    // 生肖
    shengXiao: ['鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪'],
    
    // 农历月份对应地支
    monthToDiZhi: ['寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥', '子', '丑'],
    
    // 时辰对应地支
    hourToDiZhi: [
        '子', '丑', '丑', '寅', '寅', '卯', '卯', '辰', '辰', '巳', '巳', '午',
        '午', '未', '未', '申', '申', '酉', '酉', '戌', '戌', '亥', '亥', '子'
    ],

    /**
     * 阳历转农历（简化版，使用近似算法）
     * 实际应用中建议使用完整的农历库
     */
    solarToLunar(year, month, day) {
        // 基准日期：1900年1月31日为农历1900年正月初一
        const baseDate = new Date(1900, 0, 31);
        const targetDate = new Date(year, month - 1, day);
        const offset = Math.floor((targetDate - baseDate) / 86400000);
        
        // 简化的农历计算（实际应用需要完整的农历数据）
        // 这里使用近似算法
        let lunarYear = year;
        let lunarMonth = month;
        let lunarDay = day;
        
        // 简单的偏移调整（不够精确，仅作演示）
        const yearOffset = year - 1900;
        const approxDays = yearOffset * 354 + Math.floor(yearOffset / 4) * 11;
        
        // 返回近似值
        return {
            year: lunarYear,
            month: lunarMonth,
            day: lunarDay,
            isLeap: false
        };
    },

    /**
     * 计算年柱
     */
    calculateYearPillar(year) {
        // 年干 = (年份 - 3) % 10
        const ganIndex = (year - 4) % 10;
        // 年支 = (年份 - 3) % 12
        const zhiIndex = (year - 4) % 12;
        
        return {
            gan: this.tianGan[ganIndex],
            zhi: this.diZhi[zhiIndex],
            shengXiao: this.shengXiao[zhiIndex]
        };
    },

    /**
     * 计算月柱
     */
    calculateMonthPillar(year, month) {
        const yearPillar = this.calculateYearPillar(year);
        const yearGan = yearPillar.gan;
        
        // 根据年干确定月干起始
        let startGanIndex;
        const yearGanIndex = this.tianGan.indexOf(yearGan);
        
        // 年上起月法
        if (yearGanIndex === 0 || yearGanIndex === 5) startGanIndex = 2; // 甲己之年丙作首
        else if (yearGanIndex === 1 || yearGanIndex === 6) startGanIndex = 4; // 乙庚之岁戊为头
        else if (yearGanIndex === 2 || yearGanIndex === 7) startGanIndex = 6; // 丙辛之岁寻庚上
        else if (yearGanIndex === 3 || yearGanIndex === 8) startGanIndex = 8; // 丁壬壬位顺行流
        else startGanIndex = 0; // 戊癸之年何方发，甲寅之上好追求
        
        const ganIndex = (startGanIndex + month - 1) % 10;
        const zhiIndex = (month + 1) % 12; // 正月建寅
        
        return {
            gan: this.tianGan[ganIndex],
            zhi: this.diZhi[zhiIndex]
        };
    },

    /**
     * 计算日柱（简化版）
     * 实际应用需要完整的日柱表
     */
    calculateDayPillar(year, month, day) {
        // 使用蔡勒公式或类似方法计算
        // 简化版：基于1900-01-01为基准
        const baseDate = new Date(1900, 0, 1);
        const targetDate = new Date(year, month - 1, day);
        const offset = Math.floor((targetDate - baseDate) / 86400000);
        
        const ganIndex = (offset + 0) % 10; // 1900-01-01是甲日
        const zhiIndex = (offset + 0) % 12;
        
        return {
            gan: this.tianGan[ganIndex],
            zhi: this.diZhi[zhiIndex]
        };
    },

    /**
     * 计算时柱
     */
    calculateHourPillar(dayGan, hour) {
        // 日上起时法
        let startGanIndex;
        const dayGanIndex = this.tianGan.indexOf(dayGan);
        
        if (dayGanIndex === 0 || dayGanIndex === 5) startGanIndex = 0; // 甲己还加甲
        else if (dayGanIndex === 1 || dayGanIndex === 6) startGanIndex = 2; // 乙庚丙作初
        else if (dayGanIndex === 2 || dayGanIndex === 7) startGanIndex = 4; // 丙辛从戊起
        else if (dayGanIndex === 3 || dayGanIndex === 8) startGanIndex = 6; // 丁壬庚子居
        else startGanIndex = 8; // 戊癸何方发，壬子是真途
        
        const zhiIndex = Math.floor((hour + 1) / 2) % 12;
        const ganIndex = (startGanIndex + zhiIndex) % 10;
        
        return {
            gan: this.tianGan[ganIndex],
            zhi: this.diZhi[zhiIndex]
        };
    },

    /**
     * 计算完整八字
     */
    calculateBaZi(year, month, day, hour) {
        const yearPillar = this.calculateYearPillar(year);
        const monthPillar = this.calculateMonthPillar(year, month);
        const dayPillar = this.calculateDayPillar(year, month, day);
        const hourPillar = this.calculateHourPillar(dayPillar.gan, hour);
        
        return {
            year: yearPillar,
            month: monthPillar,
            day: dayPillar,
            hour: hourPillar
        };
    },

    /**
     * 分析五行分布
     */
    analyzeWuXing(baZi) {
        const wuXing = { '金': 0, '木': 0, '水': 0, '火': 0, '土': 0 };
        const details = [];
        
        const pillars = ['year', 'month', 'day', 'hour'];
        const names = ['年柱', '月柱', '日柱', '时柱'];
        
        pillars.forEach((pillar, index) => {
            const p = baZi[pillar];
            const ganWuXing = this.tianGanWuXing[p.gan];
            const zhiWuXing = this.diZhiWuXing[p.zhi];
            
            wuXing[ganWuXing]++;
            wuXing[zhiWuXing]++;
            
            // 地支藏干
            const cangGan = this.diZhiCangGan[p.zhi] || [];
            cangGan.forEach(gan => {
                wuXing[this.tianGanWuXing[gan]] += 0.5;
            });
            
            details.push({
                pillar: names[index],
                gan: p.gan,
                zhi: p.zhi,
                ganWuXing: ganWuXing,
                zhiWuXing: zhiWuXing,
                cangGan: cangGan
            });
        });
        
        return { distribution: wuXing, details: details };
    },

    /**
     * 判断日主强弱
     */
    analyzeDayMasterStrength(baZi, wuXingDist) {
        const dayGan = baZi.day.gan;
        const dayWuXing = this.tianGanWuXing[dayGan];
        
        // 简化的判断逻辑
        const seasonSupport = this.getSeasonSupport(baZi.month.zhi, dayWuXing);
        const sameElement = wuXingDist[dayWuXing];
        
        let strength = '中和';
        if (sameElement >= 3 && seasonSupport) {
            strength = '身强';
        } else if (sameElement <= 1 && !seasonSupport) {
            strength = '身弱';
        }
        
        return {
            dayGan: dayGan,
            dayWuXing: dayWuXing,
            strength: strength,
            seasonSupport: seasonSupport
        };
    },

    /**
     * 判断季节对五行的支持
     */
    getSeasonSupport(monthZhi, wuXing) {
        const seasonMap = {
            '寅': { strong: '木', weak: '金' },
            '卯': { strong: '木', weak: '金' },
            '辰': { strong: '土', weak: '水' },
            '巳': { strong: '火', weak: '水' },
            '午': { strong: '火', weak: '水' },
            '未': { strong: '土', weak: '木' },
            '申': { strong: '金', weak: '火' },
            '酉': { strong: '金', weak: '火' },
            '戌': { strong: '土', weak: '木' },
            '亥': { strong: '水', weak: '土' },
            '子': { strong: '水', weak: '土' },
            '丑': { strong: '土', weak: '火' }
        };
        
        const season = seasonMap[monthZhi];
        if (!season) return false;
        
        return season.strong === wuXing;
    },

    /**
     * 分析喜用神
     */
    analyzeXiYongShen(baZi, wuXingDist, dayMaster) {
        const xiYong = [];
        const jiShen = [];
        
        // 根据日主强弱判断
        if (dayMaster.strength === '身强') {
            // 身强喜克泄耗
            const ke = this.getKe(dayMaster.dayWuXing);
            const xie = this.getXie(dayMaster.dayWuXing);
            const hao = this.getHao(dayMaster.dayWuXing);
            
            xiYong.push(ke, xie, hao);
            jiShen.push(dayMaster.dayWuXing, this.getSheng(dayMaster.dayWuXing));
        } else if (dayMaster.strength === '身弱') {
            // 身弱喜生扶
            const sheng = this.getSheng(dayMaster.dayWuXing);
            const fu = dayMaster.dayWuXing;
            
            xiYong.push(sheng, fu);
            jiShen.push(this.getKe(dayMaster.dayWuXing), this.getXie(dayMaster.dayWuXing));
        } else {
            // 中和，根据具体组合判断
            const minWuXing = Object.entries(wuXingDist)
                .sort((a, b) => a[1] - b[1])[0][0];
            xiYong.push(minWuXing);
        }
        
        return {
            xiYongShen: [...new Set(xiYong)],
            jiShen: [...new Set(jiShen)]
        };
    },

    /**
     * 五行相生
     */
    getSheng(wuXing) {
        const shengMap = {
            '金': '水', '水': '木', '木': '火',
            '火': '土', '土': '金'
        };
        return shengMap[wuXing];
    },

    /**
     * 五行相克
     */
    getKe(wuXing) {
        const keMap = {
            '金': '木', '木': '土', '土': '水',
            '水': '火', '火': '金'
        };
        return keMap[wuXing];
    },

    /**
     * 我生者（泄）
     */
    getXie(wuXing) {
        const xieMap = {
            '金': '水', '水': '木', '木': '火',
            '火': '土', '土': '金'
        };
        return xieMap[wuXing];
    },

    /**
     * 我克者（耗）
     */
    getHao(wuXing) {
        const haoMap = {
            '金': '木', '木': '土', '土': '水',
            '水': '火', '火': '金'
        };
        return haoMap[wuXing];
    },

    /**
     * 性格分析
     */
    analyzePersonality(dayGan) {
        const personalityMap = {
            '甲': '仁慈正直，有领导力，积极向上，但有时过于固执',
            '乙': '温和柔顺，善于变通，有艺术气质，但容易优柔寡断',
            '丙': '热情开朗，光明磊落，有创造力，但容易急躁冲动',
            '丁': '温和内敛，心思细腻，有洞察力，但容易多愁善感',
            '戊': '诚实稳重，有责任感，踏实肯干，但容易固执保守',
            '己': '包容宽厚，善于协调，有耐心，但容易优柔寡断',
            '庚': '刚毅果断，有正义感，讲义气，但容易刚愎自用',
            '辛': '精致细腻，有品位，善于表达，但容易虚荣心强',
            '壬': '聪明机智，善于应变，有包容心，但容易情绪化',
            '癸': '温柔内敛，有智慧，善于思考，但容易多愁善感'
        };
        
        return personalityMap[dayGan] || '性格平和，待人友善';
    },

    /**
     * 完整分析
     */
    fullAnalysis(year, month, day, hour) {
        const baZi = this.calculateBaZi(year, month, day, hour);
        const wuXing = this.analyzeWuXing(baZi);
        const dayMaster = this.analyzeDayMasterStrength(baZi, wuXing.distribution);
        const xiYongShen = this.analyzeXiYongShen(baZi, wuXing.distribution, dayMaster);
        const personality = this.analyzePersonality(baZi.day.gan);
        
        return {
            baZi: baZi,
            wuXing: wuXing,
            dayMaster: dayMaster,
            xiYongShen: xiYongShen,
            personality: personality,
            shengXiao: baZi.year.shengXiao
        };
    }
};

// 导出模块
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BaZiCalculator;
}

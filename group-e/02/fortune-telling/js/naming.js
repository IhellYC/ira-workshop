/**
 * 起名算法模块
 * 根据姓氏、性别、出生信息生成推荐名字
 */

const NamingEngine = {
    /**
     * 生成推荐名字
     * @param {string} surname - 姓氏
     * @param {string} gender - 性别 ('男' 或 '女')
     * @param {Object} birthInfo - 出生信息 {year, month, day, hour}
     * @param {number} count - 生成数量
     */
    generateNames(surname, gender, birthInfo, count = 8) {
        const names = [];
        
        // 1. 分析八字五行
        const baZi = BaZiCalculator.fullAnalysis(
            birthInfo.year, 
            birthInfo.month, 
            birthInfo.day, 
            birthInfo.hour
        );
        
        // 2. 确定喜用神（需要补充的五行）
        const neededWuXing = baZi.xiYongShen.xiYongShen;
        
        // 3. 获取姓氏笔画
        const surnameInfo = CharacterDatabase.calculateStrokes(surname);
        
        // 4. 生成单字名
        const singleCharNames = this.generateSingleCharNames(
            surname, gender, neededWuXing, count / 2
        );
        names.push(...singleCharNames);
        
        // 5. 生成双字名
        const doubleCharNames = this.generateDoubleCharNames(
            surname, gender, neededWuXing, count / 2
        );
        names.push(...doubleCharNames);
        
        // 6. 评分排序
        names.forEach(name => {
            name.score = this.calculateNameScore(name, baZi);
        });
        
        return names.sort((a, b) => b.score - a.score);
    },

    /**
     * 生成单字名
     */
    generateSingleCharNames(surname, gender, neededWuXing, count) {
        const names = [];
        const candidates = this.getNameCandidates(gender, neededWuXing, 'single');
        
        for (let i = 0; i < Math.min(count, candidates.length); i++) {
            const char = candidates[i];
            const charInfo = CharacterDatabase.getCharacterInfo(char);
            
            names.push({
                name: surname + char,
                givenName: char,
                type: '单字名',
                wuXing: charInfo ? charInfo.wuXing : '未知',
                meaning: charInfo ? charInfo.meaning : '',
                strokes: charInfo ? charInfo.strokes : 0,
                pinyin: charInfo ? charInfo.pinyin : ''
            });
        }
        
        return names;
    },

    /**
     * 生成双字名
     */
    generateDoubleCharNames(surname, gender, neededWuXing, count) {
        const names = [];
        const combinations = CharacterDatabase.getAuspiciousCombinations(
            gender === '女' ? '女孩' : '男孩'
        );
        
        // 使用吉祥组合
        for (let i = 0; i < Math.min(count / 2, combinations.length); i++) {
            const combo = combinations[i];
            const name = surname + combo.chars.join('');
            const strokes = combo.chars.reduce((sum, c) => {
                const info = CharacterDatabase.getCharacterInfo(c);
                return sum + (info ? info.strokes : 8);
            }, 0);
            
            names.push({
                name: name,
                givenName: combo.chars.join(''),
                type: '双字名',
                wuXing: this.getCombinationWuXing(combo.chars),
                meaning: combo.meaning,
                strokes: strokes,
                pinyin: this.getCombinationPinyin(combo.chars)
            });
        }
        
        // 根据喜用神生成组合
        const wuXingChars = neededWuXing.slice(0, 2);
        if (wuXingChars.length >= 2) {
            const chars1 = CharacterDatabase.getCharactersByWuXing(wuXingChars[0], 5);
            const chars2 = CharacterDatabase.getCharactersByWuXing(wuXingChars[1], 5);
            
            for (let i = 0; i < Math.min(3, chars1.length); i++) {
                for (let j = 0; j < Math.min(2, chars2.length); j++) {
                    if (names.length >= count) break;
                    
                    const char1 = chars1[i];
                    const char2 = chars2[j];
                    const name = surname + char1.char + char2.char;
                    
                    names.push({
                        name: name,
                        givenName: char1.char + char2.char,
                        type: '双字名',
                        wuXing: `${char1.wuXing}+${char2.wuXing}`,
                        meaning: `${char1.meaning}；${char2.meaning}`,
                        strokes: char1.strokes + char2.strokes,
                        pinyin: `${char1.pinyin} ${char2.pinyin}`
                    });
                }
            }
        }
        
        return names;
    },

    /**
     * 获取起名候选字
     */
    getNameCandidates(gender, neededWuXing, type) {
        const candidates = [];
        
        // 根据喜用神选择五行
        neededWuXing.forEach(wx => {
            const chars = CharacterDatabase.getCharactersByWuXing(wx, 10);
            chars.forEach(c => candidates.push(c.char));
        });
        
        // 如果没有喜用神，使用通用吉祥字
        if (candidates.length === 0) {
            const defaultChars = gender === '女' 
                ? ['雅', '婷', '诗', '涵', '梦', '瑶', '雨', '萱', '欣', '怡']
                : ['文', '博', '志', '远', '俊', '杰', '浩', '然', '子', '轩'];
            candidates.push(...defaultChars);
        }
        
        // 去重并打乱顺序
        return [...new Set(candidates)].sort(() => Math.random() - 0.5);
    },

    /**
     * 获取组合五行
     */
    getCombinationWuXing(chars) {
        return chars.map(c => {
            const info = CharacterDatabase.getCharacterInfo(c);
            return info ? info.wuXing : '未知';
        }).join('+');
    },

    /**
     * 获取组合拼音
     */
    getCombinationPinyin(chars) {
        return chars.map(c => {
            const info = CharacterDatabase.getCharacterInfo(c);
            return info ? info.pinyin : '';
        }).join(' ');
    },

    /**
     * 计算名字评分
     */
    calculateNameScore(nameObj, baZi) {
        let score = 70; // 基础分
        
        // 1. 五行匹配度评分 (最高20分)
        const nameWuXing = CharacterDatabase.analyzeNameWuXing(nameObj.name);
        const xiYong = baZi.xiYongShen.xiYongShen;
        let wuXingMatch = 0;
        
        xiYong.forEach(wx => {
            if (nameWuXing.distribution[wx] > 0) {
                wuXingMatch += 10;
            }
        });
        score += Math.min(20, wuXingMatch);
        
        // 2. 三才五格评分 (最高30分)
        const surname = nameObj.name.substring(0, 1);
        const givenName = nameObj.givenName;
        const sanCaiWuGe = CharacterDatabase.calculateSanCaiWuGe(surname, givenName);
        
        // 五格吉凶判断
        const wuGeScores = this.calculateWuGeScore(sanCaiWuGe.wuGe);
        score += wuGeScores;
        
        // 3. 音韵评分 (最高10分)
        if (nameObj.pinyin) {
            const tones = this.analyzeTones(nameObj.pinyin);
            if (tones.isHarmonious) {
                score += 10;
            } else {
                score += 5;
            }
        }
        
        // 4. 寓意评分 (最高10分)
        if (nameObj.meaning && nameObj.meaning.length > 5) {
            score += 10;
        } else {
            score += 5;
        }
        
        return Math.min(100, Math.round(score));
    },

    /**
     * 计算五格评分
     */
    calculateWuGeScore(wuGe) {
        let score = 0;
        
        // 根据五格数理吉凶判断
        const numbers = [wuGe.tianGe, wuGe.renGe, wuGe.diGe, wuGe.waiGe, wuGe.zongGe];
        
        numbers.forEach(num => {
            const luck = this.getNumberLuck(num);
            if (luck === '大吉') score += 6;
            else if (luck === '吉') score += 4;
            else if (luck === '半吉') score += 2;
            else if (luck === '凶') score -= 2;
            else if (luck === '大凶') score -= 4;
        });
        
        return Math.max(0, Math.min(30, score));
    },

    /**
     * 数字吉凶判断（简化版）
     */
    getNumberLuck(num) {
        // 吉数
        const goodNumbers = [1, 3, 5, 6, 7, 8, 11, 13, 15, 16, 17, 18, 21, 23, 24, 25, 31, 32, 35, 37, 39, 41, 45, 47, 48, 52, 57, 61, 63, 65, 67, 68, 81];
        const badNumbers = [2, 4, 9, 10, 12, 14, 19, 20, 22, 26, 27, 28, 29, 30, 34, 36, 38, 40, 42, 43, 44, 46, 49, 50, 51, 53, 54, 55, 56, 58, 59, 60, 62, 64, 66, 69, 70, 72, 74, 76, 79];
        
        if (goodNumbers.includes(num)) return '吉';
        if (badNumbers.includes(num)) return '凶';
        return '半吉';
    },

    /**
     * 分析音韵和谐度
     */
    analyzeTones(pinyin) {
        // 简化版：检查是否有重复的声母或韵母
        const syllables = pinyin.split(' ').filter(s => s);
        const initials = syllables.map(s => s[0]);
        const hasDuplicateInitial = new Set(initials).size !== initials.length;
        
        return {
            isHarmonious: !hasDuplicateInitial,
            syllables: syllables.length
        };
    },

    /**
     * 拆解名字分析
     */
    analyzeName(name) {
        const result = {
            chars: [],
            totalStrokes: 0,
            wuXing: { '金': 0, '木': 0, '水': 0, '火': 0, '土': 0 },
            sanCaiWuGe: null
        };
        
        // 逐字分析
        for (let i = 0; i < name.length; i++) {
            const char = name[i];
            const info = CharacterDatabase.getCharacterInfo(char);
            
            if (info) {
                result.chars.push({
                    char: char,
                    pinyin: info.pinyin,
                    strokes: info.strokes,
                    wuXing: info.wuXing,
                    meaning: info.meaning,
                    position: i === 0 ? '姓' : '名'
                });
                result.totalStrokes += info.strokes;
                result.wuXing[info.wuXing]++;
            } else {
                result.chars.push({
                    char: char,
                    pinyin: '未知',
                    strokes: 8,
                    wuXing: '未知',
                    meaning: '暂无释义',
                    position: i === 0 ? '姓' : '名'
                });
                result.totalStrokes += 8;
            }
        }
        
        // 三才五格分析
        if (name.length >= 2) {
            const surname = name[0];
            const givenName = name.substring(1);
            result.sanCaiWuGe = CharacterDatabase.calculateSanCaiWuGe(surname, givenName);
        }
        
        // 五行缺失分析
        result.wuXingMissing = [];
        for (const [wx, count] of Object.entries(result.wuXing)) {
            if (count === 0) {
                result.wuXingMissing.push(wx);
            }
        }
        
        // 综合评分
        result.overallScore = this.calculateOverallScore(result);
        
        return result;
    },

    /**
     * 计算综合评分
     */
    calculateOverallScore(analysis) {
        let score = 70;
        
        // 五行平衡度
        const wuXingValues = Object.values(analysis.wuXing);
        const max = Math.max(...wuXingValues);
        const min = Math.min(...wuXingValues.filter(v => v > 0));
        if (max - min <= 1) score += 10;
        else if (max - min <= 2) score += 5;
        
        // 笔画数适中
        if (analysis.totalStrokes >= 15 && analysis.totalStrokes <= 35) {
            score += 10;
        }
        
        // 三才配置
        if (analysis.sanCaiWuGe) {
            const sanCai = analysis.sanCaiWuGe.sanCai;
            // 检查三才是否相生
            if (this.isSanCaiXiangSheng(sanCai)) {
                score += 10;
            }
        }
        
        return Math.min(100, score);
    },

    /**
     * 判断三才是否相生
     */
    isSanCaiXiangSheng(sanCai) {
        const shengMap = {
            '金': '水', '水': '木', '木': '火',
            '火': '土', '土': '金'
        };
        
        // 天格生人格 或 人格生地格 为吉
        return shengMap[sanCai.tian] === sanCai.ren || 
               shengMap[sanCai.ren] === sanCai.di;
    }
};

// 导出模块
if (typeof module !== 'undefined' && module.exports) {
    module.exports = NamingEngine;
}

/**
 * 汉字五行数据库
 * 包含常用汉字的五行属性、笔画数、含义等信息
 */

const CharacterDatabase = {
    // 五行属性映射
    wuXing: {
        METAL: '金',
        WOOD: '木',
        WATER: '水',
        FIRE: '火',
        EARTH: '土'
    },

    // 常用汉字数据库
    // 格式: 字: { pinyin, strokes, wuXing, meaning, isNameChar }
    characters: {
        // 金属性常用字
        '金': { pinyin: 'jīn', strokes: 8, wuXing: '金', meaning: '贵金属，象征财富、尊贵', isNameChar: true },
        '银': { pinyin: 'yín', strokes: 11, wuXing: '金', meaning: '白银，纯洁、高贵', isNameChar: true },
        '钰': { pinyin: 'yù', strokes: 10, wuXing: '金', meaning: '珍宝，珍贵、美好', isNameChar: true },
        '铭': { pinyin: 'míng', strokes: 11, wuXing: '金', meaning: '铭记，深刻、永恒', isNameChar: true },
        '锐': { pinyin: 'ruì', strokes: 12, wuXing: '金', meaning: '锐利，敏锐、进取', isNameChar: true },
        '锋': { pinyin: 'fēng', strokes: 12, wuXing: '金', meaning: '锋芒，锐利、领先', isNameChar: true },
        '钢': { pinyin: 'gāng', strokes: 9, wuXing: '金', meaning: '钢铁，坚强、刚毅', isNameChar: true },
        '铮': { pinyin: 'zhēng', strokes: 11, wuXing: '金', meaning: '铮铮铁骨，刚正不阿', isNameChar: true },
        '锦': { pinyin: 'jǐn', strokes: 16, wuXing: '金', meaning: '锦绣，美好、华丽', isNameChar: true },
        '鑫': { pinyin: 'xīn', strokes: 24, wuXing: '金', meaning: '三金，财富兴盛', isNameChar: true },
        '钟': { pinyin: 'zhōng', strokes: 12, wuXing: '金', meaning: '钟爱，专注、集中', isNameChar: true },
        '钦': { pinyin: 'qīn', strokes: 9, wuXing: '金', meaning: '钦佩，尊敬、仰慕', isNameChar: true },
        '钧': { pinyin: 'jūn', strokes: 9, wuXing: '金', meaning: '千钧，稳重、公正', isNameChar: true },
        '铎': { pinyin: 'duó', strokes: 10, wuXing: '金', meaning: '大铃，警醒、传播', isNameChar: true },
        '锡': { pinyin: 'xī', strokes: 13, wuXing: '金', meaning: '赐予，恩惠、福泽', isNameChar: true },

        // 木属性常用字
        '木': { pinyin: 'mù', strokes: 4, wuXing: '木', meaning: '树木，生机、成长', isNameChar: true },
        '林': { pinyin: 'lín', strokes: 8, wuXing: '木', meaning: '树林，茂盛、繁荣', isNameChar: true },
        '森': { pinyin: 'sēn', strokes: 12, wuXing: '木', meaning: '森林，生机勃勃', isNameChar: true },
        '松': { pinyin: 'sōng', strokes: 8, wuXing: '木', meaning: '松树，坚韧、长寿', isNameChar: true },
        '柏': { pinyin: 'bǎi', strokes: 9, wuXing: '木', meaning: '柏树，长青、坚贞', isNameChar: true },
        '桂': { pinyin: 'guì', strokes: 10, wuXing: '木', meaning: '桂花，高贵、芬芳', isNameChar: true },
        '梅': { pinyin: 'méi', strokes: 11, wuXing: '木', meaning: '梅花，坚强、高洁', isNameChar: true },
        '竹': { pinyin: 'zhú', strokes: 6, wuXing: '木', meaning: '竹子，正直、虚心', isNameChar: true },
        '柳': { pinyin: 'liǔ', strokes: 9, wuXing: '木', meaning: '柳树，柔美、依依', isNameChar: true },
        '桐': { pinyin: 'tóng', strokes: 10, wuXing: '木', meaning: '梧桐，高贵、吉祥', isNameChar: true },
        '楠': { pinyin: 'nán', strokes: 13, wuXing: '木', meaning: '楠木，珍贵、坚固', isNameChar: true },
        '梓': { pinyin: 'zǐ', strokes: 11, wuXing: '木', meaning: '梓树，故乡、栋梁', isNameChar: true },
        '棋': { pinyin: 'qí', strokes: 12, wuXing: '木', meaning: '棋艺，智慧、谋略', isNameChar: true },
        '桥': { pinyin: 'qiáo', strokes: 10, wuXing: '木', meaning: '桥梁，沟通、连接', isNameChar: true },
        '栋': { pinyin: 'dòng', strokes: 9, wuXing: '木', meaning: '栋梁，支柱、担当', isNameChar: true },
        '荣': { pinyin: 'róng', strokes: 9, wuXing: '木', meaning: '荣耀，兴盛、光荣', isNameChar: true },
        '华': { pinyin: 'huá', strokes: 6, wuXing: '木', meaning: '华丽，光彩、精华', isNameChar: true },
        '英': { pinyin: 'yīng', strokes: 8, wuXing: '木', meaning: '英才，杰出、精英', isNameChar: true },
        '萌': { pinyin: 'méng', strokes: 11, wuXing: '木', meaning: '萌芽，新生、希望', isNameChar: true },
        '芊': { pinyin: 'qiān', strokes: 6, wuXing: '木', meaning: '草木茂盛，生机盎然', isNameChar: true },

        // 水属性常用字
        '水': { pinyin: 'shuǐ', strokes: 4, wuXing: '水', meaning: '水流，智慧、灵动', isNameChar: true },
        '海': { pinyin: 'hǎi', strokes: 10, wuXing: '水', meaning: '大海，宽广、包容', isNameChar: true },
        '江': { pinyin: 'jiāng', strokes: 6, wuXing: '水', meaning: '江河，源远流长', isNameChar: true },
        '河': { pinyin: 'hé', strokes: 8, wuXing: '水', meaning: '河流，流动、生机', isNameChar: true },
        '湖': { pinyin: 'hú', strokes: 12, wuXing: '水', meaning: '湖泊，宁静、深邃', isNameChar: true },
        '波': { pinyin: 'bō', strokes: 8, wuXing: '水', meaning: '波浪，起伏、活力', isNameChar: true },
        '涛': { pinyin: 'tāo', strokes: 10, wuXing: '水', meaning: '波涛，气势、力量', isNameChar: true },
        '清': { pinyin: 'qīng', strokes: 11, wuXing: '水', meaning: '清澈，纯净、高洁', isNameChar: true },
        '源': { pinyin: 'yuán', strokes: 13, wuXing: '水', meaning: '源头，根本、起源', isNameChar: true },
        '涵': { pinyin: 'hán', strokes: 11, wuXing: '水', meaning: '涵养，包容、修养', isNameChar: true },
        '沐': { pinyin: 'mù', strokes: 7, wuXing: '水', meaning: '沐浴，洗涤、恩泽', isNameChar: true },
        '泽': { pinyin: 'zé', strokes: 8, wuXing: '水', meaning: '恩泽，恩惠、润泽', isNameChar: true },
        '洋': { pinyin: 'yáng', strokes: 9, wuXing: '水', meaning: '海洋，广阔、盛大', isNameChar: true },
        '溪': { pinyin: 'xī', strokes: 13, wuXing: '水', meaning: '小溪，清澈、灵动', isNameChar: true },
        '润': { pinyin: 'rùn', strokes: 10, wuXing: '水', meaning: '滋润，润泽、利益', isNameChar: true },
        '浩': { pinyin: 'hào', strokes: 10, wuXing: '水', meaning: '浩大，广阔、盛大', isNameChar: true },
        '淼': { pinyin: 'miǎo', strokes: 12, wuXing: '水', meaning: '水广大，浩瀚无边', isNameChar: true },
        '冰': { pinyin: 'bīng', strokes: 6, wuXing: '水', meaning: '冰雪，纯洁、坚强', isNameChar: true },
        '洁': { pinyin: 'jié', strokes: 9, wuXing: '水', meaning: '洁净，纯洁、清白', isNameChar: true },
        '淑': { pinyin: 'shū', strokes: 11, wuXing: '水', meaning: '淑女，善良、美好', isNameChar: true },

        // 火属性常用字
        '火': { pinyin: 'huǒ', strokes: 4, wuXing: '火', meaning: '火焰，热情、光明', isNameChar: true },
        '炎': { pinyin: 'yán', strokes: 8, wuXing: '火', meaning: '炎热，热情、兴盛', isNameChar: true },
        '焱': { pinyin: 'yàn', strokes: 12, wuXing: '火', meaning: '火焰，光明、灿烂', isNameChar: true },
        '煜': { pinyin: 'yù', strokes: 13, wuXing: '火', meaning: '照耀，光明、辉煌', isNameChar: true },
        '炜': { pinyin: 'wěi', strokes: 8, wuXing: '火', meaning: '光明，灿烂、辉煌', isNameChar: true },
        '炫': { pinyin: 'xuàn', strokes: 9, wuXing: '火', meaning: '炫耀，光彩、夺目', isNameChar: true },
        '焕': { pinyin: 'huàn', strokes: 11, wuXing: '火', meaning: '焕发，光彩、振作', isNameChar: true },
        '灿': { pinyin: 'càn', strokes: 7, wuXing: '火', meaning: '灿烂，光彩、鲜明', isNameChar: true },
        '烁': { pinyin: 'shuò', strokes: 9, wuXing: '火', meaning: '闪烁，光亮、灵动', isNameChar: true },
        '熙': { pinyin: 'xī', strokes: 14, wuXing: '火', meaning: '光明，兴盛、和乐', isNameChar: true },
        '照': { pinyin: 'zhào', strokes: 13, wuXing: '火', meaning: '照耀，光明、关怀', isNameChar: true },
        '灵': { pinyin: 'líng', strokes: 7, wuXing: '火', meaning: '灵动，聪明、神灵', isNameChar: true },
        '烟': { pinyin: 'yān', strokes: 10, wuXing: '火', meaning: '烟雾，朦胧、诗意', isNameChar: true },
        '烨': { pinyin: 'yè', strokes: 10, wuXing: '火', meaning: '火光，光辉、灿烂', isNameChar: true },
        '晴': { pinyin: 'qíng', strokes: 12, wuXing: '火', meaning: '晴朗，明朗、开朗', isNameChar: true },
        '晶': { pinyin: 'jīng', strokes: 12, wuXing: '火', meaning: '晶莹，明亮、纯洁', isNameChar: true },
        '曦': { pinyin: 'xī', strokes: 20, wuXing: '火', meaning: '晨曦，阳光、希望', isNameChar: true },
        '昭': { pinyin: 'zhāo', strokes: 9, wuXing: '火', meaning: '昭示，明亮、明显', isNameChar: true },
        '昕': { pinyin: 'xīn', strokes: 8, wuXing: '火', meaning: '昕旦，黎明、希望', isNameChar: true },
        '昱': { pinyin: 'yù', strokes: 9, wuXing: '火', meaning: '日光，光明、照耀', isNameChar: true },

        // 土属性常用字
        '土': { pinyin: 'tǔ', strokes: 3, wuXing: '土', meaning: '土地，稳重、踏实', isNameChar: true },
        '山': { pinyin: 'shān', strokes: 3, wuXing: '土', meaning: '山峰，稳重、高大', isNameChar: true },
        '石': { pinyin: 'shí', strokes: 5, wuXing: '土', meaning: '石头，坚定、坚强', isNameChar: true },
        '岩': { pinyin: 'yán', strokes: 8, wuXing: '土', meaning: '岩石，坚定、稳重', isNameChar: true },
        '峰': { pinyin: 'fēng', strokes: 10, wuXing: '土', meaning: '山峰，高耸、杰出', isNameChar: true },
        '岳': { pinyin: 'yuè', strokes: 8, wuXing: '土', meaning: '山岳，高大、尊贵', isNameChar: true },
        '坤': { pinyin: 'kūn', strokes: 8, wuXing: '土', meaning: '大地，厚德载物', isNameChar: true },
        '城': { pinyin: 'chéng', strokes: 9, wuXing: '土', meaning: '城市，稳重、安全', isNameChar: true },
        '培': { pinyin: 'péi', strokes: 11, wuXing: '土', meaning: '培养，培育、教育', isNameChar: true },
        '基': { pinyin: 'jī', strokes: 11, wuXing: '土', meaning: '基础，根本、稳固', isNameChar: true },
        '堂': { pinyin: 'táng', strokes: 11, wuXing: '土', meaning: '殿堂，庄重、正直', isNameChar: true },
        '坤': { pinyin: 'kūn', strokes: 8, wuXing: '土', meaning: '大地，包容、厚德', isNameChar: true },
        '均': { pinyin: 'jūn', strokes: 7, wuXing: '土', meaning: '平均，公平、和谐', isNameChar: true },
        '圣': { pinyin: 'shèng', strokes: 5, wuXing: '土', meaning: '神圣，崇高、智慧', isNameChar: true },
        '玮': { pinyin: 'wěi', strokes: 8, wuXing: '土', meaning: '美玉，珍贵、美好', isNameChar: true },
        '琬': { pinyin: 'wǎn', strokes: 12, wuXing: '土', meaning: '美玉，温润、美好', isNameChar: true },
        '玥': { pinyin: 'yuè', strokes: 8, wuXing: '土', meaning: '神珠，珍贵、吉祥', isNameChar: true },
        '安': { pinyin: 'ān', strokes: 6, wuXing: '土', meaning: '平安，安定、祥和', isNameChar: true },
        '宇': { pinyin: 'yǔ', strokes: 6, wuXing: '土', meaning: '宇宙，广阔、气度', isNameChar: true },
        '辰': { pinyin: 'chén', strokes: 7, wuXing: '土', meaning: '时辰，时光、希望', isNameChar: true }
    },

    // 姓氏常用字
    commonSurnames: [
        '王', '李', '张', '刘', '陈', '杨', '黄', '赵', '吴', '周',
        '徐', '孙', '马', '朱', '胡', '郭', '何', '林', '罗', '高',
        '郑', '梁', '谢', '宋', '唐', '许', '韩', '冯', '邓', '曹',
        '彭', '曾', '肖', '田', '董', '潘', '袁', '蔡', '蒋', '余',
        '于', '杜', '叶', '程', '苏', '魏', '吕', '丁', '任', '沈'
    ],

    // 吉祥寓意字组合
    auspiciousCombinations: {
        '男孩': [
            { chars: ['文', '博'], meaning: '文采博学，学识渊博' },
            { chars: ['志', '远'], meaning: '志向远大，前程似锦' },
            { chars: ['俊', '杰'], meaning: '英俊杰出，才华横溢' },
            { chars: ['浩', '然'], meaning: '浩然正气，光明磊落' },
            { chars: ['子', '轩'], meaning: '气宇轩昂，风度翩翩' },
            { chars: ['睿', '哲'], meaning: '睿智明哲，聪慧过人' },
            { chars: ['嘉', '树'], meaning: '嘉木成林，茁壮成长' },
            { chars: ['景', '行'], meaning: '景行行止，品德高尚' }
        ],
        '女孩': [
            { chars: ['雅', '婷'], meaning: '优雅婷婷，温婉可人' },
            { chars: ['诗', '涵'], meaning: '诗情画意，涵养深厚' },
            { chars: ['梦', '瑶'], meaning: '美梦如玉，珍贵美好' },
            { chars: ['雨', '萱'], meaning: '雨润萱草，清新脱俗' },
            { chars: ['欣', '怡'], meaning: '欣欣向荣，心旷神怡' },
            { chars: ['思', '琪'], meaning: '才思敏捷，琪花瑶草' },
            { chars: ['若', '曦'], meaning: '如若晨曦，温暖明媚' },
            { chars: ['语', '嫣'], meaning: '语笑嫣然，美丽动人' }
        ]
    },

    /**
     * 根据五行获取汉字
     */
    getCharactersByWuXing(wuXing, limit = 10) {
        const result = [];
        for (const [char, info] of Object.entries(this.characters)) {
            if (info.wuXing === wuXing && info.isNameChar) {
                result.push({ char, ...info });
            }
            if (result.length >= limit) break;
        }
        return result;
    },

    /**
     * 获取汉字信息
     */
    getCharacterInfo(char) {
        return this.characters[char] || null;
    },

    /**
     * 计算姓名笔画
     */
    calculateStrokes(name) {
        let total = 0;
        const details = [];
        
        for (const char of name) {
            const info = this.getCharacterInfo(char);
            if (info) {
                total += info.strokes;
                details.push({ char, strokes: info.strokes });
            } else {
                // 默认笔画数（简化处理）
                total += 8;
                details.push({ char, strokes: 8 });
            }
        }
        
        return { total, details };
    },

    /**
     * 分析姓名五行
     */
    analyzeNameWuXing(name) {
        const wuXing = { '金': 0, '木': 0, '水': 0, '火': 0, '土': 0 };
        const details = [];
        
        for (const char of name) {
            const info = this.getCharacterInfo(char);
            if (info) {
                wuXing[info.wuXing]++;
                details.push({ char, wuXing: info.wuXing, meaning: info.meaning });
            }
        }
        
        return { distribution: wuXing, details };
    },

    /**
     * 三才五格计算
     */
    calculateSanCaiWuGe(surname, givenName) {
        const surnameStrokes = this.calculateStrokes(surname).total;
        const givenNameStrokes = this.calculateStrokes(givenName).total;
        
        // 五格计算
        const tianGe = surnameStrokes + 1; // 天格 = 姓氏笔画 + 1
        const renGe = surnameStrokes + givenNameStrokes; // 人格 = 姓 + 名首字笔画
        const diGe = givenNameStrokes + 1; // 地格 = 名字笔画 + 1
        const waiGe = tianGe + diGe - renGe; // 外格 = 天格 + 地格 - 人格
        const zongGe = surnameStrokes + givenNameStrokes; // 总格 = 姓名总笔画
        
        // 三才配置（天格、人格、地格的个位数对应五行）
        const sanCai = {
            tian: this.getWuXingByNumber(tianGe % 10),
            ren: this.getWuXingByNumber(renGe % 10),
            di: this.getWuXingByNumber(diGe % 10)
        };
        
        return {
            wuGe: { tianGe, renGe, diGe, waiGe, zongGe },
            sanCai
        };
    },

    /**
     * 数字对应五行
     */
    getWuXingByNumber(num) {
        const map = {
            1: '水', 2: '土', 3: '木', 4: '木', 5: '土',
            6: '金', 7: '金', 8: '土', 9: '火', 0: '火'
        };
        return map[num] || '土';
    },

    /**
     * 获取吉祥组合
     */
    getAuspiciousCombinations(gender) {
        return this.auspiciousCombinations[gender] || this.auspiciousCombinations['男孩'];
    }
};

// 导出模块
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CharacterDatabase;
}

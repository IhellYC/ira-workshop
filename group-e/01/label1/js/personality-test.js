/**
 * 西游记人格测试 - JavaScript
 */

// 5个问题数据
const questions = [
    {
        text: "取经路上遇到一只拦路虎妖，你会怎么做？",
        options: [
            { text: "直接掏出金箍棒，让它见识见识齐天大圣的厉害！", scores: { brave: 2, action: 1 } },
            { text: "先问清楚来历，再决定是打还是绕道", scores: { wise: 2, calm: 1 } },
            { text: "大声呼救：悟空！为师遇到妖怪啦！", scores: { rely: 2, social: 1 } },
            { text: "默默观察，等别人先动手再决定", scores: { cautious: 2, observer: 1 } }
        ]
    },
    {
        text: "师父又因你犯错念起了紧箍咒，你的反应是？",
        options: [
            { text: "忍着剧痛解释误会，绝不认错！", scores: { stubborn: 2, brave: 1 } },
            { text: "默默承受，等师父消气后再好好沟通", scores: { patient: 2, wise: 1 } },
            { text: "赶紧道歉认错，痛死了就不好了", scores: { flexible: 2, social: 1 } },
            { text: "心里记仇，找机会在师父饭里少放点盐", scores: { mischievous: 2, cunning: 1 } }
        ]
    },
    {
        text: "前方有一片桃林，果子鲜嫩欲滴，但前面还有赶路任务，你？",
        options: [
            { text: "摘几个路上吃，顺便打包带走的", scores: { action: 2, enjoyment: 1 } },
            { text: "忍住！取经要紧，不能贪恋凡尘", scores: { disciplined: 2, calm: 1 } },
            { text: "吃一个两个应该没关系吧……就一口！", scores: { indulgent: 2, flexible: 1 } },
            { text: "先看看有没有人看守，安全第一", scores: { cautious: 2, cunning: 1 } }
        ]
    },
    {
        text: "团队里有人开始偷懒，你的处理方式是？",
        options: [
            { text: "直接点破，偷懒就是不对！", scores: { straightforward: 2, brave: 1 } },
            { text: "以身作则更努力，等他自己不好意思", scores: { wise: 2, patient: 1 } },
            { text: "找机会私下聊，了解是不是遇到困难", scores: { social: 2, empathetic: 1 } },
            { text: "我也偷懒，大家一起躺平", scores: { mischievous: 2, indulgent: 1 } }
        ]
    },
    {
        text: "终于取得真经，站在灵山之巅，你最大的心愿是？",
        options: [
            { text: "回花果山当大王，自由自在最重要！", scores: { free: 2, action: 1 } },
            { text: "留在灵山修行，继续提升自己", scores: { disciplined: 2, wise: 1 } },
            { text: "回高老庄……老婆孩子热炕头", scores: { enjoyment: 2, social: 1 } },
            { text: "希望能帮助更多人走上取经路", scores: { empathetic: 2, wise: 1 } }
        ]
    }
];

// 20种西游记角色结果
const characters = [
    {
        name: "孙悟空",
        avatar: "🐵",
        title: "齐天大圣 · 斗战胜佛",
        traits: ["勇敢", "正义", "叛逆", "忠诚"],
        desc: "你骨子里流淌着不服输的热血，天不怕地不怕。面对困难，你永远冲在最前面。虽然有时候脾气急躁，但你的心地善良，对朋友绝对忠诚。取经路上的妖魔鬼怪，在你眼里不过是修炼的陪练。",
        fortune: "贵人运旺盛，逢凶化吉。适合开拓性工作，在危机中反而最能发光。记得收敛脾气，别把领导当妖怪打。"
    },
    {
        name: "唐三藏",
        avatar: "🧙",
        title: "金蝉子转世 · 旃檀功德佛",
        traits: ["慈悲", "坚定", "唠叨", "执着"],
        desc: "你是一个目标坚定、心怀慈悲的人。无论遇到多少困难，都不会忘记自己的初心。你相信善良和坚持终将感动所有人。虽然有时候显得迂腐，但你的精神力量往往能凝聚整个团队。",
        fortune: "贵人运中等，但精神财富丰富。适合教育、公益类工作。注意别太较真，偶尔也要听取他人意见。"
    },
    {
        name: "猪八戒",
        avatar: "🐷",
        title: "天蓬元帅 · 净坛使者",
        traits: ["乐观", "贪吃", "幽默", "可爱"],
        desc: "你是团队的开心果，懂得享受生活的美好。虽然常被说是懒汉，但关键时刻从不掉链子。你有着天真烂漫的一面，是调剂紧张气氛的高手。人生苦短，及时行乐是你的座右铭。",
        fortune: "桃花运旺盛，吃喝运极佳。适合娱乐、餐饮行业。注意控制食欲，别让减肥计划永远在明天。"
    },
    {
        name: "沙悟净",
        avatar: "🧔",
        title: "卷帘大将 · 金身罗汉",
        traits: ["踏实", "稳重", "任劳任怨", "内敛"],
        desc: "你是团队中最可靠的存在，默默承担着最辛苦的工作却不求回报。你相信行动比语言更有力量，是真正的大智若愚。虽然不善表达，但所有人都知道有你在最放心。",
        fortune: "事业运平稳上升，越老越吃香。适合技术、管理岗位。记得适当表现自己，别让功劳被别人抢走。"
    },
    {
        name: "白龙马",
        avatar: "🐲",
        title: "西海龙王三太子 · 八部天龙",
        traits: ["隐忍", "高贵", "专一", "深沉"],
        desc: "你出身不凡，却甘愿默默付出。为了心中的目标，你能忍受常人难以忍受的委屈。你的沉默不是软弱，而是蓄势待发。一旦决定付出，就是最忠诚的守护者。",
        fortune: "逆袭运极佳，等待时机一飞冲天。适合需要沉淀的行业。注意别憋太久，适时释放压力。"
    },
    {
        name: "观音菩萨",
        avatar: "🪷",
        title: "大慈大悲 · 救苦救难",
        traits: ["智慧", "慈悲", "谋略", "从容"],
        desc: "你是天生的协调者，总能在混乱中找到秩序。你善于识人用人，懂得放权给合适的人。你的智慧不张扬，但关键时刻总能给出最正确的指引。众人都愿意信任你、依靠你。",
        fortune: "人脉运极佳，贵人无数。适合管理、咨询类工作。记得照顾好自己，别只顾着普度众生。"
    },
    {
        name: "玉皇大帝",
        avatar: "👑",
        title: "三界之主 · 昊天金阙",
        traits: ["威严", "权威", "公正", "老练"],
        desc: "你有领导者的气质，善于统筹全局。你重视规则和秩序，相信制度的力量。虽然有时显得高高在上，但你的决策往往考虑周全。你适合站在高处，俯瞰全局。",
        fortune: "权力运旺盛，适合体制内发展。注意别太官僚，偶尔下凡体验一下民间疾苦。"
    },
    {
        name: "太上老君",
        avatar: "⚗️",
        title: "道教始祖 · 太清道德天尊",
        traits: ["智慧", "神秘", "专注", "淡泊"],
        desc: "你是一个低调的智者，更喜欢在幕后默默耕耘。你对专业领域有着深入的钻研，不追求虚名。你的智慧来自长期的积累和沉淀，看问题总能一针见血。",
        fortune: "学术运极佳，适合研究、技术领域。注意别活成传说，适时分享你的智慧。"
    },
    {
        name: "哪吒",
        avatar: "🔥",
        title: "三太子 · 三坛海会大神",
        traits: ["热血", "正义", "冲动", "勇敢"],
        desc: "你浑身充满少年的锐气，嫉恶如仇，敢作敢当。你的直率有时会得罪人，但你的真诚也能赢得真朋友。你不服输、不服软，是战斗型人格的典型代表。",
        fortune: "冲劲十足，适合创业、竞技类领域。注意控制脾气，别让冲动毁了好事。"
    },
    {
        name: "二郎神",
        avatar: "⚔️",
        title: "显圣真君 · 清源妙道",
        traits: ["傲娇", "实力", "独立", "帅气"],
        desc: "你是天生的精英派，实力与颜值并存。你对自己的能力充满自信，不屑于靠关系上位。你的骄傲有资本，但有时也会显得孤傲。其实你内心渴望被理解。",
        fortune: "实力运爆棚，靠能力吃饭。注意别太清高，偶尔也要融入团队。"
    },
    {
        name: "牛魔王",
        avatar: "🐂",
        title: "平天大圣 · 西方大力王",
        traits: ["豪爽", "重情", "霸气", "执着"],
        desc: "你是一个讲义气的豪杰，朋友遍天下。你看重承诺和情义，愿意为兄弟两肋插刀。虽然有时候固执己见，但你的重情重义让所有人都愿意与你相交。",
        fortune: "兄弟运极佳，人脉资源丰富。适合销售、社交类工作。注意别太冲动，冷静处理感情问题。"
    },
    {
        name: "铁扇公主",
        avatar: "🪭",
        title: "罗刹女 · 铁扇仙",
        traits: ["果断", "护短", "强势", "痴情"],
        desc: "你是一个外刚内柔的人，表面强势，内心却有着柔软的一面。你对家人朋友极度保护，谁敢欺负你的人，你绝不手软。你的执着有时显得固执，但那是对爱的坚持。",
        fortune: "家庭运旺盛，是家里的顶梁柱。适合管理、保护类角色。注意别太强势，给家人一些空间。"
    },
    {
        name: "红孩儿",
        avatar: "👶",
        title: "圣婴大王 · 善财童子",
        traits: ["调皮", "聪明", "叛逆", "有背景"],
        desc: "你是一个古灵精怪的人，点子多、胆子大。你出身不错，但更想凭自己的本事闯出一番天地。你的聪明才智有时用在了'歪门邪道'上，但你的潜力不可估量。",
        fortune: "创意运极佳，适合创新类工作。注意把聪明用在正道，别辜负了你的天赋。"
    },
    {
        name: "嫦娥",
        avatar: "🌙",
        title: "广寒仙子 · 月宫主人",
        traits: ["清冷", "美丽", "孤独", "优雅"],
        desc: "你有着超凡脱俗的气质，追求完美和纯净。你有时显得格格不入，但那是因为你的标准与众不同。你的内心有一片属于自己的净土，不愿被世俗打扰。",
        fortune: "艺术运旺盛，适合文艺、美学领域。注意别太孤单，月亮也要有星星作伴。"
    },
    {
        name: "蜘蛛精",
        avatar: "🕷️",
        title: "盘丝洞七情蜘蛛",
        traits: ["妩媚", "心机", "执着", "团队"],
        desc: "你善于运用自己的魅力达成目标，懂得人心所向。你不是坏人，只是有自己的追求和手段。你重视姐妹情谊，团队作战能力极强。你的柔性力量往往比强硬更有效。",
        fortune: "魅力运爆棚，适合公关、营销类工作。注意用对地方，别让心机反噬自己。"
    },
    {
        name: "白骨精",
        avatar: "💀",
        title: "白骨夫人 · 尸魔",
        traits: ["聪明", "执着", "演技", "不服输"],
        desc: "你是一个极其执着的人，认定的目标绝不放弃。你善于察言观色、随机应变，有着超强的适应能力。虽然别人觉得你'可怕'，但那只是你保护自己的方式。",
        fortune: "逆袭运强劲，善于抓住机会。注意走正道，别让执念变成执迷。"
    },
    {
        name: "金角大王",
        avatar: "🥇",
        title: "太上老君童子 · 金角大王",
        traits: ["有资源", "有点飘", "倒霉", "搞笑担当"],
        desc: "你是一个自带资源的人，但有时会因为太有底牌而掉以轻心。你其实很有能力，只是容易被看穿。你的憨厚一面反而让人觉得可爱，失败后总能找到台阶下。",
        fortune: "资源运不错，但需要谦逊。适合辅助类岗位。记得低调做人，别把底牌亮太快。"
    },
    {
        name: "银角大王",
        avatar: "🥈",
        title: "太上老君童子 · 银角大王",
        traits: ["机灵", "话痨", "重视兄弟", "装备党"],
        desc: "你是一个有趣的灵魂，话多但招人喜欢。你重视兄弟情义，愿意和朋友共进退。你对'装备'有着执念，喜欢收集各种有用的东西。你的热情能感染周围的人。",
        fortune: "社交运旺盛，朋友众多。适合需要沟通的工作。注意保密，别把什么都往外说。"
    },
    {
        name: "黄袍怪",
        avatar: "🐺",
        title: "奎木狼 · 黄袍老怪",
        traits: ["痴情", "才华", "失控", "两面性"],
        desc: "你是一个极度重情的人，为爱可以放弃一切。你有着不为人知的才华和背景，但容易被感情冲昏头脑。你的痴情既是最可爱的地方，也是最危险的弱点。",
        fortune: "感情运波折，需要理智。适合艺术创作类工作。注意别让感情蒙蔽双眼。"
    },
    {
        name: "如来佛祖",
        avatar: "🧘",
        title: "释迦牟尼 · 西天佛祖",
        traits: ["大智慧", "超脱", "定力", "大局观"],
        desc: "你拥有超然的智慧，能够看透事物的本质。你不轻易出手，但一旦出手必是大手笔。你的气场强大，让人不由自主地敬仰。你适合做最后的决策者。",
        fortune: "智慧运巅峰，适合战略决策类工作。注意别太超脱，偶尔也下凡体验烟火气。"
    }
];

// 分数到角色的映射（根据特征组合映射到角色索引）
const scoreMapping = {
    "brave-action": 0,      // 孙悟空
    "wise-calm": 1,         // 唐三藏
    "enjoyment-social": 2,  // 猪八戒
    "patient-disciplined": 3, // 沙悟净
    "cautious-cunning": 4,  // 白龙马
    "social-empathetic": 5, // 观音
    "stubborn-straightforward": 6, // 玉皇大帝
    "wise-disciplined": 7,  // 太上老君
    "brave-stubborn": 8,    // 哪吒
    "action-free": 9,       // 二郎神
    "action-stubborn": 10,  // 牛魔王
    "cautious-social": 11,  // 铁扇公主
    "mischievous-cunning": 12, // 红孩儿
    "calm-disciplined": 13, // 嫦娥
    "social-mischievous": 14, // 蜘蛛精
    "cunning-cautious": 15, // 白骨精
    "action-mischievous": 16, // 金角大王
    "social-action": 17,    // 银角大王
    "patient-mischievous": 18, // 黄袍怪
    "wise-brave": 19        // 如来佛祖
};

// 当前状态
let currentQuestion = 0;
let totalScores = {};

// 开始测试
function startTest() {
    currentQuestion = 0;
    totalScores = {};
    
    document.getElementById('start-page').classList.remove('active');
    document.getElementById('question-page').classList.add('active');
    
    showQuestion();
}

// 显示问题
function showQuestion() {
    const question = questions[currentQuestion];
    document.getElementById('question-text').textContent = question.text;
    document.getElementById('question-counter').textContent = `第 ${currentQuestion + 1} 题 / 共 5 题`;
    
    // 更新进度条
    const progress = ((currentQuestion) / questions.length) * 100;
    document.getElementById('progress').style.width = `${progress}%`;
    
    // 生成选项
    const container = document.getElementById('options-container');
    container.innerHTML = '';
    
    question.options.forEach((option, index) => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.textContent = option.text;
        btn.onclick = () => selectOption(index);
        container.appendChild(btn);
    });
}

// 选择选项
function selectOption(index) {
    const question = questions[currentQuestion];
    const scores = question.options[index].scores;
    
    // 累加分数
    for (let key in scores) {
        totalScores[key] = (totalScores[key] || 0) + scores[key];
    }
    
    currentQuestion++;
    
    if (currentQuestion < questions.length) {
        showQuestion();
    } else {
        showResult();
    }
}

// 显示结果
function showResult() {
    document.getElementById('question-page').classList.remove('active');
    document.getElementById('result-page').classList.add('active');
    
    // 进度条满
    document.getElementById('progress').style.width = '100%';
    
    // 计算最终角色
    const character = calculateCharacter();
    
    // 显示角色信息
    document.getElementById('character-avatar').textContent = character.avatar;
    document.getElementById('character-name').textContent = character.name;
    document.getElementById('character-title').textContent = character.title;
    
    // 显示特质标签
    const traitsContainer = document.getElementById('character-traits');
    traitsContainer.innerHTML = character.traits.map(t => `<span class="trait-tag">${t}</span>`).join('');
    
    document.getElementById('character-desc').textContent = character.desc;
    
    // 显示运势
    const fortuneContainer = document.getElementById('character-fortune');
    fortuneContainer.innerHTML = `
        <div class="fortune-title">🔮 取经运势</div>
        <div class="fortune-content">${character.fortune}</div>
    `;
}

// 计算角色
function calculateCharacter() {
    // 获取得分最高的两个特征
    const sortedScores = Object.entries(totalScores)
        .sort((a, b) => b[1] - a[1]);
    
    const top1 = sortedScores[0] ? sortedScores[0][0] : 'brave';
    const top2 = sortedScores[1] ? sortedScores[1][0] : 'action';
    
    // 组合特征查找角色
    const key1 = `${top1}-${top2}`;
    const key2 = `${top2}-${top1}`;
    
    let characterIndex = scoreMapping[key1] !== undefined ? scoreMapping[key1] : 
                         scoreMapping[key2] !== undefined ? scoreMapping[key2] : 
                         Math.floor(Math.random() * characters.length);
    
    // 如果没有精确匹配，根据第一特征选择相近角色
    if (scoreMapping[key1] === undefined && scoreMapping[key2] === undefined) {
        const featureMapping = {
            'brave': [0, 8, 9],
            'wise': [1, 5, 7, 19],
            'social': [2, 5, 14, 17],
            'cautious': [4, 11, 15],
            'action': [0, 9, 10, 16],
            'patient': [3, 5, 18],
            'cunning': [4, 12, 15],
            'mischievous': [12, 14, 16, 17, 18],
            'enjoyment': [2],
            'disciplined': [3, 7, 13],
            'empathetic': [5, 19],
            'free': [0, 9],
            'flexible': [2],
            'stubborn': [0, 8, 10],
            'straightforward': [6, 8]
        };
        
        const candidates = featureMapping[top1] || [0];
        characterIndex = candidates[Math.floor(Math.random() * candidates.length)];
    }
    
    return characters[characterIndex];
}

// 重新开始
function restartTest() {
    document.getElementById('result-page').classList.remove('active');
    document.getElementById('start-page').classList.add('active');
    document.getElementById('progress').style.width = '0%';
    currentQuestion = 0;
    totalScores = {};
}

// 分享结果
function shareResult() {
    const name = document.getElementById('character-name').textContent;
    const title = document.getElementById('character-title').textContent;
    const text = `我在【西游人格谱】测试中是「${name}」！\n${title}\n\n快来测测你是哪个西游记角色？`;
    
    if (navigator.share) {
        navigator.share({
            title: '西游人格谱测试结果',
            text: text,
            url: window.location.href
        });
    } else {
        // 复制到剪贴板
        navigator.clipboard.writeText(text).then(() => {
            alert('结果已复制到剪贴板，快去分享吧！');
        }).catch(() => {
            alert(text);
        });
    }
}

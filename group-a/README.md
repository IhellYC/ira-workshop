# Group-A 工作区

## 📋 小组成员

| 编号 | 姓名 | GitHub 用户名 | 角色 |
|------|------|--------------|------|
| 01 | 佘庆彬 | QingbinShe |  |
| 02 |  |  |  |
| 03 |  天明|  HTMING|  组长|
| 04 |  |  |  |
| 05 |  |  |  |
| 06 |  |  |  |
| 07 |  |  |  |
| 07 | 左雯 | xldll | 组员 |
| 08 | 邓乐 | sysudengle | 组员 |
| 09 |  |  |  |
| 10 |  |  |  |

---

## 🎯 任务分配

### M1 模块：投研问答助手
- 负责人：`01`, `02`
- 截止日期：Day 3

### M2 模块：多源数据集成
- 负责人：`03`, `04`
- 截止日期：Day 4

### M3 模块：知识库与问答
- 负责人：`05`, `06`
- 截止日期：Day 4

### M4 模块：通知系统
- 负责人：`07`, `08`
- 截止日期：Day 5

### M5 模块：多 Agent 协作
- 负责人：`09`, `10`
- 截止日期：Day 5

---

## 📁 目录结构

```
group-a/
├── 01/
│   ├── backend/          # 后端代码
│   │   └── tests/        # 测试代码
│   └── docs/             # Spec 文档
├── 02/
│   ├── backend/
│   │   └── tests/
│   └── docs/
└── ... (03-10)
```

---

## 🚀 工作流程

### 1. Fork 主仓库

```bash
# 在 GitHub 上访问主仓库
https://github.com/lvzhaobo/ira-workshop

# 点击右上角 "Fork" 按钮，创建你自己的副本
```

### 2. 克隆到本地

```bash
# 使用 SSH 克隆（推荐）
git clone git@github.com:你的用户名/ira-workshop.git

# 或使用 HTTPS
git clone https://github.com/你的用户名/ira-workshop.git
```

### 3. 添加上游远程仓库

```bash
cd ira-workshop

# 添加主仓库为 upstream
git remote add upstream git@github.com:lvzhaobo/ira-workshop.git

# 验证
git remote -v
# origin    => 你的 Fork
# upstream  => 主仓库
```

### 4. 创建分支

```bash
# 保持与主仓库同步
git checkout main
git pull upstream main

# 创建你的工作分支
git checkout -b feature/group-a-01-m1

# 命名规范：
# feature/group-a-{编号}-{模块名}
# 示例：feature/group-a-01-m1
#       feature/group-a-03-m2
```

### 5. 开发与提交

```bash
# 在你的目录中工作
# 例如：01 成员编辑 group-a/01/ 目录

# 查看状态
git status

# 添加文件
git add group-a/01/

# 提交
git commit -m "feat: 完成 M1 模块 Spec 文档

- 添加 03-立项提案.md
- 添加 05-用户故事.md
- 添加 09-API接口规格.md"

# 推送到你的 Fork
git push origin feature/group-a-01-m1
```

### 6. 提交 PR（Pull Request）

```bash
# 方式 1：使用 GitHub 网页
1. 访问你的 Fork：https://github.com/你的用户名/ira-workshop
2. 点击 "Compare & pull request"
3. 设置：
   - base repository: lvzhaobo/ira-workshop
   - base branch: main
   - head branch: feature/group-a-01-m1
4. 填写 PR 描述
5. 点击 "Create pull request"

# 方式 2：使用 GitHub CLI
gh pr create \
  --base main \
  --head feature/group-a-01-m1 \
  --title "Group-A-01: 完成 M1 模块" \
  --body "已完成 M1 模块的 Spec 文档和基础代码"
```

---

## 📝 PR 提交规范

### PR 标题格式

```
Group-{组名}-{编号}: {简短描述}

示例：
Group-A-01: 完成 M1 模块 Spec 文档
Group-A-03: 实现多源数据集成
Group-A-05: 添加知识库问答功能
```

### PR 描述模板

```markdown
## 📋 任务信息

- **组别**: Group-A
- **成员**: 01（姓名）
- **模块**: M1 - 投研问答助手
- **阶段**: Spec 文档 / 代码实现 / 测试

## ✅ 完成内容

- [ ] 03-立项提案与范围说明
- [ ] 05-用户故事与验收标准
- [ ] 09-API 接口规格
- [ ] 13-测试策略与质量门禁
- [ ] 14-需求追踪矩阵
- [ ] 后端代码实现
- [ ] 前端代码实现
- [ ] 测试用例

## 🔗 相关文档

- Spec 文档路径：`group-a/01/docs/`
- 代码路径：`group-a/01/backend/`

## 📸 截图（如有）

（添加界面截图或运行结果）

## 💬 备注

（其他说明或问题）
```

---

## ⚠️ 注意事项

### 1. 只编辑自己的目录

- ✅ 可以编辑：`group-a/01/`, `group-a/02/`, ...
- ❌ 不要编辑：`group-b/`, `group-c/`, 其他组的目录

### 2. 每天同步主仓库

```bash
# 每天早上执行
git checkout main
git pull upstream main
git push origin main
```

### 3. 提交前检查

```bash
# 确保只提交了自己的文件
git status

# 查看变更内容
git diff --staged

# 确保没有提交敏感信息（API Key、密码等）
```

### 4. 遇到冲突怎么办？

```bash
# 拉取最新代码
git fetch upstream
git merge upstream/main

# 如果有冲突，手动解决后提交
git add <解决冲突的文件>
git commit -m "merge: 解决与 main 分支的冲突"
git push origin feature/group-a-01-m1
```

---

## 📊 进度追踪

| 成员 | M1 | M2 | M3 | M4 | M5 | 状态 |
|------|----|----|----|----|----|------|
| 01 | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | 未开始 |
| 02 | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | 未开始 |
| 03 | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | 未开始 |
| 04 | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | 未开始 |
| 05 | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | 未开始 |
| 06 | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | 未开始 |
| 07 | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | 未开始 |
| 08 | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | 未开始 |
| 09 | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | 未开始 |
| 10 | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | 未开始 |

**图例**：⬜ 未开始 | 🟡 进行中 | ✅ 已完成 | ❌ 有问题

---

## 🆘 获取帮助

### 常见问题

1. **无法克隆仓库？**
   - 检查 SSH Key 配置：`ssh -T git@github.com`
   - 或使用 HTTPS：`git clone https://github.com/...`

2. **提交 PR 失败？**
   - 确保 Fork 了主仓库
   - 确保推送到了自己的 Fork（origin）

3. **遇到 Git 冲突？**
   - 先拉取最新代码：`git pull upstream main`
   - 手动解决冲突后再提交

### 联系讲师

- GitHub: @lvzhaobo
- 问题反馈：在主仓库创建 Issue

---

## 📚 学习资源

- [Spec Coding 文档体系](../.templates/M1/)
- [Git 提交规范](https://www.conventionalcommits.org/)
- [GitHub PR 教程](https://docs.github.com/en/pull-requests)

---

> **最后更新**: 2026-04-13
> **维护者**: Group-A 全体成员

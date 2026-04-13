# Skill Scanner 模块架构文档

> 生成日期：2026-04-13  
> 模块路径：`copaw/src/copaw/security/skill_scanner/`

---

## 1. 概述

Skill Scanner 是 CoPaw 安全模块的核心组件，用于对 Agent Skill 进行静态安全扫描。它通过 YAML 正则签名规则检测潜在的安全威胁，支持可定制的扫描策略。

### 核心能力

- **文件发现**：递归遍历技能目录，自动过滤非扫描文件
- **多规则匹配**：基于 YAML 签名文件的正则模式匹配
- **策略定制**：支持组织级策略配置（允许列表、严重级别覆盖等）
- **威胁分类**：覆盖 17 种威胁类别

---

## 2. 类图

```mermaid
classDiagram
    %% 核心扫描器
    class SkillScanner {
        +ScanPolicy policy
        +list~BaseAnalyzer~ _analyzers
        +int _max_files
        +int _max_file_size
        +set _skip_ext
        +register_analyzer(analyzer)
        +scan_skill(skill_dir, skill_name) ScanResult
        -_discover_files(skill_dir) list~SkillFile~
        -_default_analyzers(policy) list~BaseAnalyzer~
    }

    %% 分析器基类
    class BaseAnalyzer {
        <<abstract>>
        +str name
        +ScanPolicy policy
        +get_name() str
        +analyze(skill_dir, files, skill_name) list~Finding~
    }

    %% 模式分析器
    class PatternAnalyzer {
        +list~SecurityRule~ _rules
        +dict _rules_by_file_type
        +analyze(skill_dir, files, skill_name) list~Finding~
        -_get_rules(file_type) list~SecurityRule~
        -_is_known_test_credential(finding) bool
        -_dedupe_findings(findings) list~Finding~
    }

    %% 规则加载器
    class RuleLoader {
        +Path rules_path
        +list~SecurityRule~ rules
        +dict rules_by_id
        +dict rules_by_category
        +load_rules() list~SecurityRule~
        +get_rule(rule_id) SecurityRule
        +get_rules_for_file_type(file_type) list~SecurityRule~
        +get_rules_for_category(category) list~SecurityRule~
    }

    %% 安全规则
    class SecurityRule {
        +str id
        +ThreatCategory category
        +Severity severity
        +list~str~ patterns
        +list~str~ exclude_patterns
        +list~str~ file_types
        +str description
        +str remediation
        +list compiled_patterns
        +list compiled_exclude_patterns
        +matches_file_type(file_type) bool
        +scan_content(content, file_path) list~dict~
    }

    %% 扫描策略
    class ScanPolicy {
        +str policy_name
        +str policy_version
        +HiddenFilePolicy hidden_files
        +RuleScopingPolicy rule_scoping
        +CredentialPolicy credentials
        +FileClassificationPolicy file_classification
        +FileLimitsPolicy file_limits
        +AnalysisThresholdsPolicy analysis_thresholds
        +list severity_overrides
        +set disabled_rules
        +get_severity_override(rule_id) str
        +is_rule_disabled(rule_id) bool
        +is_doc_path(rel_path) bool
        +default() ScanPolicy
        +from_yaml(path) ScanPolicy
        +to_yaml(path)
    }

    %% 数据模型
    class SkillFile {
        +Path path
        +str relative_path
        +str file_type
        +str content
        +int size_bytes
        +read_content() str
        +is_hidden bool
        +from_path(path, base_dir) SkillFile
    }

    class Finding {
        +str id
        +str rule_id
        +ThreatCategory category
        +Severity severity
        +str title
        +str description
        +str file_path
        +int line_number
        +str snippet
        +str remediation
        +str analyzer
        +dict metadata
        +to_dict() dict
    }

    class ScanResult {
        +str skill_name
        +str skill_directory
        +list~Finding~ findings
        +float scan_duration_seconds
        +list analyzers_used
        +list analyzers_failed
        +datetime timestamp
        +is_safe bool
        +max_severity Severity
        +get_findings_by_severity(severity) list~Finding~
        +get_findings_by_category(category) list~Finding~
        +to_dict() dict
    }

    %% 策略子类
    class HiddenFilePolicy {
        +set benign_dotfiles
        +set benign_dotdirs
    }

    class RuleScopingPolicy {
        +set skillmd_and_scripts_only
        +set skip_in_docs
        +set code_only
        +set doc_path_indicators
        +list doc_filename_patterns
        +bool dedupe_duplicate_findings
    }

    class CredentialPolicy {
        +set known_test_values
        +set placeholder_markers
    }

    class FileClassificationPolicy {
        +set inert_extensions
        +set structured_extensions
        +set archive_extensions
        +set code_extensions
    }

    class FileLimitsPolicy {
        +int max_file_count
        +int max_file_size_bytes
        +int max_reference_depth
        +int max_name_length
        +int max_description_length
        +int min_description_length
    }

    %% 枚举
    class Severity {
        <<enumeration>>
        CRITICAL
        HIGH
        MEDIUM
        LOW
        INFO
        SAFE
    }

    class ThreatCategory {
        <<enumeration>>
        PROMPT_INJECTION
        COMMAND_INJECTION
        DATA_EXFILTRATION
        UNAUTHORIZED_TOOL_USE
        OBFUSCATION
        HARDCODED_SECRETS
        SOCIAL_ENGINEERING
        RESOURCE_ABUSE
        POLICY_VIOLATION
        MALWARE
        HARMFUL_CONTENT
        SKILL_DISCOVERY_ABUSE
        TRANSITIVE_TRUST_ABUSE
        AUTONOMY_ABUSE
        TOOL_CHAINING_ABUSE
        UNICODE_STEGANOGRAPHY
        SUPPLY_CHAIN_ATTACK
    }

    %% 关系
    SkillScanner --> ScanPolicy : uses
    SkillScanner --> BaseAnalyzer : contains
    SkillScanner --> SkillFile : discovers
    SkillScanner --> ScanResult : returns
    
    BaseAnalyzer <|-- PatternAnalyzer : extends
    PatternAnalyzer --> RuleLoader : uses
    PatternAnalyzer --> SecurityRule : applies
    PatternAnalyzer --> Finding : produces
    
    RuleLoader --> SecurityRule : loads
    
    ScanPolicy --> HiddenFilePolicy : contains
    ScanPolicy --> RuleScopingPolicy : contains
    ScanPolicy --> CredentialPolicy : contains
    ScanPolicy --> FileClassificationPolicy : contains
    ScanPolicy --> FileLimitsPolicy : contains
    
    Finding --> Severity : has
    Finding --> ThreatCategory : has
    ScanResult --> Finding : contains
    SecurityRule --> Severity : has
    SecurityRule --> ThreatCategory : has
    SkillFile --> PatternAnalyzer : scanned by
```

---

## 3. 扫描流程图

```mermaid
flowchart TD
    subgraph Input["输入"]
        A[Skill Directory<br/>技能目录]
    end

    subgraph Scanner["SkillScanner<br/>扫描 orchestrator"]
        B[初始化 SkillScanner<br/>加载策略和默认分析器]
        C[scan_skill<br/>扫描入口]
        D[_discover_files<br/>文件发现]
        E[遍历目录文件<br/>过滤跳过条件]
        F[创建 SkillFile<br/>对象列表]
    end

    subgraph Analysis["PatternAnalyzer<br/>模式分析"]
        G[遍历每个文件]
        H{文件类型<br/>匹配?}
        I[读取文件内容]
        J[获取适用的<br/>SecurityRule]
        K[遍历规则]
        L{规则被禁用?}
        M{文档路径<br/>跳过?}
        N[scan_content<br/>扫描内容]
        O[行级匹配<br/>Pass 1]
        P[多行匹配<br/>Pass 2]
        Q[创建 Finding<br/>发现项]
    end

    subgraph PostProcess["后处理"]
        R[过滤测试凭证<br/>_is_known_test_credential]
        S[去重<br/>_dedupe_findings]
        T[聚合所有发现]
    end

    subgraph Output["输出"]
        U[ScanResult<br/>扫描结果]
        V[is_safe?<br/>安全检查]
        W[生成报告]
    end

    %% 流程连接
    A --> B
    B --> C
    C --> D
    D --> E
    E -->|跳过: 符号链接/大文件/扩展名| E
    E --> F
    F --> G
    
    G --> H
    H -->|否| G
    H -->|是| I
    I --> J
    J --> K
    K --> L
    L -->|是| K
    L -->|否| M
    M -->|是| K
    M -->|否| N
    N --> O
    N --> P
    O --> Q
    P --> Q
    Q --> K
    K -->|规则遍历完成| G
    G -->|文件遍历完成| R
    
    R --> S
    S --> T
    T --> U
    U --> V
    V --> W
```

---

## 4. 规则签名文件结构

```mermaid
graph TD
    subgraph Signatures["rules/signatures/<br/>YAML 规则签名文件"]
        A[command_injection.yaml<br/>命令注入]
        B[data_exfiltration.yaml<br/>数据外泄]
        C[hardcoded_secrets.yaml<br/>硬编码密钥]
        D[obfuscation.yaml<br/>混淆检测]
        E[prompt_injection.yaml<br/>提示注入]
        F[social_engineering.yaml<br/>社会工程]
        G[supply_chain.yaml<br/>供应链攻击]
        H[unauthorized_tool_use.yaml<br/>未授权工具使用]
    end

    subgraph RuleFormat["SecurityRule 结构"]
        I[id: 规则ID]
        J[category: 威胁类别]
        K[severity: 严重级别]
        L[patterns: 正则列表]
        M[exclude_patterns: 排除模式]
        N[file_types: 适用文件类型]
        O[description: 描述]
        P[remediation: 修复建议]
    end

    A --> RuleFormat
    B --> RuleFormat
    C --> RuleFormat
    D --> RuleFormat
    E --> RuleFormat
    F --> RuleFormat
    G --> RuleFormat
    H --> RuleFormat
```

---

## 5. 策略配置结构

```mermaid
graph LR
    subgraph Policy["ScanPolicy<br/>扫描策略"]
        A[hidden_files<br/>隐藏文件策略]
        B[rule_scoping<br/>规则范围策略]
        C[credentials<br/>凭证策略]
        D[file_classification<br/>文件分类策略]
        E[file_limits<br/>文件限制策略]
        F[analysis_thresholds<br/>分析阈值策略]
        G[severity_overrides<br/>严重级别覆盖]
        H[disabled_rules<br/>禁用规则]
    end

    subgraph Sources["配置来源"]
        I[default_policy.yaml<br/>内置默认策略]
        J[用户自定义 YAML<br/>组织特定策略]
    end

    Sources -->|加载合并| Policy
```

---

## 6. 模块职责说明

| 组件 | 文件路径 | 职责 |
|------|----------|------|
| **SkillScanner** | `scanner.py` | 扫描 orchestrator，协调文件发现和分析器执行 |
| **BaseAnalyzer** | `analyzers/__init__.py` | 分析器抽象基类 |
| **PatternAnalyzer** | `analyzers/pattern_analyzer.py` | 基于 YAML 正则签名的静态分析器 |
| **RuleLoader** | `analyzers/pattern_analyzer.py` | 从 YAML 文件加载和索引安全规则 |
| **SecurityRule** | `analyzers/pattern_analyzer.py` | 单个安全检测规则（正则模式 + 元数据） |
| **ScanPolicy** | `scan_policy.py` | 可定制的扫描策略（允许列表、范围控制等） |
| **SkillFile** | `models.py` | 技能包中的文件模型 |
| **Finding** | `models.py` | 安全发现项（规则匹配结果） |
| **ScanResult** | `models.py` | 扫描结果聚合（包含所有发现项和元数据） |

---

## 7. 威胁类别 (ThreatCategory)

| 类别 | 说明 |
|------|------|
| PROMPT_INJECTION | 提示注入攻击 |
| COMMAND_INJECTION | 命令注入攻击 |
| DATA_EXFILTRATION | 数据外泄 |
| UNAUTHORIZED_TOOL_USE | 未授权工具使用 |
| OBFUSCATION | 代码混淆 |
| HARDCODED_SECRETS | 硬编码密钥 |
| SOCIAL_ENGINEERING | 社会工程 |
| RESOURCE_ABUSE | 资源滥用 |
| POLICY_VIOLATION | 策略违规 |
| MALWARE | 恶意软件 |
| HARMFUL_CONTENT | 有害内容 |
| SKILL_DISCOVERY_ABUSE | Skill 发现滥用 |
| TRANSITIVE_TRUST_ABUSE | 传递信任滥用 |
| AUTONOMY_ABUSE | 自主性滥用 |
| TOOL_CHAINING_ABUSE | 工具链滥用 |
| UNICODE_STEGANOGRAPHY | Unicode 隐写 |
| SUPPLY_CHAIN_ATTACK | 供应链攻击 |

---

## 8. 目录结构

```
skill_scanner/
├── analyzers/
│   ├── __init__.py              # BaseAnalyzer 基类
│   └── pattern_analyzer.py      # PatternAnalyzer, RuleLoader, SecurityRule
├── data/
│   └── default_policy.yaml      # 默认扫描策略
├── rules/signatures/
│   ├── command_injection.yaml   # 命令注入规则
│   ├── data_exfiltration.yaml   # 数据外泄规则
│   ├── hardcoded_secrets.yaml   # 硬编码密钥规则
│   ├── obfuscation.yaml         # 混淆检测规则
│   ├── prompt_injection.yaml    # 提示注入规则
│   ├── social_engineering.yaml  # 社会工程规则
│   ├── supply_chain.yaml        # 供应链攻击规则
│   └── unauthorized_tool_use.yaml # 未授权工具使用规则
├── __init__.py
├── models.py                    # SkillFile, Finding, ScanResult, 枚举
├── scan_policy.py               # ScanPolicy 及策略子类
└── scanner.py                   # SkillScanner 主类
```

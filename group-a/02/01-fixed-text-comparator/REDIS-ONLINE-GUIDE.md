# 在线 Redis 服务配置指南

本文档介绍如何配置和使用在线 Redis 服务，无需在本地安装 Redis。

## 🌐 推荐的免费在线 Redis 服务

### 1️⃣ Redis Cloud（推荐）

**特点**：
- 官方 Redis 服务
- 免费额度：30MB
- 无需信用卡
- 全球多区域部署

**注册步骤**：
1. 访问 https://redis.com/try-free/
2. 点击 "Get Started" 注册账号
3. 创建免费数据库
4. 选择区域（推荐选择离你最近的）
5. 获取连接信息

**连接信息示例**：
```
Endpoint: redis-12345.c1.us-east-1-2.ec2.redns.redis-cloud.com:12345
Username: default
Password: AbCdEfGhIjKlMnOpQrStUvWxYz
```

**配置方法**：
```yaml
spring:
  redis:
    host: redis-12345.c1.us-east-1-2.ec2.redns.redis-cloud.com
    port: 12345
    password: AbCdEfGhIjKlMnOpQrStUvWxYz
    database: 0
    timeout: 5000
    ssl:
      enabled: true  # Redis Cloud 需要 SSL
```

---

### 2️⃣ Upstash（推荐用于 Serverless）

**特点**：
- 免费额度：每天 10,000 条命令
- 支持 REST API
- Serverless 架构
- 按需付费

**注册步骤**：
1. 访问 https://upstash.com/
2. 使用 GitHub 账号登录
3. 创建 Redis 数据库
4. 选择区域
5. 获取连接信息

**连接信息示例**：
```
Endpoint: https://your-redis.upstash.io
Token: your_access_token
```

**配置方法（TCP 模式）**：
```yaml
spring:
  redis:
    host: your-redis.upstash.io
    port: 6379
    password: your_access_token
    database: 0
    timeout: 5000
    ssl:
      enabled: true
```

---

### 3️⃣ Aiven for Redis

**特点**：
- 免费试用：1个CPU, 1GB内存
- 企业级服务
- 自动备份
- 监控面板

**注册步骤**：
1. 访问 https://aiven.io/redis
2. 注册账号
3. 创建 Redis 服务
4. 选择 "Free Trial" 计划
5. 获取连接信息

**连接信息示例**：
```
Host: your-redis.aivencloud.com
Port: 12345
Username: avnadmin
Password: your_password
```

**配置方法**：
```yaml
spring:
  redis:
    host: your-redis.aivencloud.com
    port: 12345
    password: your_password
    database: 0
    timeout: 5000
    ssl:
      enabled: true
```

---

### 4️⃣ Redis Labs

**特点**：
- 免费额度：30MB
- 简单易用
- 适合学习

**注册步骤**：
1. 访问 https://app.redislabs.com/
2. 注册账号
3. 创建订阅
4. 创建数据库
5. 获取连接信息

---

## 🔧 配置步骤

### 步骤 1：选择并注册在线 Redis 服务

从上述服务中选择一个，完成注册并获取连接信息。

### 步骤 2：修改配置文件

编辑 `backend/src/main/resources/application.yml`：

```yaml
spring:
  redis:
    # 替换为你的在线 Redis 连接信息
    host: your-redis-host.com      # 替换为实际主机名
    port: 12345                     # 替换为实际端口
    password: your_password         # 替换为实际密码
    database: 0
    timeout: 5000
    ssl:
      enabled: true                 # 大多数在线服务需要启用 SSL
```

### 步骤 3：测试连接

创建一个简单的测试类来验证连接：

```java
package com.comparator;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Component;

@Component
public class RedisConnectionTest implements CommandLineRunner {
    
    @Autowired
    private RedisTemplate<String, Object> redisTemplate;
    
    @Override
    public void run(String... args) {
        try {
            // 测试连接
            redisTemplate.opsForValue().set("test", "connection_success");
            Object value = redisTemplate.opsForValue().get("test");
            System.out.println("✅ Redis 连接成功！测试值: " + value);
            
            // 清理测试数据
            redisTemplate.delete("test");
        } catch (Exception e) {
            System.err.println("❌ Redis 连接失败: " + e.getMessage());
            e.printStackTrace();
        }
    }
}
```

### 步骤 4：启动后端

```bash
cd backend
mvn spring-boot:run
```

如果看到 "✅ Redis 连接成功！" 的日志，说明配置成功。

---

## 🔒 安全建议

### 1. 使用环境变量存储密码

**不要**将密码硬编码在配置文件中！

创建 `.env` 文件：
```bash
REDIS_HOST=your-redis-host.com
REDIS_PORT=12345
REDIS_PASSWORD=your_password
```

修改 `application.yml`：
```yaml
spring:
  redis:
    host: ${REDIS_HOST:localhost}
    port: ${REDIS_PORT:6379}
    password: ${REDIS_PASSWORD:}
    ssl:
      enabled: ${REDIS_SSL:false}
```

### 2. 启用 SSL/TLS

大多数在线 Redis 服务要求使用 SSL 连接：
```yaml
spring:
  redis:
    ssl:
      enabled: true
```

### 3. 设置合理的超时时间

```yaml
spring:
  redis:
    timeout: 5000  # 5秒超时
    lettuce:
      pool:
        max-active: 8
        max-idle: 8
        min-idle: 0
```

### 4. 限制数据库访问

- 在 Redis 服务控制台设置 IP 白名单
- 使用强密码
- 定期更换密码

---

## 📊 服务对比表

| 特性 | Redis Cloud | Upstash | Aiven | Redis Labs |
|------|-------------|---------|-------|------------|
| 免费额度 | 30MB | 10K命令/天 | 1GB内存 | 30MB |
| SSL支持 | ✅ | ✅ | ✅ | ✅ |
| 持久化 | ✅ | ✅ | ✅ | ✅ |
| 备份 | ❌ | ✅ | ✅ | ❌ |
| 监控面板 | ✅ | ✅ | ✅ | ✅ |
| API访问 | ❌ | ✅ | ❌ | ❌ |
| 适合场景 | 开发测试 | Serverless | 生产环境 | 学习 |

---

## 🐛 常见问题

### Q1: 连接超时怎么办？

**解决方案**：
1. 检查网络连接
2. 确认防火墙允许出站连接
3. 增加超时时间：`timeout: 10000`
4. 确认 SSL 设置正确

### Q2: SSL 连接失败？

**解决方案**：
```yaml
spring:
  redis:
    ssl:
      enabled: true
    lettuce:
      ssl:
        enabled: true
```

### Q3: 认证失败？

**解决方案**：
1. 检查密码是否正确（注意大小写）
2. 确认用户名（某些服务需要）
3. 查看服务文档确认认证方式

### Q4: 连接池耗尽？

**解决方案**：
```yaml
spring:
  redis:
    lettuce:
      pool:
        max-active: 16
        max-idle: 8
        min-idle: 2
        max-wait: 3000
```

---

## 🚀 快速开始（使用 Redis Cloud）

### 1. 注册 Redis Cloud

访问 https://redis.com/try-free/ 并注册账号

### 2. 创建数据库

1. 登录后点击 "New Database"
2. 选择 "Fixed Subscription"
3. 选择免费计划
4. 选择区域
5. 点击 "Activate"

### 3. 获取连接信息

在数据库详情页找到：
- **Endpoint**: `redis-xxxxx.cloud.redislabs.com:12345`
- **Password**: 你的密码

### 4. 配置项目

```yaml
spring:
  redis:
    host: redis-xxxxx.cloud.redislabs.com
    port: 12345
    password: your_password
    database: 0
    timeout: 5000
    ssl:
      enabled: true
```

### 5. 启动测试

```bash
cd backend
mvn spring-boot:run
```

---

## 📞 获取帮助

如果遇到问题：

1. **查看服务文档**：每个服务都有详细文档
2. **检查日志**：查看 Spring Boot 启动日志
3. **测试连接**：使用 Redis CLI 或 RedisInsight 测试
4. **联系支持**：在线服务通常有技术支持

---

## 🎯 总结

使用在线 Redis 服务的好处：
- ✅ 无需本地安装
- ✅ 开箱即用
- ✅ 免费额度足够开发使用
- ✅ 支持团队协作
- ✅ 自动备份和高可用

推荐新手使用 **Redis Cloud**，简单易用且免费额度充足！

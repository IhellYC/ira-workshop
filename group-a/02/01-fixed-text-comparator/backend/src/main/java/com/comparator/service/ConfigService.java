package com.comparator.service;

import com.comparator.model.CompareConfig;
import com.comparator.util.IniParser;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.concurrent.TimeUnit;

@Service
public class ConfigService {
    
    @Value("${app.config-dir:configs}")
    private String configDir;
    
    private final RedisTemplate<String, Object> redisTemplate;
    
    public ConfigService(RedisTemplate<String, Object> redisTemplate) {
        this.redisTemplate = redisTemplate;
    }
    
    /**
     * 列出所有配置文件
     */
    public List<String> listConfigs() {
        // 先从 Redis 获取配置列表
        String listKey = "config:names";
        List<String> configNames = new ArrayList<>();
        
        // 尝试从 Redis 获取
        Object cached = redisTemplate.opsForValue().get(listKey);
        if (cached instanceof List) {
            configNames = (List<String>) cached;
        }
        
        // 如果 Redis 中没有，从文件系统读取
        if (configNames.isEmpty()) {
            File dir = new File(configDir);
            if (dir.exists() && dir.isDirectory()) {
                File[] files = dir.listFiles((d, name) -> name.endsWith(".ini"));
                if (files != null) {
                    for (File file : files) {
                        configNames.add(file.getName().replace(".ini", ""));
                    }
                }
                // 缓存到 Redis
                redisTemplate.opsForValue().set(listKey, configNames, 24, TimeUnit.HOURS);
            }
        }
        
        return configNames;
    }
    
    /**
     * 获取指定配置
     */
    public CompareConfig getConfig(String name) throws IOException {
        // 先从 Redis 缓存加载
        String cacheKey = "config:" + name;
        Object cached = redisTemplate.opsForValue().get(cacheKey);
        
        if (cached instanceof CompareConfig) {
            return (CompareConfig) cached;
        }
        
        // 从文件加载
        File iniFile = new File(configDir, name + ".ini");
        if (!iniFile.exists()) {
            throw new RuntimeException("配置文件不存在: " + name);
        }
        
        CompareConfig config = IniParser.parseIni(iniFile);
        
        // 缓存到 Redis
        redisTemplate.opsForValue().set(cacheKey, config, 24, TimeUnit.HOURS);
        
        return config;
    }
    
    /**
     * 保存配置
     */
    public void saveConfig(CompareConfig config) throws IOException {
        File dir = new File(configDir);
        if (!dir.exists()) {
            dir.mkdirs();
        }
        
        File iniFile = new File(configDir, config.getName() + ".ini");
        IniParser.writeIni(iniFile, config);
        
        // 更新 Redis 缓存
        String cacheKey = "config:" + config.getName();
        redisTemplate.opsForValue().set(cacheKey, config, 24, TimeUnit.HOURS);
        
        // 更新配置列表
        String listKey = "config:names";
        redisTemplate.delete(listKey);
    }
    
    /**
     * 删除配置
     */
    public void deleteConfig(String name) {
        File iniFile = new File(configDir, name + ".ini");
        if (iniFile.exists()) {
            iniFile.delete();
        }
        
        // 删除 Redis 缓存
        String cacheKey = "config:" + name;
        redisTemplate.delete(cacheKey);
        
        // 更新配置列表
        String listKey = "config:names";
        redisTemplate.delete(listKey);
    }
}

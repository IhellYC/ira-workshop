package com.comparator.service;

import com.comparator.model.CompareConfig;
import com.comparator.model.CompareResult;
import com.comparator.model.ModifiedRecord;
import com.comparator.util.FixedTextParser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.concurrent.TimeUnit;

@Service
public class CompareService {
    
    @Autowired
    private RedisTemplate<String, Object> redisTemplate;
    
    @Autowired
    private FixedTextParser parser;
    
    @Autowired
    private ConfigService configService;
    
    /**
     * 对比两个文件
     */
    public CompareResult compare(String configName, String file1Content, String file2Content) {
        try {
            // 1. 加载配置
            CompareConfig config = configService.getConfig(configName);
            
            // 2. 解析两个文件
            List<Map<String, Object>> records1 = parser.parseText(file1Content, config);
            List<Map<String, Object>> records2 = parser.parseText(file2Content, config);
            
            // 3. 构建 key 映射
            Map<String, Map<String, Object>> map1 = buildKeyMap(records1, config.getKeyFields());
            Map<String, Map<String, Object>> map2 = buildKeyMap(records2, config.getKeyFields());
            
            // 4. 执行对比
            CompareResult result = new CompareResult();
            Set<String> allKeys = new HashSet<>();
            allKeys.addAll(map1.keySet());
            allKeys.addAll(map2.keySet());
            
            for (String key : allKeys) {
                if (map1.containsKey(key) && !map2.containsKey(key)) {
                    // 仅在文件1中
                    result.getOnlyInFile1().add(map1.get(key));
                } else if (!map1.containsKey(key) && map2.containsKey(key)) {
                    // 仅在文件2中
                    result.getOnlyInFile2().add(map2.get(key));
                } else {
                    // 两个文件都有，检查是否有差异
                    Map<String, Object> record1 = map1.get(key);
                    Map<String, Object> record2 = map2.get(key);
                    
                    if (!record1.equals(record2)) {
                        ModifiedRecord modified = new ModifiedRecord();
                        modified.setKey(key);
                        modified.setFile1(record1);
                        modified.setFile2(record2);
                        modified.setDiffFields(parser.findDiffFields(record1, record2));
                        result.getModified().add(modified);
                    } else {
                        result.setIdenticalCount(result.getIdenticalCount() + 1);
                    }
                }
            }
            
            // 5. 缓存对比结果到 Redis（30分钟过期）
            String cacheKey = "compare:" + UUID.randomUUID().toString();
            redisTemplate.opsForValue().set(cacheKey, result, 30, TimeUnit.MINUTES);
            result.setCacheKey(cacheKey);
            
            return result;
        } catch (Exception e) {
            throw new RuntimeException("文件对比失败: " + e.getMessage(), e);
        }
    }
    
    /**
     * 根据缓存 key 获取对比结果
     */
    public CompareResult getCachedResult(String cacheKey) {
        Object cached = redisTemplate.opsForValue().get(cacheKey);
        if (cached instanceof CompareResult) {
            return (CompareResult) cached;
        }
        return null;
    }
    
    /**
     * 构建 key 映射
     */
    private Map<String, Map<String, Object>> buildKeyMap(
            List<Map<String, Object>> records, 
            List<String> keyFields) {
        Map<String, Map<String, Object>> map = new HashMap<>();
        
        for (Map<String, Object> record : records) {
            String key = parser.buildKey(record, keyFields);
            map.put(key, record);
        }
        
        return map;
    }
}

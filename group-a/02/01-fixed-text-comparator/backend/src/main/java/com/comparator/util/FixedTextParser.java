package com.comparator.util;

import com.comparator.model.CompareConfig;
import com.comparator.model.FieldDefinition;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component
public class FixedTextParser {
    
    /**
     * 解析单行定长文本为 Map
     */
    public Map<String, Object> parseLine(String line, CompareConfig config) {
        Map<String, Object> result = new HashMap<>();
        
        for (FieldDefinition field : config.getFields()) {
            int start = field.getStart();
            int length = field.getLength();
            
            // 确保不越界
            if (start >= line.length()) {
                result.put(field.getName(), "");
                continue;
            }
            
            int end = Math.min(start + length, line.length());
            String value = line.substring(start, end);
            
            // 根据类型处理
            if ("number".equals(field.getType())) {
                // 数字：去掉小数点，去掉左边的0
                value = value.trim();
                value = value.replace(".", "");
                value = value.replaceAll("^0+", "");
                if (value.isEmpty()) {
                    value = "0";
                }
            } else {
                // 字符串：去掉右边空格
                value = value.stripTrailing();
            }
            
            result.put(field.getName(), value);
        }
        
        return result;
    }
    
    /**
     * 解析整个文本内容为记录列表
     */
    public List<Map<String, Object>> parseText(String text, CompareConfig config) {
        List<Map<String, Object>> records = new ArrayList<>();
        
        if (text == null || text.trim().isEmpty()) {
            return records;
        }
        
        String[] lines = text.split("\n");
        for (String line : lines) {
            // 跳过空行
            if (line.trim().isEmpty()) {
                continue;
            }
            
            // 移除行尾的换行符
            line = line.replace("\r", "");
            records.add(parseLine(line, config));
        }
        
        return records;
    }
    
    /**
     * 根据 key 字段构建唯一键
     */
    public String buildKey(Map<String, Object> record, List<String> keyFields) {
        StringBuilder key = new StringBuilder();
        for (String field : keyFields) {
            Object value = record.get(field);
            key.append(value != null ? value.toString() : "");
            key.append("|");
        }
        return key.toString();
    }
    
    /**
     * 找出两个记录之间的差异字段
     */
    public List<String> findDiffFields(Map<String, Object> record1, Map<String, Object> record2) {
        List<String> diffFields = new ArrayList<>();
        
        for (String field : record1.keySet()) {
            Object value1 = record1.get(field);
            Object value2 = record2.get(field);
            
            if (value1 == null && value2 != null) {
                diffFields.add(field);
            } else if (value1 != null && value2 == null) {
                diffFields.add(field);
            } else if (value1 != null && !value1.equals(value2)) {
                diffFields.add(field);
            }
        }
        
        return diffFields;
    }
}

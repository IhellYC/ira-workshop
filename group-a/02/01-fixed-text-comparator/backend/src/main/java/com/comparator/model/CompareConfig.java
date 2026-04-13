package com.comparator.model;

import lombok.Data;
import java.util.List;

@Data
public class CompareConfig {
    private String name;                    // 配置名称
    private String description;             // 配置描述
    private List<String> keyFields;         // Key 字段列表
    private List<FieldDefinition> fields;   // 字段定义列表
    
    public CompareConfig() {
    }
}

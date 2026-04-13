package com.comparator.model;

import lombok.Data;

@Data
public class FieldDefinition {
    private String name;        // 字段名称
    private Integer start;      // 起始位置（0-based）
    private Integer length;     // 字段长度
    private String type;        // 类型：string 或 number
    
    public FieldDefinition() {
    }
    
    public FieldDefinition(String name, Integer start, Integer length, String type) {
        this.name = name;
        this.start = start;
        this.length = length;
        this.type = type;
    }
}

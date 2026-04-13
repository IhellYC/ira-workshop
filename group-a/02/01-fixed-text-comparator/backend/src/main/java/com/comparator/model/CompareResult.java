package com.comparator.model;

import lombok.Data;
import java.util.List;
import java.util.Map;

@Data
public class CompareResult {
    private String cacheKey;                        // Redis 缓存 key
    private List<Map<String, Object>> onlyInFile1;  // 仅在文件1中的记录
    private List<Map<String, Object>> onlyInFile2;  // 仅在文件2中的记录
    private List<ModifiedRecord> modified;          // 修改的记录
    private Integer identicalCount;                 // 相同记录数量
    
    public CompareResult() {
        this.onlyInFile1 = new java.util.ArrayList<>();
        this.onlyInFile2 = new java.util.ArrayList<>();
        this.modified = new java.util.ArrayList<>();
        this.identicalCount = 0;
    }
}


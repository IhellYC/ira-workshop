package com.comparator.model;

import lombok.Data;

@Data
public class CompareRequest {
    private String configName;      // 配置名称
    private String file1Content;    // 文件1内容
    private String file2Content;    // 文件2内容
    
    public CompareRequest() {
    }
}

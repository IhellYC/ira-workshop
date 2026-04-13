package com.comparator.model;

import lombok.Data;
import java.util.List;
import java.util.Map;

@Data
public class ModifiedRecord {
    private String key;
    private Map<String, Object> file1;
    private Map<String, Object> file2;
    private List<String> diffFields;
}

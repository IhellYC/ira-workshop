package com.comparator.util;

import com.comparator.model.CompareConfig;
import com.comparator.model.FieldDefinition;
import org.ini4j.Ini;
import org.ini4j.Profile;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

public class IniParser {
    
    /**
     * 解析 INI 文件为 CompareConfig 对象
     */
    public static CompareConfig parseIni(File iniFile) throws IOException {
        Ini ini = new Ini(iniFile);
        CompareConfig config = new CompareConfig();
        
        // 解析 [general] section
        Profile.Section general = ini.get("general");
        if (general != null) {
            config.setName(general.get("name"));
            config.setDescription(general.get("description"));
        }
        
        // 解析 [key_fields] section
        Profile.Section keyFields = ini.get("key_fields");
        if (keyFields != null) {
            String fieldsStr = keyFields.get("fields");
            if (fieldsStr != null && !fieldsStr.trim().isEmpty()) {
                config.setKeyFields(Arrays.asList(fieldsStr.split("\\s*,\\s*")));
            } else {
                config.setKeyFields(new ArrayList<>());
            }
        }
        
        // 解析 [fields] section
        Profile.Section fields = ini.get("fields");
        if (fields != null) {
            List<FieldDefinition> fieldList = new ArrayList<>();
            for (Map.Entry<String, String> entry : fields.entrySet()) {
                String fieldName = entry.getKey();
                String value = entry.getValue();
                
                // 格式: 起始位置,长度,类型
                String[] parts = value.split("\\s*,\\s*");
                if (parts.length == 3) {
                    FieldDefinition fieldDef = new FieldDefinition();
                    fieldDef.setName(fieldName);
                    fieldDef.setStart(Integer.parseInt(parts[0].trim()));
                    fieldDef.setLength(Integer.parseInt(parts[1].trim()));
                    fieldDef.setType(parts[2].trim());
                    fieldList.add(fieldDef);
                }
            }
            config.setFields(fieldList);
        }
        
        return config;
    }
    
    /**
     * 将 CompareConfig 对象写入 INI 文件
     */
    public static void writeIni(File iniFile, CompareConfig config) throws IOException {
        Ini ini = new Ini();
        
        // 写入 [general] section
        if (config.getName() != null || config.getDescription() != null) {
            Profile.Section general = ini.add("general");
            if (config.getName() != null) {
                general.put("name", config.getName());
            }
            if (config.getDescription() != null) {
                general.put("description", config.getDescription());
            }
        }
        
        // 写入 [key_fields] section
        if (config.getKeyFields() != null && !config.getKeyFields().isEmpty()) {
            Profile.Section keyFields = ini.add("key_fields");
            keyFields.put("fields", String.join(",", config.getKeyFields()));
        }
        
        // 写入 [fields] section
        if (config.getFields() != null && !config.getFields().isEmpty()) {
            Profile.Section fields = ini.add("fields");
            for (FieldDefinition field : config.getFields()) {
                fields.put(field.getName(), 
                    field.getStart() + "," + field.getLength() + "," + field.getType());
            }
        }
        
        ini.store(iniFile);
    }
}

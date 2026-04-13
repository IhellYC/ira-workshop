package com.comparator.controller;

import com.comparator.model.CompareConfig;
import com.comparator.service.ConfigService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/configs")
public class ConfigController {
    
    private final ConfigService configService;
    
    public ConfigController(ConfigService configService) {
        this.configService = configService;
    }
    
    /**
     * 列出所有配置文件
     */
    @GetMapping
    public ResponseEntity<List<String>> listConfigs() {
        return ResponseEntity.ok(configService.listConfigs());
    }
    
    /**
     * 获取指定配置
     */
    @GetMapping("/{name}")
    public ResponseEntity<CompareConfig> getConfig(@PathVariable String name) {
        try {
            CompareConfig config = configService.getConfig(name);
            return ResponseEntity.ok(config);
        } catch (IOException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * 保存配置
     */
    @PostMapping
    public ResponseEntity<Map<String, String>> saveConfig(@RequestBody CompareConfig config) {
        try {
            configService.saveConfig(config);
            return ResponseEntity.ok(Map.of("status", "success", "message", "配置保存成功"));
        } catch (IOException e) {
            return ResponseEntity.badRequest().body(Map.of("status", "error", "message", e.getMessage()));
        }
    }
    
    /**
     * 删除配置
     */
    @DeleteMapping("/{name}")
    public ResponseEntity<Map<String, String>> deleteConfig(@PathVariable String name) {
        configService.deleteConfig(name);
        return ResponseEntity.ok(Map.of("status", "success", "message", "配置删除成功"));
    }
}

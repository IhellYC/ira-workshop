package com.comparator.controller;

import com.comparator.model.CompareRequest;
import com.comparator.model.CompareResult;
import com.comparator.service.CompareService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/compare")
public class CompareController {
    
    private final CompareService compareService;
    
    public CompareController(CompareService compareService) {
        this.compareService = compareService;
    }
    
    /**
     * 对比两个文件
     */
    @PostMapping
    public ResponseEntity<CompareResult> compare(@RequestBody CompareRequest request) {
        try {
            CompareResult result = compareService.compare(
                request.getConfigName(),
                request.getFile1Content(),
                request.getFile2Content()
            );
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * 获取缓存的对比结果
     */
    @GetMapping("/result/{cacheKey}")
    public ResponseEntity<CompareResult> getCachedResult(@PathVariable String cacheKey) {
        CompareResult result = compareService.getCachedResult(cacheKey);
        if (result == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(result);
    }
}

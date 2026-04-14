<template>
  <div class="search-page">
    <div class="card">
      <div class="card-header">
        <h3>智能语义搜索</h3>
      </div>
      
      <div class="search-box">
        <el-input
          v-model="searchQuery"
          placeholder="输入自然语言描述搜索相关周报，例如：本周表现最好的科技基金"
          size="large"
          @keyup.enter="handleSearch"
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>
        <el-button type="primary" size="large" @click="handleSearch" :loading="loading">
          搜索
        </el-button>
      </div>

      <!-- 搜索结果 -->
      <div class="search-results" v-if="results.length > 0">
        <div class="results-header">
          <span>找到 {{ results.length }} 个相关结果</span>
        </div>
        
        <div 
          class="search-result" 
          v-for="result in results" 
          :key="result.report_id"
          @click="viewReport(result.report_id)"
        >
          <div class="result-header">
            <div class="fund-info">
              <span class="fund-code">{{ result.fund_code }}</span>
              <span class="fund-name">{{ result.fund_name }}</span>
            </div>
            <span class="score">相似度: {{ (result.score * 100).toFixed(1) }}%</span>
          </div>
          <div class="result-summary">
            {{ result.ai_summary || '暂无AI分析摘要' }}
          </div>
        </div>
      </div>
      
      <el-empty v-else-if="!loading" description="输入关键词进行智能搜索" />
    </div>

    <!-- 热门搜索 -->
    <div class="card">
      <div class="card-header">
        <h3>热门搜索</h3>
      </div>
      <div class="hot-searches">
        <el-tag 
          v-for="(keyword, index) in hotKeywords" 
          :key="index"
          class="hot-tag"
          @click="quickSearch(keyword)"
        >
          {{ keyword }}
        </el-tag>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { reportApi } from '@/api'

const router = useRouter()

const searchQuery = ref('')
const results = ref([])
const loading = ref(false)

const hotKeywords = [
  '表现最好的基金',
  '风险较低的基金',
  '科技类基金',
  '债券基金分析',
  '收益率超过5%',
  '最近表现不佳的基金'
]

const handleSearch = async () => {
  if (!searchQuery.value.trim()) return
  
  loading.value = true
  try {
    const data = await reportApi.search(searchQuery.value)
    results.value = data.results
  } catch (error) {
    console.error('搜索失败:', error)
  } finally {
    loading.value = false
  }
}

const quickSearch = (keyword) => {
  searchQuery.value = keyword
  handleSearch()
}

const viewReport = (id) => {
  router.push(`/reports/${id}`)
}
</script>

<style lang="scss" scoped>
.search-page {
  .search-box {
    display: flex;
    gap: 10px;
    margin-bottom: 20px;
    
    .el-input {
      flex: 1;
    }
  }
  
  .search-results {
    .results-header {
      margin-bottom: 15px;
      color: #909399;
      font-size: 14px;
    }
  }
  
  .hot-searches {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    
    .hot-tag {
      cursor: pointer;
      
      &:hover {
        opacity: 0.8;
      }
    }
  }
}
</style>

<template>
  <div class="dashboard">
    <!-- 统计卡片 -->
    <el-row :gutter="20" class="stats-row">
      <el-col :span="6">
        <div class="stat-card">
          <div class="stat-title">基金总数</div>
          <div class="stat-value">{{ stats.total_funds }}</div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="stat-card">
          <div class="stat-title">周报数量</div>
          <div class="stat-value">{{ stats.total_reports }}</div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="stat-card">
          <div class="stat-title">平均周收益率</div>
          <div class="stat-value" :class="getReturnClass(stats.avg_weekly_return)">
            {{ formatReturn(stats.avg_weekly_return) }}
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="stat-card">
          <div class="stat-title">平均年收益率</div>
          <div class="stat-value" :class="getReturnClass(stats.avg_ytd_return)">
            {{ formatReturn(stats.avg_ytd_return) }}
          </div>
        </div>
      </el-col>
    </el-row>

    <!-- 最新周报排行 -->
    <el-row :gutter="20">
      <el-col :span="12">
        <div class="card">
          <div class="card-header">
            <h3>本周表现最佳</h3>
          </div>
          <div v-if="stats.best_performer" class="best-fund">
            <div class="fund-info">
              <span class="fund-code">{{ stats.best_performer.fund_code }}</span>
              <span class="fund-name">{{ stats.best_performer.fund_name }}</span>
            </div>
            <el-tag type="success" size="large">
              {{ formatReturn(getBestReturn()) }}
            </el-tag>
          </div>
          <el-empty v-else description="暂无数据" />
        </div>
      </el-col>
      <el-col :span="12">
        <div class="card">
          <div class="card-header">
            <h3>本周表现最差</h3>
          </div>
          <div v-if="stats.worst_performer" class="worst-fund">
            <div class="fund-info">
              <span class="fund-code">{{ stats.worst_performer.fund_code }}</span>
              <span class="fund-name">{{ stats.worst_performer.fund_name }}</span>
            </div>
            <el-tag type="danger" size="large">
              {{ formatReturn(getWorstReturn()) }}
            </el-tag>
          </div>
          <el-empty v-else description="暂无数据" />
        </div>
      </el-col>
    </el-row>

    <!-- 最新周报列表 -->
    <div class="card">
      <div class="card-header">
        <h3>最新周报</h3>
        <el-button type="primary" link @click="goToReports">
          查看全部
          <el-icon><ArrowRight /></el-icon>
        </el-button>
      </div>
      <el-table :data="latestReports" style="width: 100%">
        <el-table-column prop="fund_code" label="基金代码" width="100" />
        <el-table-column prop="fund_name" label="基金名称" min-width="150" />
        <el-table-column label="周收益率" width="120">
          <template #default="{ row }">
            <span :class="getReturnClass(row.weekly_return)">
              {{ formatReturn(row.weekly_return) }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="月收益率" width="120">
          <template #default="{ row }">
            <span :class="getReturnClass(row.monthly_return)">
              {{ formatReturn(row.monthly_return) }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="年收益率" width="120">
          <template #default="{ row }">
            <span :class="getReturnClass(row.ytd_return)">
              {{ formatReturn(row.ytd_return) }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="AI情绪" width="100">
          <template #default="{ row }">
            <el-tag 
              :type="getSentimentType(row.ai_sentiment)" 
              size="small"
              v-if="row.ai_sentiment"
            >
              {{ getSentimentText(row.ai_sentiment) }}
            </el-tag>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column label="AI评分" width="100">
          <template #default="{ row }">
            <span v-if="row.ai_score">{{ row.ai_score }}</span>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100">
          <template #default="{ row }">
            <el-button type="primary" link @click="viewReport(row.id)">
              详情
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { reportApi } from '@/api'

const router = useRouter()

const stats = ref({
  total_funds: 0,
  total_reports: 0,
  avg_weekly_return: null,
  avg_ytd_return: null,
  best_performer: null,
  worst_performer: null
})

const latestReports = ref([])
const loading = ref(false)

const fetchData = async () => {
  loading.value = true
  try {
    const [statsData, reportsData] = await Promise.all([
      reportApi.getDashboardStats(),
      reportApi.getLatest(10)
    ])
    stats.value = statsData
    latestReports.value = reportsData
  } catch (error) {
    console.error('获取数据失败:', error)
  } finally {
    loading.value = false
  }
}

const formatReturn = (value) => {
  if (value === null || value === undefined) return '-'
  const sign = value >= 0 ? '+' : ''
  return `${sign}${value.toFixed(2)}%`
}

const getReturnClass = (value) => {
  if (value === null || value === undefined) return ''
  return value >= 0 ? 'positive' : 'negative'
}

const getSentimentType = (sentiment) => {
  const types = {
    positive: 'success',
    negative: 'danger',
    neutral: 'info'
  }
  return types[sentiment] || 'info'
}

const getSentimentText = (sentiment) => {
  const texts = {
    positive: '积极',
    negative: '消极',
    neutral: '中性'
  }
  return texts[sentiment] || sentiment
}

const getBestReturn = () => {
  // 从最新周报中获取最佳收益率
  if (latestReports.value.length > 0) {
    return Math.max(...latestReports.value.map(r => r.weekly_return || 0))
  }
  return null
}

const getWorstReturn = () => {
  if (latestReports.value.length > 0) {
    return Math.min(...latestReports.value.map(r => r.weekly_return || 0))
  }
  return null
}

const goToReports = () => {
  router.push('/reports')
}

const viewReport = (id) => {
  router.push(`/reports/${id}`)
}

onMounted(() => {
  fetchData()
})
</script>

<style lang="scss" scoped>
.dashboard {
  .stats-row {
    margin-bottom: 20px;
  }
  
  .best-fund, .worst-fund {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px;
    background: #f9f9f9;
    border-radius: 8px;
    
    .fund-info {
      .fund-code {
        font-weight: bold;
        margin-right: 10px;
        color: #409eff;
      }
      
      .fund-name {
        color: #606266;
      }
    }
  }
}
</style>

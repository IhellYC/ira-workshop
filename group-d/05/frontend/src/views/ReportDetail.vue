<template>
  <div class="report-detail">
    <div class="card" v-loading="loading">
      <div class="card-header">
        <h3>周报详情</h3>
        <div>
          <el-button type="primary" @click="analyzeReport" :loading="analyzing">
            <el-icon><MagicStick /></el-icon>
            AI分析
          </el-button>
          <el-button @click="goBack">返回列表</el-button>
        </div>
      </div>

      <!-- 基本信息 -->
      <el-descriptions title="基金信息" :column="3" border>
        <el-descriptions-item label="基金代码">{{ report.fund?.fund_code }}</el-descriptions-item>
        <el-descriptions-item label="基金名称">{{ report.fund?.fund_name }}</el-descriptions-item>
        <el-descriptions-item label="基金类型">{{ report.fund?.fund_type }}</el-descriptions-item>
      </el-descriptions>

      <el-descriptions title="周报数据" :column="3" border style="margin-top: 20px;">
        <el-descriptions-item label="报告日期">{{ formatDate(report.report_date) }}</el-descriptions-item>
        <el-descriptions-item label="周开始">{{ formatDate(report.week_start) }}</el-descriptions-item>
        <el-descriptions-item label="周结束">{{ formatDate(report.week_end) }}</el-descriptions-item>
        
        <el-descriptions-item label="周收益率">
          <span :class="getReturnClass(report.weekly_return)">
            {{ formatReturn(report.weekly_return) }}
          </span>
        </el-descriptions-item>
        <el-descriptions-item label="月收益率">
          <span :class="getReturnClass(report.monthly_return)">
            {{ formatReturn(report.monthly_return) }}
          </span>
        </el-descriptions-item>
        <el-descriptions-item label="年收益率">
          <span :class="getReturnClass(report.ytd_return)">
            {{ formatReturn(report.ytd_return) }}
          </span>
        </el-descriptions-item>
        
        <el-descriptions-item label="最大回撤">{{ formatReturn(report.max_drawdown) }}</el-descriptions-item>
        <el-descriptions-item label="波动率">{{ formatReturn(report.volatility) }}</el-descriptions-item>
        <el-descriptions-item label="夏普比率">{{ report.sharpe_ratio || '-' }}</el-descriptions-item>
        
        <el-descriptions-item label="资产规模">{{ report.total_assets ? `${report.total_assets}亿` : '-' }}</el-descriptions-item>
        <el-descriptions-item label="资产变动">{{ formatReturn(report.asset_change) }}</el-descriptions-item>
      </el-descriptions>

      <!-- AI分析结果 -->
      <div v-if="report.ai_summary" class="ai-section">
        <h4>AI分析</h4>
        <el-row :gutter="20">
          <el-col :span="16">
            <div class="ai-summary">
              <div class="ai-label">AI分析摘要</div>
              <div class="ai-content">{{ report.ai_summary }}</div>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="ai-metrics">
              <div class="metric-item">
                <span class="label">情绪分析</span>
                <el-tag :type="getSentimentType(report.ai_sentiment)" size="large">
                  {{ getSentimentText(report.ai_sentiment) }}
                </el-tag>
              </div>
              <div class="metric-item">
                <span class="label">AI评分</span>
                <div class="score-display">
                  <span class="score-value">{{ report.ai_score || '-' }}</span>
                  <div class="score-bar">
                    <div 
                      class="score-fill" 
                      :style="{ 
                        width: `${report.ai_score}%`,
                        backgroundColor: getScoreColor(report.ai_score)
                      }"
                    />
                  </div>
                </div>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { reportApi } from '@/api'
import dayjs from 'dayjs'

const route = useRoute()
const router = useRouter()

const report = ref({})
const loading = ref(false)
const analyzing = ref(false)

const fetchReport = async () => {
  loading.value = true
  try {
    const data = await reportApi.get(route.params.id)
    report.value = data
  } catch (error) {
    console.error('获取周报详情失败:', error)
  } finally {
    loading.value = false
  }
}

const analyzeReport = async () => {
  analyzing.value = true
  try {
    const result = await reportApi.analyze(route.params.id)
    report.value = { ...report.value, ...result }
    ElMessage.success('AI分析完成')
  } catch (error) {
    console.error('AI分析失败:', error)
  } finally {
    analyzing.value = false
  }
}

const formatDate = (date) => {
  if (!date) return '-'
  return dayjs(date).format('YYYY-MM-DD')
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

const getScoreColor = (score) => {
  if (score >= 80) return '#67c23a'
  if (score >= 60) return '#409eff'
  if (score >= 40) return '#e6a23c'
  return '#f56c6c'
}

const goBack = () => {
  router.push('/reports')
}

onMounted(() => {
  fetchReport()
})
</script>

<style lang="scss" scoped>
.report-detail {
  .ai-section {
    margin-top: 20px;
    padding-top: 20px;
    border-top: 1px solid #eee;
    
    h4 {
      margin-bottom: 15px;
      color: #303133;
    }
  }
  
  .ai-metrics {
    background: #f9f9f9;
    padding: 15px;
    border-radius: 8px;
    
    .metric-item {
      margin-bottom: 15px;
      
      &:last-child {
        margin-bottom: 0;
      }
      
      .label {
        display: block;
        font-size: 12px;
        color: #909399;
        margin-bottom: 8px;
      }
    }
  }
}
</style>

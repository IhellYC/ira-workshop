<template>
  <div class="reports-page">
    <!-- 筛选栏 -->
    <div class="card">
      <el-row :gutter="20" align="middle">
        <el-col :span="6">
          <el-date-picker
            v-model="dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
            @change="fetchReports"
          />
        </el-col>
        <el-col :span="6" :offset="12" style="text-align: right;">
          <el-button type="primary" @click="showAddDialog">
            <el-icon><Plus /></el-icon>
            创建周报
          </el-button>
        </el-col>
      </el-row>
    </div>

    <!-- 周报列表 -->
    <div class="card">
      <el-table :data="reports" style="width: 100%" v-loading="loading">
        <el-table-column label="基金代码" width="100">
          <template #default="{ row }">
            {{ row.fund?.fund_code }}
          </template>
        </el-table-column>
        <el-table-column label="基金名称" min-width="150">
          <template #default="{ row }">
            {{ row.fund?.fund_name }}
          </template>
        </el-table-column>
        <el-table-column label="报告日期" width="120">
          <template #default="{ row }">
            {{ formatDate(row.report_date) }}
          </template>
        </el-table-column>
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
        <el-table-column label="最大回撤" width="100">
          <template #default="{ row }">
            {{ formatReturn(row.max_drawdown) }}
          </template>
        </el-table-column>
        <el-table-column label="AI情绪" width="90">
          <template #default="{ row }">
            <el-tag 
              v-if="row.ai_sentiment"
              :type="getSentimentType(row.ai_sentiment)" 
              size="small"
            >
              {{ getSentimentText(row.ai_sentiment) }}
            </el-tag>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column label="AI评分" width="80">
          <template #default="{ row }">
            {{ row.ai_score || '-' }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template #default="{ row }">
            <el-button type="primary" link @click="viewReport(row.id)">详情</el-button>
            <el-button type="primary" link @click="analyzeReport(row.id)" :loading="analyzingId === row.id">
              AI分析
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :total="total"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next"
        @size-change="fetchReports"
        @current-change="fetchReports"
        style="margin-top: 20px; justify-content: flex-end;"
      />
    </div>

    <!-- 添加周报弹窗 -->
    <el-dialog v-model="dialogVisible" title="创建周报" width="600px">
      <el-form :model="form" label-width="100px">
        <el-form-item label="基金" required>
          <el-select v-model="form.fund_id" filterable placeholder="选择基金">
            <el-option
              v-for="fund in funds"
              :key="fund.id"
              :label="`${fund.fund_code} - ${fund.fund_name}`"
              :value="fund.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="报告日期" required>
          <el-date-picker v-model="form.report_date" type="date" />
        </el-form-item>
        <el-form-item label="周开始日期">
          <el-date-picker v-model="form.week_start" type="date" />
        </el-form-item>
        <el-form-item label="周结束日期">
          <el-date-picker v-model="form.week_end" type="date" />
        </el-form-item>
        <el-form-item label="周收益率(%)">
          <el-input-number v-model="form.weekly_return" :precision="2" />
        </el-form-item>
        <el-form-item label="月收益率(%)">
          <el-input-number v-model="form.monthly_return" :precision="2" />
        </el-form-item>
        <el-form-item label="年收益率(%)">
          <el-input-number v-model="form.ytd_return" :precision="2" />
        </el-form-item>
        <el-form-item label="最大回撤(%)">
          <el-input-number v-model="form.max_drawdown" :precision="2" />
        </el-form-item>
        <el-form-item label="波动率(%)">
          <el-input-number v-model="form.volatility" :precision="2" />
        </el-form-item>
        <el-form-item label="夏普比率">
          <el-input-number v-model="form.sharpe_ratio" :precision="2" />
        </el-form-item>
        <el-form-item label="资产规模(亿)">
          <el-input-number v-model="form.total_assets" :precision="2" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitForm">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { reportApi, fundApi } from '@/api'
import dayjs from 'dayjs'

const router = useRouter()

const reports = ref([])
const funds = ref([])
const loading = ref(false)
const currentPage = ref(1)
const pageSize = ref(20)
const total = ref(0)
const dateRange = ref(null)
const dialogVisible = ref(false)
const analyzingId = ref(null)

const form = ref({
  fund_id: null,
  report_date: null,
  week_start: null,
  week_end: null,
  weekly_return: null,
  monthly_return: null,
  ytd_return: null,
  max_drawdown: null,
  volatility: null,
  sharpe_ratio: null,
  total_assets: null
})

const fetchReports = async () => {
  loading.value = true
  try {
    const params = {
      skip: (currentPage.value - 1) * pageSize.value,
      limit: pageSize.value
    }
    
    if (dateRange.value) {
      params.start_date = dateRange.value[0]
      params.end_date = dateRange.value[1]
    }
    
    const data = await reportApi.getList(params)
    reports.value = data
    total.value = data.length
  } catch (error) {
    console.error('获取周报列表失败:', error)
  } finally {
    loading.value = false
  }
}

const fetchFunds = async () => {
  try {
    const data = await fundApi.getList({ limit: 1000 })
    funds.value = data
  } catch (error) {
    console.error('获取基金列表失败:', error)
  }
}

const showAddDialog = () => {
  form.value = {
    fund_id: null,
    report_date: new Date(),
    week_start: null,
    week_end: null,
    weekly_return: null,
    monthly_return: null,
    ytd_return: null,
    max_drawdown: null,
    volatility: null,
    sharpe_ratio: null,
    total_assets: null
  }
  dialogVisible.value = true
}

const submitForm = async () => {
  if (!form.value.fund_id || !form.value.report_date) {
    ElMessage.warning('请选择基金和报告日期')
    return
  }
  
  try {
    await reportApi.create(form.value)
    ElMessage.success('创建成功')
    dialogVisible.value = false
    fetchReports()
  } catch (error) {
    console.error('创建失败:', error)
  }
}

const analyzeReport = async (id) => {
  analyzingId.value = id
  try {
    await reportApi.analyze(id)
    ElMessage.success('AI分析完成')
    fetchReports()
  } catch (error) {
    console.error('分析失败:', error)
  } finally {
    analyzingId.value = null
  }
}

const viewReport = (id) => {
  router.push(`/reports/${id}`)
}

const formatDate = (date) => {
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

onMounted(() => {
  fetchReports()
  fetchFunds()
})
</script>

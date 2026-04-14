<template>
  <div class="fund-detail">
    <div class="card" v-loading="loading">
      <div class="card-header">
        <h3>基金详情</h3>
        <el-button @click="goBack">返回列表</el-button>
      </div>
      
      <el-descriptions :column="3" border>
        <el-descriptions-item label="基金代码">{{ fund.fund_code }}</el-descriptions-item>
        <el-descriptions-item label="基金名称">{{ fund.fund_name }}</el-descriptions-item>
        <el-descriptions-item label="基金类型">{{ fund.fund_type || '-' }}</el-descriptions-item>
        <el-descriptions-item label="基金公司">{{ fund.fund_company || '-' }}</el-descriptions-item>
        <el-descriptions-item label="基金经理">{{ fund.fund_manager || '-' }}</el-descriptions-item>
        <el-descriptions-item label="最新净值">{{ fund.nav || '-' }}</el-descriptions-item>
      </el-descriptions>
    </div>

    <!-- 历史周报 -->
    <div class="card">
      <div class="card-header">
        <h3>历史周报</h3>
      </div>
      
      <el-table :data="reports" style="width: 100%">
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
        <el-table-column label="夏普比率" width="100">
          <template #default="{ row }">
            {{ row.sharpe_ratio || '-' }}
          </template>
        </el-table-column>
        <el-table-column label="AI评分" width="80">
          <template #default="{ row }">
            {{ row.ai_score || '-' }}
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
import { useRoute, useRouter } from 'vue-router'
import { fundApi } from '@/api'
import dayjs from 'dayjs'

const route = useRoute()
const router = useRouter()

const fund = ref({})
const reports = ref([])
const loading = ref(false)

const fetchData = async () => {
  loading.value = true
  try {
    const [fundData, reportsData] = await Promise.all([
      fundApi.get(route.params.id),
      fundApi.getReports(route.params.id)
    ])
    fund.value = fundData
    reports.value = reportsData
  } catch (error) {
    console.error('获取数据失败:', error)
  } finally {
    loading.value = false
  }
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

const viewReport = (id) => {
  router.push(`/reports/${id}`)
}

const goBack = () => {
  router.push('/funds')
}

onMounted(() => {
  fetchData()
})
</script>

<template>
  <div class="funds-page">
    <!-- 搜索和操作栏 -->
    <div class="card">
      <el-row :gutter="20" align="middle">
        <el-col :span="8">
          <el-input 
            v-model="searchKeyword" 
            placeholder="搜索基金代码或名称"
            clearable
            @keyup.enter="handleSearch"
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
        </el-col>
        <el-col :span="8">
          <el-select v-model="filterType" placeholder="基金类型" clearable @change="fetchFunds">
            <el-option label="全部" value="" />
            <el-option label="股票型" value="股票型" />
            <el-option label="债券型" value="债券型" />
            <el-option label="混合型" value="混合型" />
            <el-option label="指数型" value="指数型" />
            <el-option label="货币型" value="货币型" />
            <el-option label="QDII" value="QDII" />
          </el-select>
        </el-col>
        <el-col :span="8" style="text-align: right;">
          <el-button type="primary" @click="showAddDialog">
            <el-icon><Plus /></el-icon>
            添加基金
          </el-button>
        </el-col>
      </el-row>
    </div>

    <!-- 基金列表 -->
    <div class="card">
      <el-table :data="funds" style="width: 100%" v-loading="loading">
        <el-table-column prop="fund_code" label="基金代码" width="100" />
        <el-table-column prop="fund_name" label="基金名称" min-width="180" />
        <el-table-column prop="fund_type" label="类型" width="100" />
        <el-table-column prop="fund_company" label="基金公司" width="150" />
        <el-table-column prop="fund_manager" label="基金经理" width="100" />
        <el-table-column label="最新净值" width="100">
          <template #default="{ row }">
            {{ row.nav || '-' }}
          </template>
        </el-table-column>
        <el-table-column label="状态" width="80">
          <template #default="{ row }">
            <el-tag :type="row.is_active ? 'success' : 'info'" size="small">
              {{ row.is_active ? '活跃' : '停用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template #default="{ row }">
            <el-button type="primary" link @click="viewFund(row.id)">详情</el-button>
            <el-button type="primary" link @click="editFund(row)">编辑</el-button>
            <el-button type="danger" link @click="deleteFund(row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :total="total"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next"
        @size-change="fetchFunds"
        @current-change="fetchFunds"
        style="margin-top: 20px; justify-content: flex-end;"
      />
    </div>

    <!-- 添加/编辑弹窗 -->
    <el-dialog 
      v-model="dialogVisible" 
      :title="isEdit ? '编辑基金' : '添加基金'"
      width="500px"
    >
      <el-form :model="form" label-width="100px">
        <el-form-item label="基金代码" required>
          <el-input v-model="form.fund_code" :disabled="isEdit" />
        </el-form-item>
        <el-form-item label="基金名称" required>
          <el-input v-model="form.fund_name" />
        </el-form-item>
        <el-form-item label="基金类型">
          <el-select v-model="form.fund_type" placeholder="请选择">
            <el-option label="股票型" value="股票型" />
            <el-option label="债券型" value="债券型" />
            <el-option label="混合型" value="混合型" />
            <el-option label="指数型" value="指数型" />
            <el-option label="货币型" value="货币型" />
            <el-option label="QDII" value="QDII" />
            <el-option label="其他" value="其他" />
          </el-select>
        </el-form-item>
        <el-form-item label="基金公司">
          <el-input v-model="form.fund_company" />
        </el-form-item>
        <el-form-item label="基金经理">
          <el-input v-model="form.fund_manager" />
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
import { ElMessage, ElMessageBox } from 'element-plus'
import { fundApi } from '@/api'

const router = useRouter()

const funds = ref([])
const loading = ref(false)
const currentPage = ref(1)
const pageSize = ref(20)
const total = ref(0)
const searchKeyword = ref('')
const filterType = ref('')
const dialogVisible = ref(false)
const isEdit = ref(false)
const editId = ref(null)

const form = ref({
  fund_code: '',
  fund_name: '',
  fund_type: '',
  fund_company: '',
  fund_manager: ''
})

const fetchFunds = async () => {
  loading.value = true
  try {
    const data = await fundApi.getList({
      skip: (currentPage.value - 1) * pageSize.value,
      limit: pageSize.value,
      fund_type: filterType.value || undefined,
      is_active: true
    })
    funds.value = data
    total.value = data.length
  } catch (error) {
    console.error('获取基金列表失败:', error)
  } finally {
    loading.value = false
  }
}

const handleSearch = async () => {
  if (!searchKeyword.value.trim()) {
    fetchFunds()
    return
  }
  
  loading.value = true
  try {
    const data = await fundApi.search(searchKeyword.value)
    funds.value = data
    total.value = data.length
  } catch (error) {
    console.error('搜索失败:', error)
  } finally {
    loading.value = false
  }
}

const showAddDialog = () => {
  isEdit.value = false
  editId.value = null
  form.value = {
    fund_code: '',
    fund_name: '',
    fund_type: '',
    fund_company: '',
    fund_manager: ''
  }
  dialogVisible.value = true
}

const editFund = (fund) => {
  isEdit.value = true
  editId.value = fund.id
  form.value = {
    fund_code: fund.fund_code,
    fund_name: fund.fund_name,
    fund_type: fund.fund_type,
    fund_company: fund.fund_company,
    fund_manager: fund.fund_manager
  }
  dialogVisible.value = true
}

const submitForm = async () => {
  if (!form.value.fund_code || !form.value.fund_name) {
    ElMessage.warning('请填写基金代码和名称')
    return
  }
  
  try {
    if (isEdit.value) {
      await fundApi.update(editId.value, form.value)
      ElMessage.success('更新成功')
    } else {
      await fundApi.create(form.value)
      ElMessage.success('添加成功')
    }
    dialogVisible.value = false
    fetchFunds()
  } catch (error) {
    console.error('保存失败:', error)
  }
}

const deleteFund = async (id) => {
  try {
    await ElMessageBox.confirm('确定要删除该基金吗？', '提示', {
      type: 'warning'
    })
    await fundApi.delete(id)
    ElMessage.success('删除成功')
    fetchFunds()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除失败:', error)
    }
  }
}

const viewFund = (id) => {
  router.push(`/funds/${id}`)
}

onMounted(() => {
  fetchFunds()
})
</script>

import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Dashboard',
    component: () => import('@/views/Dashboard.vue')
  },
  {
    path: '/funds',
    name: 'Funds',
    component: () => import('@/views/Funds.vue')
  },
  {
    path: '/funds/:id',
    name: 'FundDetail',
    component: () => import('@/views/FundDetail.vue')
  },
  {
    path: '/reports',
    name: 'Reports',
    component: () => import('@/views/Reports.vue')
  },
  {
    path: '/reports/:id',
    name: 'ReportDetail',
    component: () => import('@/views/ReportDetail.vue')
  },
  {
    path: '/search',
    name: 'Search',
    component: () => import('@/views/Search.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router

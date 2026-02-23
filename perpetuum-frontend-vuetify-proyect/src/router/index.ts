import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import PublicLayout from '@/views/PublicLayout.vue'
import Home from '@/views/Home.vue'
import MemorialDetail from '@/views/MemorialDetail.vue'
import AdminLayout from '@/views/AdminLayout.vue'
import Dashboard from '@/views/Dashboard.vue'
import DeceasedList from '@/views/DeceasedList.vue'

const routes: RouteRecordRaw[] = [
  // Ruta Pública (Buscador)
  {
    path: '/',
    component: PublicLayout,
    children: [
      {
        path: '',
        component: Home
      },
      {
        path: 'memorial/:id',
        component: MemorialDetail,
        props: true
      }
    ]
  },
  // Ruta Privada (Dashboard)
  {
    path: '/admin',
    component: AdminLayout,
    children: [
      {
        path: 'dashboard',
        component: Dashboard
      },
      {
        path: 'deceased',
        component: DeceasedList
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router

import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

const routes = [
  // 1. RUTAS PÚBLICAS
  {
    path: '/',
    component: () => import('@/layouts/PublicLayout.vue'), //Cuando el usuario entra a /, se carga PublicLayout.vue. Dentro de ese layout, se renderizan las rutas hijas:
    children: [
      { path: '', component: () => import('@/views/public/HomeView.vue') },
      { path: 'memorial/:id', component: () => import('@/views/public/MemorialDetailView.vue'), props: true } //props en true sirve para que el componente pueda recibir parámetor de la ruta dinámica
    ]
  },
  // 2. RUTAS DE AUTENTICACIÓN
  {
    path: '/login',
    component: () => import('@/layouts/BlankLayout.vue'),
    children: [
      { path: '', component: () => import('@/views/auth/LoginView.vue') }
    ]
  },
  // 3. RUTAS ADMIN (B2B)
  {
    path: '/admin',
    component: () => import('@/layouts/AdminLayout.vue'),
    children: [
      { path: 'dashboard', component: () => import('@/views/admin/DashboardView.vue') }, 
      { path: 'deceased', component: () => import('@/views/admin/DeceasedCrudView.vue') },
      { path: 'staff', component: () => import('@/views/admin/StaffCrudView.vue') },
      { path: 'memories', component: () => import('@/views/admin/AdminMemoriesView.vue') },
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// --- APUNTES TEÓRICOS: NAVIGATION GUARD ---
// Este código se ejecuta CADA VEZ que el usuario intenta cambiar de página.
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  // Verificamos si la ruta de destino (o alguna de sus padres) tiene meta: requiresAuth
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)

  if (requiresAuth && !authStore.isLoggedIn) {
    // Si la ruta es privada y no hay token: al Login
    next({ name: 'Login' })
  } else if (to.name === 'Login' && authStore.isLoggedIn) {
    // Si ya está logueado y trata de ir al Login: lo mandamos al Dashboard
    next({ name: 'AdminDashboard' })
  } else {
    // En cualquier otro caso: puede pasar
    next()
  }
})

export default router


/*
Apuntes: 
createRouter es la función que construye el router.
Aquí le dices:
qué tipo de historial usar
qué rutas tendrá tu app
El resultado es un objeto router que Vue usará para navegar entre páginas.


createWebHistory() usa el HTML5 History API, lo que significa: URLs limpias solo con /, sin caracteres raros


export default --> Esto hace que el router esté disponible para importarlo en tu main.js:


En router/index.ts, uso rutas anidadas (children). Cuando voy a /admin/deceased, el Router dice:
"Primero cargo el AdminLayout". --> "Dentro del AdminLayout, busco el hueco <router-view /> y ahí meto la vista DeceasedCrudView". --> si cambio algo en el layout se aplica. atodos (ej. color del sidebar)
*/
import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router' //routerecordraw es para que  TypeScript reconozca correctamente la estructura de las rutas de Vue Router.
import { useAuthStore } from '@/stores/authStore'

const routes: RouteRecordRaw[] = [
  // 1. RUTAS PÚBLICAS
  {
    path: '/',
    component: () => import('@/layouts/PublicLayout.vue'), //Cuando el usuario entra a /, se carga PublicLayout.vue. Dentro de ese layout, se renderizan las rutas hijas:
    children: [
      { path: '', name: 'Home', component: () => import('@/views/public/HomeView.vue') },
      { path: 'memorial/:id', component: () => import('@/views/public/MemorialDetailView.vue'), props: true } //props en true sirve para que el componente pueda recibir parámetor de la ruta dinámica
    ]
  },
  // 2. RUTAS DE AUTENTICACIÓN
  {
    path: '/login',
    component: () => import('@/layouts/BlankLayout.vue'),
    children: [
      { path: '', name: 'Login', component: () => import('@/views/auth/LoginView.vue') }
    ]
  },
  {
    path: '/register',
    component: () => import('@/layouts/BlankLayout.vue'),
    children: [
      { path: '', name: 'Register', component: () => import('@/views/auth/RegisterView.vue') }
    ]
  },
  // 3. RUTAS ADMIN (B2B)
  {
    path: '/admin',
    component: () => import('@/layouts/AdminLayout.vue'),
    // Admin y Staff pueden acceder
    meta: { requiresAuth: true, roles: ['Admin', 'Staff'] },
    children: [
      { path: 'dashboard', name: 'AdminDashboard', component: () => import('@/views/admin/DashboardView.vue') }, 
      { path: 'deceased', name: 'AdminDeceased', component: () => import('@/views/admin/DeceasedCrudView.vue') },    //crud 1 entidad
      { path: 'guardians', name: 'AdminGuardians', component: () => import('@/views/admin/GuardianCrudView.vue') },   //crud 2 entidad
      { path: 'staff', name: 'AdminStaff', component: () => import('@/views/admin/StaffCrudView.vue') },
      { path: 'memories', name: 'AdminMemories', component: () => import('@/views/admin/AdminMemoriesView.vue') },
    ]
  },

  {
    path: '/guardian',
    component: () => import('@/layouts/GuardianLayout.vue'),
    meta: { requiresAuth: true, roles: ['Guardian'] },
    children: [
      { path: '', redirect: { name: 'GuardianMyMemorials' } },
      { path: 'home', redirect: { name: 'GuardianMyMemorials' } },
      { path: 'my-memorials', name: 'GuardianMyMemorials', component: () => import('@/views/guardian/MyMemorialsView.vue') },
      { path: 'moderation', name: 'GuardianModeration', component: () => import('@/views/guardian/ModerationView.vue') }
    ]
  },
  // Ruta para accesos no autorizados
  {
    path: '/unauthorized',
    name: 'Unauthorized',
    component: () => import('@/views/public/UnauthorizedView.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// --- APUNTES TEÓRICOS: NAVIGATION GUARD ---
//  se ejecuta CADA VEZ que el usuario intenta cambiar de página.
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  // Verificamos si  ruta de destino o  sus padres tiene meta: requiresAuth
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  // Verificamos si la ruta pide roles específicos
  const allowedRoles = to.matched.find(record => record.meta.roles)?.meta.roles as string[] | undefined

  if (requiresAuth && !authStore.isLoggedIn) {
    // Si la ruta es privada y no hay token: al Login
    next({ name: 'Login' })
  } 
  else if ((to.name === 'Login' || to.name === 'Register') && authStore.isLoggedIn) {
    // Si ya está logueado y trata de ir al Login/Register: redirigir según rol
    const role = authStore.user?.role
    if (role === 'Admin' || role === 'Staff') {
      next({ name: 'AdminDashboard' })
    } else if (role === 'Guardian') {
      next({ name: 'GuardianMyMemorials' })
    } else {
      next({ name: 'Home' })
    }
  }
  // Control de seguridad por Roles
  else if (allowedRoles && authStore.user?.role) {
    if (!allowedRoles.includes(authStore.user.role)) {
      next({ name: 'Unauthorized' })
    } else {
      next()
    }
  }
  else {
    next()//  puede pasar -> sigue hacia to.path
  }
})

export default router

/*
Apuntes: 
createRouter es la función que construye el router.
Aquí le digo:
qué tipo de historial usar
qué rutas tendrá tu app
El resultado es un objeto router que Vue usará para navegar entre páginas.

createWebHistory() usa el HTML5 History API, lo que significa: URLs limpias solo con /, sin caracteres raros

export default --> Esto hace que el router esté disponible para importarlo en tu main.js:

En router/index.ts, uso rutas anidadas (children). Cuando voy a /admin/deceased, el Router dice:
"Primero cargo el AdminLayout". --> "Dentro del AdminLayout, busco el hueco <router-view /> y ahí meto la vista DeceasedCrudView". --> si cambio algo en el layout se aplica. atodos (ej. color del sidebar)
*/

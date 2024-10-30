import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '@/pages/Dashboard.vue'
import Login from '@/pages/Login.vue'
import Teste from '@/pages/teste.vue'  // Arquivo Teste.vue
import TesteDash from '@/pages/testedash.vue'  // Arquivo TesteDash.vue

const routes = [
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/teste',  // Defina a rota para o arquivo Teste.vue
    name: 'Teste',
    component: Teste
  },
  {
    path: '/testedash',  // Defina a rota para o arquivo TesteDash.vue
    name: 'TesteDash',
    component: TesteDash
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router

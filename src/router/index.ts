import { createRouter, createWebHistory } from "vue-router";
// import Dashboard from '@/pages/Dashboard.vue'
import Login from "@/pages/Login.vue";
import Teste from "@/pages/teste.vue";
// import TesteDash from '@/pages/testedash.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // {
    //   path: '/dashboard',
    //   name: 'Dashboard',
    //   component: Dashboard
    // },
    {
      path: "/",
      name: "Login",
      component: Login,
    },
    {
      path: "/teste", // Defina a rota para o arquivo Teste.vue
      name: "Teste",
      component: Teste,
    },
    // {
    //   path: '/testedash',  // Defina a rota para o arquivo TesteDash.vue
    //   name: 'TesteDash',
    //   component: TesteDash
    // }
  ],
});

export default router;

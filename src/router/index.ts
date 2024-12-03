import { createRouter, createWebHistory } from "vue-router";
import Login from "@/pages/Login.vue";
import Teste from "@/pages/teste.vue";
import Dashboard from "@/pages/Dashboard.vue"; // Descomentei a importação do Dashboard
import Library from "@/pages/Library.vue";
import Perfil from "@/pages/Perfil.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
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
    {
      path: "/dashboard", // Defina a rota para o arquivo Dashboard.vue
      name: "Dashboard",
      component: Dashboard,
    },
    {
      path: "/perfil", // Defina a rota para o arquivo Dashboard.vue
      name: "Perfil",
      component: Perfil,
    },
    {
      path: '/library',
      name: 'Library',
      component: Library,
    },
 
  ],
});

export default router;

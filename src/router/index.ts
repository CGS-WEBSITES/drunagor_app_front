import { createRouter, createWebHistory } from "vue-router";
import Login from "@/pages/Login.vue";
import Dashboard from "@/pages/Dashboard.vue"; // Descomentei a importação do Dashboard
import Library from "@/pages/Library.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/login",
      name: "Login",
      component: Login,
    },
  
    {
      path: "/dashboard", // Defina a rota para o arquivo Dashboard.vue
      name: "Dashboard",
      component: Dashboard,
    },
    
   
    {
      path: '/library',
      name: 'Library',
      component: Library,
    },
 
  ],
});

export default router;

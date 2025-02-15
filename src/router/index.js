import { createRouter, createWebHistory } from "vue-router";
import ModelViewer from "../views/ModelViewer.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: ModelViewer,
    },
  ],
});

export default router;

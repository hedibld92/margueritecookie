import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/HomeView.vue')
    },
    {
      path: '/boutique',
      name: 'boutique',
      component: () => import('@/views/BoutiqueView.vue')
    },
    {
      path: '/contact',
      name: 'contact',
      component: () => import('@/views/ContactView.vue')
    },
    {
      path: '/panier',
      name: 'panier',
      component: () => import('@/views/PanierView.vue')
    }
  ]
})

export default router 
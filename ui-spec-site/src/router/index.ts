import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue')
  },
  {
    path: '/form-demo',
    name: 'FormDemo',
    component: () => import('../views/FormDemo.vue')
  },
  {
    path: '/list-demo',
    name: 'ListDemo',
    component: () => import('../views/ListDemo.vue')
  },
  {
    path: '/dialog-demo',
    name: 'DialogDemo',
    component: () => import('../views/DialogDemo.vue')
  },
  {
    path: '/feedback-demo',
    name: 'FeedbackDemo',
    component: () => import('../views/FeedbackDemo.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router

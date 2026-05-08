import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
  },
  {
    path: '/account',
    name: 'account',
    component: () => import('../views/AccountView.vue'),
  },
  {
    path: '/characters',
    name: 'characters',
    component: () => import('../views/CharactersView.vue'),
  },
  {
    path: '/items',
    name: 'items',
    component: () => import('../views/ItemsView.vue'),
  },
  {
    path: '/wvw',
    name: 'wvw',
    component: () => import('../views/WvwView.vue'),
  },
  {
    path: '/maps',
    name: 'maps',
    component: () => import('../views/MapsView.vue'),
  },
  {
    path: '/inventory',
    name: 'inventory',
    component: () => import('../views/InventoryView.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router

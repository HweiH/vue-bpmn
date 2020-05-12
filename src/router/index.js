import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/new',
    name: 'New',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import('../views/New.vue')
  },
  {
    path: '/new2',
    name: 'New2',
    component: () => import('../views/New2.vue')
  },
  {
    path: '/new3',
    name: 'New3',
    component: () => import('../views/New3.vue')
  },
  {
    path: '/view',
    name: 'View',
    component: () => import('../views/View.vue')
  }
]

const router = new VueRouter({
  routes
})

export default router

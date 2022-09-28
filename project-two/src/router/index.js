import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'
import NotFoundView from '../views/NotFoundView'

import {auth} from "@/firebaseConfig.js"


Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'welcome',
    component: () => import(/* webpackChunkName: "about" */ '../views/SplashView.vue')
  },
  {
    path: '/home',
    name: 'home',
    meta: { // connects with the function later in this file.
      requiresAuth: true
    },
    component: HomeView
  },
  {
    path: '/habit/:id',
    name: 'oneHabit',
    meta: {
      requiresAuth: true
    },
    props: true,
    component: () => import('../views/OneHabitView.vue')
  },
  {
    path: '/category/:id',
    name: 'oneCategory',
    meta: {
      requiresAuth: true
    },
    props: true,
    component: () => import('../views/CategoryView.vue')
  },
  {
    path: '/stats',
    name: 'stats',
    meta: { // connects with the function later in this file.
      requiresAuth: true
    },
    component: () => import(/* webpackChunkName: "about" */ '../views/StatsView.vue')
  },
  {
    path: '/habitStats/:id',
    name: 'habitStats',
    meta: { // connects with the function later in this file.
      requiresAuth: true
    },
    component: () => import(/* webpackChunkName: "about" */ '../views/OneHabitView.vue')
  },  
  {
    path: '/organize',
    name: 'organize',
    meta: { // connects with the function later in this file.
      requiresAuth: true
    },
    component: () => import(/* webpackChunkName: "about" */ '../views/OrganizeHabitsView.vue')
  },
  {
    path: '/*',
    name: '404',
    component: NotFoundView
  }

]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})


router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(x => x.meta.requiresAuth)

  if (requiresAuth && !auth.currentUser) {
    next('/')
    // could also just fire off a redirect login here, or redirect based on a meta property!
  } else {
    next()
  }
})

export default router
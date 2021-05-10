import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import Dashboard from '@/views/Dashboard.vue'
import Accounts from '@/views/Accounts.vue'
import AccountDetails from '@/views/AccountDetails.vue'
import Login from '@/views/Login.vue'
import firebase from 'firebase'

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/accounts',
    name: 'Accounts',
    component: () => import('../views/Accounts.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/accounts/:id',
    name: 'AccountDetails',
    component: () => import('../views/AccountDetails.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '*',
    redirect: 'Dashboard'
  }
];


const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

/* Checking user authentication before each route */
router.beforeEach((to, from, next) => {
  next();
  if (to.meta?.requiresAuth) {
    if (!firebase.auth().currentUser) {
      next({
        name: 'Login'
      });
    } else {
      next();
    }
  } else {
    if (firebase.auth().currentUser) {
      next({
        name: 'Dashboard'
      });
    } else {
      next();
    }
  }
})

export default router

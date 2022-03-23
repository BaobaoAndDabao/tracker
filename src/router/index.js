import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../components/Home.vue'
import Tasks from '../components/Tasks.vue'
import Intercept from '../components/Intercept.vue'

import Login from '../components/Login.vue'
import VueClipboard from 'vue-clipboard2'

Vue.use(VueRouter)
Vue.use(VueClipboard)

const routes = [
  { path: '/', redirect: '/home' },
  { path: '/login', component: Login },
  { path: '/home', component: Home },
  {
    path: '/home',
    component: Home,
    redirect: '/tasks',
    children: [
      { path: '/tasks', component: Tasks },{ path: '/intercept', component: Intercept }
    ]
  }
]

const router = new VueRouter({
  routes
})
router.beforeEach((to, from, next) => {
  console.log(to)
  /* 如果是登陆页面,直接放行 */
  if (to.path === '/login') {
    next()
    return
  }
  // // 如果不是登陆页面,看下本地是否存在token.
  const token = window.sessionStorage.getItem('token')
  if (!token) {
    // 如果token不存在,就调登录页登陆
    return next('/login')
  }
  next()
})
export default router

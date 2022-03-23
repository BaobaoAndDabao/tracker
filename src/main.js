import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'

// 在编译的入口文件出引入全局样式表  组件自己的样式由组件自己决定
import './assets/css/global.css'
import './assets/iconfonts/iconfont.css'
import './assets/font-awesome-4.7.0/css/font-awesome.min.css'
import axios from 'axios'
import baseUrl from './setBaseUrl'

// axios.defaults.baseURL = 'http://127.0.0.1:8080/'

console.log(baseUrl)
axios.defaults.baseURL = baseUrl
axios.interceptors.request.use(config => {
  config.headers.token = window.sessionStorage.getItem('token')
  return config
})

// **路由响应拦截**
// http response 拦截器
axios.interceptors.response.use(
  response => {
    console.log(response)
    if (response.data.status === 'not login') {
      //      cookie.del("ticket")
      // window.location.href='http://xxx.login.com';
      router.push('/login')
      return response
    } else {
      return response
    }
  },
  error => {
    return Promise.reject(error.response) // 返回接口返回的错误信息
  })
Vue.prototype.$http = axios

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')

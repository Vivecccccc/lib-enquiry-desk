// import {Vue} from 'vue'
import {createRouter, createWebHistory} from 'vue-router'
import Login from '../components/Login/Login.vue'
import Layout from '../views/Layout.vue'
import axios from 'axios'

// Vue.use(VueRouter)
async function validate_auth() {
  try {
    const resp = await axios.get('http://127.0.0.1:8000/auth_is_valid', {withCredentials: true})
    return true
  }
  catch(err) {
    return false
  }
}

const routes = [
  { path: '/login', component: Login },
  { path: '/main', component: Layout },
  {
    path: '/',
    component: Layout,
  },
]

const router = createRouter({
  // 4. 内部提供了 history 模式的实现。为了简单起见，我们在这里使用 hash 模式。
  history: createWebHistory(),
  routes, // `routes: routes` 的缩写
})

router.beforeEach(async (to, from) => {
  if (to.path !== "/login") {
    const isAuthValid = await validate_auth()
    if (!isAuthValid) return "/login"
  }
}) 

export default router


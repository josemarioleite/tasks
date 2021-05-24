import Home from 'src/pages/Index.vue'
import Login from 'src/pages/Login.vue'

const routes = [
  {
    name: 'home',
    path: '/home',
    component: Home
  },
  {
    name: 'login',
    path: '/',
    component: Login
  }
]

export default routes

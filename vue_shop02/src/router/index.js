import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import User from '../components/User.vue'
import Welcome from '../components/Welcome.vue'
import Rights from '../components/Rights.vue'
import Roles from '../components/Roles.vue'
import Categories from '../components/Categories.vue'
import Params from '../components/Params.vue'
import Goods from '../components/Goods.vue'
import addGoods from '../components/addGoods.vue'
import Orders from '../components/Orders.vue'
import Reports from '../components/Reports.vue'
Vue.use(VueRouter)

const routes = [
  {
    path:'/',
    redirect: '/login'
  },
  {
    path:'/login',
    component: Login
  },
  {
    path:'/home',
    redirect: '/welcome',
    component: Home,
    children:[
      {path:'/welcome',component:Welcome},
      {path:'/users',component:User},
      {path:'/rights',component:Rights},
      {path:'/roles',component:Roles},
      {path:'/categories',component:Categories},
      {path:'/params',component:Params},
      {path:'/goods',component:Goods},
      {path:'/goods/addgoods',component:addGoods},
      {path:'/orders',component:Orders},
      {path:'/reports',component:Reports}
    ]
  }
]

const router = new VueRouter({
  routes
})
 
  router.beforeEach((to,from,next) => {
    if(to.path === '/login') return next()
    const tokenStr = window.sessionStorage.getItem('token')
    if(!tokenStr) return next('/login')
    next()
  })

export default router

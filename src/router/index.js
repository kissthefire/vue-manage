/* eslint-disable */
import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login'
import Home from '../components/Home'
import Welcome from '../components/Welcome'
import Users from '../components/Users'
import Sales from '../components/Sales'
import Right from '../components/power/Right'
import Roles from '../components/power/Roles'
import Category from '../components/goods/Category'
import Params from '../components/goods/Params'
import Goods from '../components/goods/List'
import Add from '../components/goods/Add'
import Orders from '../components/order/Orders'
import Report from '../components/report/Report'
import Menus from '../components/power/Menus'
import RedisInfo from '../components/redis/RedisInfo'
import MenuIcon from '../components/power/MenuIcon'
import Blog from '../components/blog/Blog'
import BlogList from '../components/blog/BlogList'
import BlogAdd from '../components/blog/BlogAdd'




Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/home',
    component: Home,
    redirect:'/welcome',
    children:[
      {path:'/welcome',component:Welcome},
      {path:'/user',component:Users},
      {path:'/sales',component:Sales},
      {path:'/right',component:Right},
      {path:'/roles',component:Roles},
      {path:'/category',component:Category},
      {path:'/params',component:Params},
      {path:'/goods',component:Goods},
      {path:'/goods/add',component:Add},
      {path:'/orders',component:Orders},
      {path:'/report',component:Report},
      {path:'/menus',component:Menus},
      {path:'/redisInfo',component:RedisInfo},
      {path:'/menuIcon',component:MenuIcon},
      {path:'/blog',component:BlogList},
      {path:'/blogList',component:BlogList},
      {path:'/blog/blogAdd',component:BlogAdd},

    ]
  }
]

const router = new VueRouter({
  routes
})

//路由导航控制权限
router.beforeEach((to,from,next)=>{
  //如果用户访问登录页面，直接放行
  if(to.path==='/login') return next();
  //从session中获取保存的token值
  const tokenStr=window.sessionStorage.getItem('token')
  if(!tokenStr) return next("/login")
  next()
})


export default router

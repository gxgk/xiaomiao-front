import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '../views/Home.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/topic',
    name: 'Topic',
    meta: {
      title: '喵话题'
    },
    // route level code-splitting
    // this generates a separate chunk (topic.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "topic" */ '../views/topic/Topic.vue')
  },
  {
    path: '/topic/check',
    name: 'TopicCheck',
    meta: {
      title: '喵话题审核'
    },
    // route level code-splitting
    // this generates a separate chunk (topic.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "topic" */ '../views/topic/TopicCheck.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  // 路由发生变化修改页面title
  if (to.meta.title) {
    document.title = to.meta.title
  }
  next()
})

export default router

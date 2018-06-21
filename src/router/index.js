import Index from '@/views/index/index.vue'

export default [
  {
    path: '/:type/:index',
    name: 'Index',
    meta: {title: '笔记'},
    component: Index
  }
]

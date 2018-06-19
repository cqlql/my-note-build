// import Index from '@/hello2/Index.vue'
const Index = () => import(/* webpackChunkName: "hello2" */ '@//views/hello2/Index.vue')

export default [
  {
    path: '/hello2',
    alias: ['/helloIndex2'],
    name: 'HelloIndex2',
    meta: {title: 'HelloIndex2'},
    component: Index
  }
]

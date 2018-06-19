// import Index from '@/hello/Index.vue'
const Index = () => import(/* webpackChunkName: "hello" */ '@/views/hello/Index.vue')

export default [
  {
    path: '/hello',
    name: 'HelloIndex',
    meta: {title: 'HelloIndex'},
    component: Index
  }
]

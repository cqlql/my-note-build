import '@/comm.css'
import Vue from 'vue'
import router from './router'
import App from './App.vue'

import Loading from '@/components/loading/plugin'
import Toast from '@/components/toast/plugin'
import Confirm from '@/components/confirm/plugin'

Vue.use(Loading)
Vue.use(Toast)
Vue.use(Confirm)
const loading = Vue.loading

router.beforeEach((to, from, next) => {
  if (!to.name) {
    next({
      path: '/0/-1'
    })
  } else {
    loading.show()
    document.title = to.meta.title || ''
    next()
  }
})
router.afterEach(() => {
  loading.hide()
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  // 根实例用可实现替换绑定的元素
  template: '<app/>',
  components: {
    App
  }
})

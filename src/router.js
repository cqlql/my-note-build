import Vue from 'vue'
import Router from 'vue-router'

// 批量导入路由
let routes = []
function importAll (r) {
  r.keys().forEach(key => {
    routes = routes.concat(r(key).default)
  })
}

// 指定只打包具体 router
if (process.env.NODE_ENV === 'production') {
  // 正式环境
  importAll(require.context('./router', false, /(hello|hello2)\.js$/))
} else {
  // 开发环境
  importAll(require.context('./', true, /^\.\/router\/.+?\.js$|^\.\/nav-dev.js$/))
  // importAll(require.context('./', true, /^\.\/nav-dev.js$/))
}

// 404
routes.push(
  {
    path: '*',
    name: '404',
    meta: { title: '404', zIndex: 99 },
    component: {
      template: `<div style="height:200px;font-size:30px;display:flex;align-items:center;justify-content: center;">404：没有这个页面(⊙﹏⊙)</div>`
    }
  }
)

Vue.use(Router)

export default new Router({
  routes: routes
})

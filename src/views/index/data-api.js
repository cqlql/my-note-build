import scriptLoad from '@/modules/corejs/dom/script-load'
import Vue from 'vue'
const dataApi = {
  getMenu () {
    return new Promise((resolve, reject) => {
      Vue.loading.show()
      window.cb_menu_data = function (data) {
        Vue.loading.hide()
        resolve(data)
      }
      scriptLoad('./data/menu_data.js')
    })
  },
  getArticle (name) {
    return new Promise((resolve, reject) => {
      Vue.loading.show()
      window[`cb_${name}`] = function (data) {
        Vue.loading.hide()
        resolve(data)
      }
      scriptLoad(`./data/${name}.js`)
    })
  }
}

export default dataApi

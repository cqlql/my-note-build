import scriptLoad from '@/modules/corejs/dom/script-load'
import Vue from 'vue'

const windowCtrlKey = {
  bind () {
    this.fn = (e) => {
      if (e.keyCode === 17) {
        // excu(e.type === 'keydown')
        this.ctrlKeyDown = e.type === 'keydown'
      }
    }
    window.addEventListener('keydown', this.fn)
    window.addEventListener('keyup', this.fn)
  },
  unbind () {
    window.removeEventListener('keydown', this.fn)
    window.removeEventListener('keyup', this.fn)
  }
}

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
  },
  ctrlKeyBind: windowCtrlKey.bind,
  ctrlKeyUnbind: windowCtrlKey.unbind
}

export default dataApi

import scriptLoad from '@/modules/corejs/dom/script-load'
const dataApi = {
  getMenu () {
    return new Promise((resolve, reject) => {
      window.cb_menu_data = function (data) {
        resolve(data)
        // resolve(JSON.parse(data.data))
      }
      scriptLoad('./data/menu_data.js')
    })
  },
  getArticle (name) {
    return new Promise((resolve, reject) => {
      window[`cb_${name}`] = resolve
      scriptLoad(`./data/${name}.js`)
    })
  }
}

export default dataApi

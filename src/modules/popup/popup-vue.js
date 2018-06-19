import popup from './popup-single'
export default {
  install (Vue) {
    Vue.prototype.$popup = function (msg) {
      popup(msg)
    }
  }
}

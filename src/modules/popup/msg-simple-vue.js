import simpleMsg from './msg-simple'
export default {
  install (Vue) {
    Vue.prototype.$simpleMsg = function (msg) {
      simpleMsg(msg)
    }
  }
}

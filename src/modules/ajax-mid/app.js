import querystring from '@/modules/corejs/url/search-string'
import getServerGo from './get-server-go'
import excuIntervalTry from '@/modules/corejs/excu/excu-interval-try'
// if (process.env.NODE_ENV !== 'production') {
//   window.oa = {
//     CommonMethod (url, method, data, name) {
//       setTimeout(d => {
//         // window[name](mockData[url])
//       }, 1000)
//     }
//   }
// }
let id = 0
export default {
  get (url, {params} = {}) {
    return new Promise(function (resolve) {
      let name = '__cb' + id
      id++
      window[name] = function (d) {
        resolve({data: d})
        delete window[name]
      }
      let querystr = params ? '?' + querystring(params) : ''

      excuIntervalTry(() => {
        if (window.oa) {
          window.oa.CommonMethod(getServerGo(url) + querystr, 'GET', '', name)
          return false
        }
      })
    })
  },
  post (url, data) {
    return new Promise(function (resolve) {
      let name = '__cb' + id
      id++
      window[name] = function (d) {
        resolve({data: d})
        delete window[name]
      }
      excuIntervalTry(() => {
        if (window.oa) {
          window.oa.CommonMethod(getServerGo(url), 'POST', data ? JSON.stringify(data) : '', name)
          return false
        }
      })
    })
  }
}

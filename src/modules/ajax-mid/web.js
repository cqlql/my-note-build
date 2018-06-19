/* .net 接口 */
import querystring from '../querystring/querystring'
import axios from 'axios'

let proxyServer = '/Api/CommonMethod'
let interfaceServer = ''

if (process.env.NODE_ENV !== 'production') {
  interfaceServer = 'http://192.168.1.22:8117'
}

export default {
  get (url, {params} = {}) {
    if (params) {
      params = '?' + querystring(params)
    } else {
      params = ''
    }
    return axios.get(proxyServer, {
      params: {
        Url: interfaceServer + url + params,
        Type: 'Get'
      }
    })
  },
  post (url, data) {
    let config
    return axios.post(proxyServer, {
      Url: interfaceServer + url,
      Type: 'Post',
      params: JSON.stringify(data)
    }, config)
  }
}

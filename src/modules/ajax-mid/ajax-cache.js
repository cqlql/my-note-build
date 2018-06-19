import axios from '@/modules/ajax-mid/index'
import msgSimple from '@/modules/popup/msg-simple'
import preloaderFull from '@/modules/preloader-full/preloader-full'

let cacheData = {}
export default {
  get (url) {
    // 使用缓存
    let data = cacheData[url]
    if (data) {
      data._isCache = true
      return new Promise(function (resolve) {
        resolve(data)
      })
    }
    // 新的请求
    preloaderFull.show()
    return axios.get(url).then(({data}) => {
      if (data.status === 200) {
        cacheData[url] = data.result
        return (cacheData[url] = data.result)
      }
      return Promise.reject(new Error(data.message))
    }).catch(e => {
      msgSimple(e)
    }).then(data => {
      preloaderFull.close()
      return data
    })
  },

  request () {},

  clear (url) {
    delete cacheData[url]
  }
}

// ajaxCache.get('/schoolorg/v1/getCurrUserInfo').then(data => {
//   if (data) {

//   }
// })
// ajaxCache.clear('/schoolorg/v1/getCurrUserInfo')

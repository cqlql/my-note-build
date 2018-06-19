/* ajax 模拟，单元测试专用 */

let mockData = {}
let axiosTest = {
  get (url, config) {
    return new Promise(function (resolve, reject) {
      resolve({data: mockData[url]()})
    })
  },
  post (url, data) {
    // let config
    // if (process.env.NODE_ENV !== 'production') {
    //   config = config || {}
    //   config.headers = {'X-Sd-token': token}
    // }
    // return axios.post(server + url, data, config)
  },
  set (data) {
    for (const k in data) {
      if (data.hasOwnProperty(k)) {
        mockData[k] = data[k]
      }
    }
  }
}

window.axiosTest = axiosTest

export default axiosTest

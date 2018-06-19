
// 其他端
import axiosApp from './app'
// import axios from './web'

let axios = axiosApp
if (process.env.NODE_ENV !== 'production') {
  axios = window.axiosTest
}

export default axios

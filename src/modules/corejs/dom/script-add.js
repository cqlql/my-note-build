/**
 * 外链 script 增加
 * Created by cql on 2017/3/31.
 * */
export default function scriptAdd ({src, success = () => {}, error = () => {}, complete = () => {}, charset = 'utf-8'}) {
  let script = document.createElement('script')
  script.type = 'text/javascript'
  script.charset = charset
  script.src = src
  if ('onload' in script) {
    script.onload = function () {
      success()
      complete()
      script.remove()
    }
    script.onerror = function () {
      error()
      complete()
      script.remove()
    }
  } else { // ie 情况
    script.attachEvent('onreadystatechange', function () {
      if (script.readyState === 'complete' || script.readyState === 'loaded') {
        success()
        complete()
      }
    })
  }
  (document.head || document.body).appendChild(script)
}

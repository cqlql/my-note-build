/**
 * getServerGo
 *
 **/
export default function (url) {
  let server = 'https://api.shendupeiban.com'
  if (process.env.APP_TEST === 'true' || process.env.NODE_ENV !== 'production') {
    server = 'http://192.168.1.240:8127'
    if (/\/schoolorg\/v1/.test(url)) {
      server = 'http://192.168.1.240:8118'
    }
    if (/\/approve\/v1/.test(url)) {
      server = 'http://192.168.1.240:8125'
    }
    if (/\/leave\/v1/.test(url)) {
      server = 'http://192.168.1.240:8126'
    }
    if (/\/biztrip\/v1/.test(url)) {
      server = 'http://192.168.1.240:8127'
    }
    if (/\/announce\/v1/.test(url)) {
      server = 'http://192.168.1.240:8130'
    }
    if (/\/message\/v1/.test(url)) {
      server = 'http://192.168.1.240:8124'
    }
  }
  return server + url
}

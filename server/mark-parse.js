// import marked from 'marked'
// import highlight from 'highlight.js/lib/highlight.js'
const marked = require('marked')
const highlight = require('highlight.js/lib/highlight.js')
const BuildOutlint = require('./build-outline')
const minify = require('html-minifier').minify

// 代码高亮
// const highlight = require('highlight.js/lib/highlight.js')
highlight.registerLanguage('xml', require('highlight.js/lib/languages/xml'))
highlight.registerLanguage('css', require('highlight.js/lib/languages/css'))
highlight.registerLanguage('javascript', require('highlight.js/lib/languages/javascript'))
highlight.registerLanguage('typescript', require('highlight.js/lib/languages/typescript'))

const renderer = new marked.Renderer()
let hIndex = 0
let pre = 0
let hxNum = 0
let buildOutlint
renderer.heading = function (text, level) {
  buildOutlint.build(text, level)
  let hx = ''
  if (level > pre) {

  } else if (level === pre) {
    hx = '</section>'
  } else {
    hx = (new Array(hxNum - level + 2)).join('</section>')
    hxNum = level - 1
  }
  hx = `${hx}<section><h${level} id="${text.replace(/<[^>]+>/g, '')}" data-index="${hIndex}">${text}</h${level}>`
  hIndex++
  if (level !== pre) {
    hxNum++
  }
  pre = level
  return hx
}

marked.setOptions({
  renderer,
  highlight: function (code) {
    return highlight.highlightAuto(code).value
  }
})

module.exports = function (content) {
  hIndex = 0
  pre = 0
  hxNum = 0
  buildOutlint = BuildOutlint()

  content = marked(content)
  content = content + (new Array(hxNum + 1)).join('</section>')
  content = minify(content, {
    removeComments: true,
    collapseWhitespace: true,
    removeAttributeQuotes: true
    // more options:
    // https://github.com/kangax/html-minifier#options-quick-reference
  })
  return {
    outline: buildOutlint.getData(),
    content
  }
}

// export default function (content) {
//   content = marked(content)
//   content = content + (new Array(hxNum + 1)).join('</section>')
//   return content
// }

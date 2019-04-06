const marked = require('marked')
const BuildOutlint = require('./build-outline')
const minify = require('html-minifier').minify

module.exports = class MarkeParse {
  constructor () {
    // 代码高亮
    // 所有语言
    // const highlight = require('highlight.js')
    // 指定语言
    const hljs = require('highlight.js/lib/highlight.js')
    hljs.registerLanguage('xml', require('highlight.js/lib/languages/xml'))
    hljs.registerLanguage('css', require('highlight.js/lib/languages/css'))
    hljs.registerLanguage('javascript', require('highlight.js/lib/languages/javascript'))
    hljs.registerLanguage('typescript', require('highlight.js/lib/languages/typescript'))
    hljs.registerLanguage('nginx', require('highlight.js/lib/languages/nginx'))
    hljs.registerLanguage('dos', require('highlight.js/lib/languages/dos'))
    hljs.registerLanguage('bash', require('highlight.js/lib/languages/bash'))
    hljs.registerLanguage('shell', require('highlight.js/lib/languages/shell'))

    const renderer = new marked.Renderer()
    let hIndex = 0
    let pre = 0
    let hxNum = this.hxNum = 0
    renderer.heading = (text, level) => {
      this.buildOutlint.build(text, level)
      let hx = ''
      if (level === pre) {
        hx = '</section>'
      } else if (level < pre) {
        hx = (new Array(hxNum - level + 2)).join('</section>')
        hxNum = level - 1
      }
      hx = `${hx}<section><h${level} id="${text.replace(/<[^>]+>/g, '')}" data-index="${hIndex}">${text}</h${level}>`
      hIndex++
      if (level !== pre) {
        hxNum++
      }
      pre = level
      this.hxNum = hxNum
      return hx
    }

    marked.setOptions({
      renderer,
      highlight: function (code) {
        return hljs.highlightAuto(code).value
      }
    })
  }
  parser (content) {
    let buildOutlint = this.buildOutlint = BuildOutlint()
    content = marked(content)
    content = content + (new Array(this.hxNum + 1)).join('</section>')
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
}

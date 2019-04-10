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
    // let hIndex = 0
    // let pre = 0
    // let hxNum = this.hxNum = 0
    renderer.heading = (text, depth) => {
      this.buildOutlint.build(text, depth)
      let id = this.id
      let pre = this.pre
      let hIndex = this.hIndex
      let hxNum = this.hxNum
      let length = id.length = id.length - 1 - pre + depth
      id[length] = text
      let hx = ''
      if (depth === pre) {
        hx = '</section>'
      } else if (depth < pre) {
        hx = (new Array(hxNum - depth + 2)).join('</section>')
        hxNum = depth - 1
      }
      // hx = `${hx}<section><h${depth} id="${text.replace(/<[^>]+>/g, '')}" data-index="${hIndex}">${text}</h${depth}>`
      hx = `${hx}<section><h${depth} id='${JSON.stringify(id)}' data-index="${hIndex}">${text}</h${depth}>`
      hIndex++
      if (depth !== pre) {
        hxNum++
      }
      this.pre = depth
      this.hxNum = hxNum
      this.hIndex = hIndex
      return hx
    }

    marked.setOptions({
      renderer,
      highlight: function (code) {
        return hljs.highlightAuto(code).value
      }
    })

    this.indexs = []
  }
  parser (content, name) {
    let buildOutlint = this.buildOutlint = BuildOutlint()
    this.id = []
    this.pre = 0
    this.hxNum = 0
    this.hIndex = 0

    const tokens = marked.lexer(content)
    this.buildSearchIndexs(tokens, name)
    content = marked.parser(tokens)

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
  buildSearchIndexs (tokens, name) {
    let indexs = this.indexs
    let item = {
      name,
      outline: '',
      content: ''
    }
    let path = []
    let preDepth = 0
    tokens.forEach(({ type, depth, text }) => {
      if (type === 'heading') {
        let length = path.length = path.length - 1 - preDepth + depth
        path[length] = text
        item = {
          name,
          outline: JSON.stringify(path),
          content: ''
        }
        indexs.push(item)
        preDepth = depth
      } else if (text) {
        item.content += text + '\r\n'
      }
    })
  }
}

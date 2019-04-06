
const marked = require('marked')

const md = `
  # h1
  内容内容内容内容内容
  ## h2
  xxxxxxxxxxx
  ## h222
  ### h3
  2222222
  # h111



### 4 使用transform/opacity实现动画效果

在制作动画时，建议使用 

参考：
- [CSS Animation性能优化](https://www.w3cplus.com/animation/animation-performance.html)
- [渲染性能](http://www.wdshare.org/article/5770ed9753c50d1a18f64a97)


### 5 关于 rem 适配

直接用px写即可，已使用[postcss-pxtorem](https://github.com/cuth/postcss-pxtorem)自动转成rem。

不需要转换的px单位大写


## 自动化测试

单元测试目前使用 [karma](http://karma-runner.github.io/2.0/index.html) + [jasmine](https://jasmine.github.io)

e2e 测试待完成...
`

const tokens = marked.lexer(md)
console.log(tokens)

let indexs = []
let item
let path = []
let preDepth = 0
tokens.forEach(({ type, depth, text }) => {
  if (type === 'heading') {
    let length = path.length = path.length - 1 - preDepth + depth
    path[length] = text
    item = {
      'name': 'js',
      'outlinePath': JSON.stringify(path),
      'content': ''
    }
    indexs.push(item)
    preDepth = depth
  } else if (text) {
    item.content += text + '\r\n'
  }
})

const html = marked.parser(tokens)
console.log(html)

console.log(indexs)

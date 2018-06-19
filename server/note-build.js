const fs = require('fs')
const notePath = 'E:\\github\\my-note'

class NoteBuild {
  typeNames () {
    let names = {}
    fs.readdirSync(notePath).forEach(name => {
      if (/^(.git|.editorconfig)$/.test(name) === false) {
        name = name.replace(/\.md$/, '')
        names[name] = 1
      }
    })
    return Object.keys(names)
  }
  typeData () {
    const names = this.typeNames()

    const name = names[5]
    const dirPath = notePath + '\\' + name
    const filePath = dirPath + '.md'
    console.log(filePath)

    if (fs.existsSync(filePath)) {
      fs.readFile(filePath, 'utf8', function (err, data) {
        if (err) {
          console.log(err)
          return
        }
        console.log(data)
      })
    } else {

    }
  }
}

module.exports = new NoteBuild()
